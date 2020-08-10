import React,{Component} from "react";
import PropTypes from 'prop-types'
import {MDBBadge, MDBCol, MDBModal, MDBModalBody, MDBModalHeader, MDBRow, MDBTooltip} from "mdbreact";
import Loading from "../../Helpers/Loading";
import {ClipLoader} from "react-spinners";
import {Link} from "react-router-dom";
import {setProfilePicture} from "../../Helpers";
import TimeAgo from "react-timeago";
import {getUsers} from "../../Api/followers";
import toastr from 'toastr'

export default class FollowContainer extends Component{
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            loading: false,
            hasMoreUsers: false,
            loadingMoreUsers: false,
            data: [],
            offset: 0,
            header: ''
        }

        this.toggle = this.toggle.bind(this);
        this.getUsers = this.getUsers.bind(this);
    }

    toggle(followers = true) {
        this.setState({
            header: followers ? 'Followers' : 'Following',
            modal: !this.state.modal
        },() => {
            if(this.state.modal) {
                this.getUsers(followers)
            } else {
                this.setState({loading: false, hasMoreUsers: false, loadingMoreUsers: false, data: [], offset: 0, header: ''})
            }
        })
    }

    getUsers(followers) {
        const {offset} = this.state;
        const {profileId} = this.props;
        let url = followers ? `/followers` : `/following`
        url += `?offset=${offset}&profileId=${profileId}`;
        this.setState({loading: true})
        getUsers(url)
            .then(response => {
                this.setState((prevSate) => ({
                    data: [...prevSate.data,...response],
                    offset: prevSate.offset + 10,
                    loading: false,
                    hasMoreUsers: response.length >= 10,
                    loadingMoreUsers: false,
                }));
            })
            .catch(err => err.response.json().then(err => {
                toastr.error(err.error);
                this.setState({
                    loading: false,
                    loadingMoreUsers: false,
                });
            }))
    }

    render() {
        const {loading,followers,following} = this.props;
        const {modal,data,hasMoreUsers,loadingMoreUsers,header} = this.state;
        return (
            <>
            <MDBCol className={'click'} sm={6} md={4} lg={4} xl={3} onClick={() => this.toggle(true)}>
                Followers:{'\u00A0'}
                <Loading loading={loading}>
                    <MDBBadge style={{fontSize: 14}} color={'red'}>{followers}</MDBBadge>
                </Loading>
            </MDBCol>
            <MDBCol className={'click'} sm={6} md={4} lg={4} xl={3} onClick={() => this.toggle(false)}>
                Following:{'\u00A0'}
                <Loading loading={loading}>
                    <MDBBadge style={{fontSize: 14}} color={'red'}>{following}</MDBBadge>
                </Loading>
            </MDBCol>
            <MDBModal size={'md'} isOpen={modal} toggle={this.toggle}>
                <MDBModalHeader toggle={this.toggle}>{header}</MDBModalHeader>
                <MDBModalBody style={{height: 600,overflowY: 'scroll'}}>
                    <Loading loading={loading} size={100} color={'#f00'}>
                        {data.map((user,index) => (
                            <MDBRow key={index} className={'mb-3'}>
                                <MDBCol size={2} className={'pr-0 d-flex justify-content-start align-items-center'}>
                                    <Link onClick={() => this.setState({modal: false})}  to={'/profile/' + user.profileName}>
                                        <img
                                            className={'img-fluid rounded-circle'}
                                            src={user.profilePicture ? user.profilePicture : setProfilePicture(user.firstName,user.lastName,45)}
                                            alt={''}
                                        />
                                    </Link>
                                </MDBCol>
                                <MDBCol size={10} className={'pl-0'}>
                                    <h5 className={'mb-0'}>
                                        <MDBTooltip>
                                            <Link
                                                onClick={() => this.setState({modal: false})}
                                                className={'text-dark'}
                                                to={'/profile/' + user.profileName}
                                            >
                                                {user.profileName}
                                            </Link>
                                            <div>{user.firstName+' '+user.lastName}</div>
                                        </MDBTooltip>

                                    </h5>
                                    <small className={'text-muted'} style={{fontSize: 11}}><TimeAgo
                                        date={user.createdAt}/></small>
                                </MDBCol>
                            </MDBRow>
                        ))}
                    </Loading>
                    {hasMoreUsers ?
                        (loadingMoreUsers ?
                                <div className={'text-center mt-3'}>
                                    <ClipLoader
                                        sizeUnit={"px"}
                                        size={100}
                                        color={'#f00'}
                                        loading={loadingMoreUsers}
                                    />
                                </div>
                                :
                                !loading ?
                                    <p className={'text-center'} onClick={() => this.getUsers()}><a href={'#'} className={'text-dark'}>Load more (+)</a></p>
                                    :null
                        )
                        :
                        <p className={'text-center text-dark'}>No more results...</p>
                    }
                </MDBModalBody>
            </MDBModal>
            </>
        );
    }
}

FollowContainer.propTypes = {
    followers: PropTypes.number,
    following: PropTypes.number,
    loading: PropTypes.bool.isRequired,
    profileId: PropTypes.number.isRequired
}