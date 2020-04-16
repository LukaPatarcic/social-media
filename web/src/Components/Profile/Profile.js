import * as React from "react";
import {MDBBadge, MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBIcon, MDBRow} from "mdbreact";
import {Link} from "react-router-dom";
import {setProfilePicture} from "../../Helpers";
import PostContainer from "../Post/PostContainer";
import PropTypes from 'prop-types';
import Loading from "../../Helpers/Loading";


export default class Profile extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        const {loading,user} = this.props;

        return (
            <MDBContainer>
                    <MDBRow className={'mt-5'}>
                        <MDBCol size={12} sm={12} md={10} className={'offset-md-1'}>
                            <MDBCard>
                                <MDBCardBody>
                                    <span className={'float-right'}>
                                        <Link to={'/profile/edit'} style={{color: 'black'}}>
                                            <MDBIcon icon={'ellipsis-v'} color={'black'} />
                                        </Link>
                                    </span>
                                    <MDBRow className={'d-flex align-items-center justify-content-center'}>
                                        <MDBCol size={4} sm={4} md={2} className={'offset-md-2'} >
                                            <Loading loading={loading}>
                                                <img
                                                    alt={''}
                                                    className={'img-fluid'}
                                                    src={setProfilePicture(user.firstName,user.lastName,128)}
                                                />
                                            </Loading>
                                        </MDBCol>
                                        <MDBCol size={8}>
                                            <h3>
                                               <Loading loading={loading}>
                                                   {' '+user.profileName}<br />
                                               </Loading>
                                            </h3>
                                            <h6>
                                                <Loading loading={loading}>
                                                    {` ${user.firstName} ${user.lastName}`}
                                                </Loading>
                                            </h6>
                                            <MDBRow>
                                                <MDBCol sm={6} md={3}>
                                                    Followers:{'\u00A0'}
                                                    <Loading loading={loading}>
                                                        <MDBBadge style={{fontSize: 14}} color={'red'}>{user.followers}</MDBBadge>
                                                    </Loading>
                                                </MDBCol>
                                                <MDBCol sm={6} md={3}>
                                                    Following:{'\u00A0'}
                                                    <Loading loading={loading}>
                                                        <MDBBadge style={{fontSize: 14}} color={'red'}>{user.following}</MDBBadge>
                                                    </Loading>
                                                </MDBCol>
                                            </MDBRow>
                                        </MDBCol>
                                    </MDBRow>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol sm={12}>
                            {loading ? null : <PostContainer onlyMe={true} profile={user.id} />}
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
        );
    }
}

Profile.propTypes = {
    loading: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired
};