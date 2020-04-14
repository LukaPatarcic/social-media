import * as React from "react";
import {MDBBadge, MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBIcon, MDBRow} from "mdbreact";
import PostCreate from "../Post/PostCreate";
import {Link} from "react-router-dom";
import {setProfilePicture} from "../../Helpers";
import PostContainer from "../Post/PostContainer";
import {ClipLoader} from "react-spinners";
import PropTypes from 'prop-types';


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
                                            {loading ?
                                                <ClipLoader
                                                    sizeUnit={"px"}
                                                    size={20}
                                                    color={'#f00'}
                                                    loading={loading}
                                                />
                                                :
                                                <img
                                                    alt={''}
                                                    className={'img-fluid'}
                                                    src={setProfilePicture(user.firstName,user.lastName,128)}
                                                />
                                            }
                                        </MDBCol>
                                        <MDBCol size={8}>
                                            <h3>
                                                {loading ?
                                                    <ClipLoader
                                                        sizeUnit={"px"}
                                                        size={20}
                                                        color={'#f00'}
                                                        loading={loading}
                                                    />
                                                    :
                                                    <>{' '+user.profileName}<br /></>
                                                }
                                            </h3>
                                            <h6>
                                                {loading ?
                                                    <ClipLoader
                                                        sizeUnit={"px"}
                                                        size={20}
                                                        color={'#f00'}
                                                        loading={loading}
                                                    />
                                                    :
                                                    user.firstName + ' ' + user.lastName
                                                }
                                            </h6>
                                            <MDBRow>
                                                <MDBCol sm={6} md={3}>
                                                    Followers:{'\u00A0'}
                                                    {loading ?
                                                        <ClipLoader
                                                            sizeUnit={"px"}
                                                            size={20}
                                                            color={'#f00'}
                                                            loading={loading}
                                                        />
                                                        :
                                                        <MDBBadge style={{fontSize: 14}} color={'red'}>{user.followerCount}</MDBBadge>
                                                    }
                                                </MDBCol>
                                                <MDBCol sm={6} md={3}>
                                                    Following:{'\u00A0'}
                                                    {loading ?
                                                        <ClipLoader
                                                            sizeUnit={"px"}
                                                            size={20}
                                                            color={'#f00'}
                                                            loading={loading}
                                                        />
                                                        :
                                                        <MDBBadge style={{fontSize: 14}} color={'red'}>{user.followingCount}</MDBBadge>
                                                    }
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

Profile.propTypes = {
    loading: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired
};