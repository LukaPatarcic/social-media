import React,{Component} from "react";
import {MDBBadge, MDBCardBody, MDBCol, MDBModal, MDBModalBody, MDBModalHeader, MDBRow, MDBTooltip} from "mdbreact";
import {ClipLoader} from "react-spinners";
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import {setProfilePicture} from "../../Helpers";
import TimeAgo from "react-timeago";

export default class PostLikes extends Component{
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({modal: !this.state.modal},() => {
            if(this.state.modal){
                this.props.getPostLikes(this.props.postId);
            }
        });
    }

    render() {
        const {likes,likeCount,getPostLikes,loadingPostLikes,loadingMorePostLikes,hasMorePostLikes} = this.props;
        const {modal} = this.state;
        return (
            <>
                <a href={'#'} className={'text-dark'} onClick={this.toggle}>
                    <span className={'mr-3'}>
                        Likes <MDBBadge style={{fontSize: 14}} color={'red'}>{likeCount}</MDBBadge>
                    </span>
                </a>
                <MDBModal size={'md'} isOpen={modal} toggle={this.toggle}>
                    <MDBModalHeader toggle={this.toggle}>Likes ({likeCount})</MDBModalHeader>
                    <MDBModalBody style={{height: 600,overflowY: 'scroll'}}>
                        {loadingPostLikes ?
                            <div className={'text-center mt-3'}>
                                <ClipLoader
                                    sizeUnit={"px"}
                                    size={100}
                                    color={'#f00'}
                                    loading={loadingPostLikes}
                                />
                            </div>
                            :
                            likes.map((like,index) => (
                                <MDBRow key={index} className={'mb-3'}>
                                    <MDBCol size={2} className={'pr-0 d-flex justify-content-start align-items-center'}>
                                        <Link  to={'/profile/' + like.profileName}>
                                            <img
                                                className={'img-fluid'}
                                                src={setProfilePicture(like.firstName,like.lastName)}
                                                alt={''}
                                            />
                                        </Link>
                                    </MDBCol>
                                    <MDBCol size={10} className={'pl-0'}>
                                        <h5 className={'mb-0'}>
                                            <MDBTooltip>
                                                <Link
                                                    className={'text-dark'}
                                                    to={'/profile/' + like.profileName}
                                                >
                                                    {like.profileName}
                                                </Link>
                                                <div>{like.firstName+' '+like.lastName}</div>
                                            </MDBTooltip>

                                        </h5>
                                        <small className={'text-muted'} style={{fontSize: 11}}><TimeAgo
                                            date={like.createdAt}/></small>
                                    </MDBCol>
                                </MDBRow>
                            ))
                        }
                        {hasMorePostLikes ?
                            (loadingMorePostLikes ?
                                    <div className={'text-center mt-3'}>
                                        <ClipLoader
                                            sizeUnit={"px"}
                                            size={100}
                                            color={'#f00'}
                                            loading={loadingMorePostLikes}
                                        />
                                    </div>
                                    :
                                    !loadingPostLikes ?
                                        <p className={'text-center'} onClick={() => getPostLikes()}><a href={'#'} className={'text-dark'}>Load more (+)</a></p>
                                        :null
                            )
                            :
                            <p className={'text-center text-dark'}>No more likes...</p>
                        }
                    </MDBModalBody>
                </MDBModal>
            </>
        );
    }
}

PostLikes.propTypes = {
    likes: PropTypes.array.isRequired,
    postId: PropTypes.number.isRequired,
    likeCount: PropTypes.number.isRequired,
    getPostLikes: PropTypes.func.isRequired,
    loadingPostLikes: PropTypes.bool.isRequired,
    loadingMorePostLikes: PropTypes.bool.isRequired,
    hasMorePostLikes: PropTypes.bool.isRequired,
}