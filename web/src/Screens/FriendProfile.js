import * as React from "react";
import cookie from 'react-cookies'
import FacebookProfile from "../Components/Facebook/FacebookProfile";
import {MDBBadge, MDBCard, MDBCardBody, MDBCardHeader, MDBCol, MDBContainer, MDBIcon, MDBRow} from "mdbreact";
import FacebookAuthLogin from "../Components/Facebook/FacebookAuthLogin";
import GoogleProfile from "../Components/Google/GoogleProfile";
import GoogleAuthLogin from "../Components/Google/GoogleAuthLogin";
import PostItem from "../Components/Post/PostItem";
import PostCreate from "../Components/Post/PostCreate";
import {googleData} from "../services/Google";
import {facebookData} from "../services/Facebook";
import Followers from "../Components/Profile/Followers";
import Following from "../Components/Profile/Following";

export default class FriendProfile extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            userData: {
                user: {},
                posts: [],
                following: [],
                followers: []
            },
            facebookData: null,
            googleData: null,
            hasGoogleAccount: false,
            hasFacebookAccount: false,
            loading: false,
            error: false,
            username: this.props.match.params.username
        }
    }

    getUser() {
        this.setState({loading: true});
        fetch('https://api.allshak.lukaku.tech/search/user/' + this.state.username,{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN': cookie.load('access-token')
            },
            method: "GET"
        })
            .then((response => {
                if(response.status == 404) {
                    throw new Error()
                }
                return response.json()
            }))
            .then((data => {
                this.setState({userData: data,loading: false});
            }))
            .catch(err => {
                this.setState({error: true,loading: false});
            })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.username !== this.props.match.params.username) {
            this.setState({username: nextProps.match.params.username},()=>
                this.getUser()
            )
        }
    }

    componentDidMount() {
        this.getUser();

        if(!cookie.load('access-token')) {
            this.props.history.push('/login')
        }
    }

    render() {
        const {user,following,followers,posts} = this.state.userData;
        const {loading,error} = this.state;

        if(error) {
            this.props.history.push('/notfound')
            return (
                <></>
            )
        }

        return (
            <MDBContainer>
                <MDBRow className={'mt-5'}>
                    <MDBCol sm={12} className={'px-0 border-top border-left border-right'}>
                        <MDBCard className={'p-0'}>
                            <MDBCardBody className={'p-0'}>
                                <img alt={'Banner'} className={'img-fluid'} style={{height: 400,width: '100%'}} src={'../images/profile_banner.png'}/>
                                <img
                                    className={'img-fluid'}
                                    style={{position: "relative", bottom: 60}}
                                    src={'https://eu.ui-avatars.com/api/?rounded=true&background=f44336&color=ffffff&size=128&name='+user.firstName+'+'+user.lastName}
                                />
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
                <MDBRow>
                    <MDBCol sm={12} md={4} className={'mt-3'}>
                        <MDBRow>
                            <MDBCol sm={12}>
                                <MDBCard>
                                    <MDBCardHeader className={'text-center'}>
                                        User Info
                                    </MDBCardHeader>
                                    <MDBCardBody>
                                        First name: <span className={'text-danger'}>{user.firstName}</span><br/>
                                        Last name: <span className={'text-danger'}>{user.lastName}</span><br/>
                                        Username: <span className={'text-danger'}>{user.profileName}</span><br/>
                                        Followers: <MDBBadge style={{fontSize: 14}} color={'red'}>{user.followerCount}</MDBBadge><br/>
                                        Following: <MDBBadge style={{fontSize: 14}} color={'red'}>{user.followingCount}</MDBBadge><br/>
                                    </MDBCardBody>
                                </MDBCard>
                            </MDBCol>
                            <MDBCol sm={12} className={'mt-3'}>
                                <Followers followers={followers} />
                            </MDBCol>
                            <MDBCol sm={12} className={'mt-3'}>
                               <Following following={following} />
                            </MDBCol>
                        </MDBRow>
                    </MDBCol>
                    <MDBCol sm={12} md={8}>
                        <MDBRow>
                            <MDBCol sm={12}>
                                {posts.length
                                    ?
                                    posts.map((post,index) =>
                                        <PostItem key={index} post={post} size={12} />
                                    )
                                    :
                                    <MDBCol className={'mt-5'} sm={12}>
                                        <MDBCard>
                                            <MDBCardBody>
                                                <h2 className={'text-center'}>No posts yet...</h2>
                                            </MDBCardBody>
                                        </MDBCard>
                                    </MDBCol>
                                }
                            </MDBCol>
                        </MDBRow>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>

        );
    }
}