import * as React from "react";
import cookie from 'react-cookies'
import FacebookProfile from "../OAuth/Facebook/FacebookProfile";
import {MDBBadge, MDBCard, MDBCardBody, MDBCardHeader, MDBCol, MDBContainer, MDBIcon, MDBRow} from "mdbreact";
import FacebookAuthLogin from "../OAuth/Facebook/FacebookAuthLogin";
import GoogleProfile from "../OAuth/Google/GoogleProfile";
import GoogleAuthLogin from "../OAuth/Google/GoogleAuthLogin";
import PostList from "../Post/PostList";
import PostCreate from "../Post/PostCreate";
import {googleData} from "../OAuth/Facebook/Google";
import {facebookData} from "../OAuth/Facebook/Facebook";
import Followers from "./Followers";
import Following from "./Following";
import {Link, Redirect} from "react-router-dom";
import {BASE_URL} from "../../Config";
import {setProfilePicture} from "../../Helpers";
import PostContainer from "../Post/PostContainer";


export default class Profile extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        const {loading,user} = this.props;
        if(loading) {
            return <p>Loading...</p>
        }

        return (
            <MDBContainer>
                    <MDBRow className={'mt-5'}>
                        <MDBCol size={12} sm={12} md={10} className={'offset-md-1'}>
                            <MDBCard>
                                <MDBCardBody>
                                    <span className={'float-right'}>
                                        <Link to={{
                                            pathname: '/profile/edit',
                                            state: this.props.user
                                        }}>
                                            <MDBIcon icon={'ellipsis-v'} />
                                        </Link>
                                    </span>
                                    <MDBRow className={'d-flex align-items-center justify-content-center'}>
                                        <MDBCol size={4} sm={4} md={2} className={'offset-md-2'} >
                                            <img
                                                className={'img-fluid'}
                                                src={setProfilePicture(user.firstName,user.lastName,128)}
                                            />
                                        </MDBCol>
                                        <MDBCol size={8}>
                                            <h3>
                                                {' '+user.profileName}<br />
                                            </h3>
                                            <h6>
                                                {user.firstName+' '+user.lastName}
                                            </h6>
                                            <MDBRow>
                                                <MDBCol sm={6} md={3}>
                                                    Followers: <MDBBadge style={{fontSize: 14}} color={'red'}>{user.followerCount}</MDBBadge><br/>
                                                </MDBCol>
                                                <MDBCol sm={6} md={3}>
                                                    Following: <MDBBadge style={{fontSize: 14}} color={'red'}>{user.followingCount}</MDBBadge><br/>
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
                            <PostCreate />
                            <PostContainer onlyMe={true} />
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
        );
    }
}