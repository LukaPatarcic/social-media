import * as React from "react";
import cookie from 'react-cookies'
import FacebookProfile from "../Components/Facebook/FacebookProfile";
import {MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBRow} from "mdbreact";
import FacebookAuthLogin from "../Components/Facebook/FacebookAuthLogin";
import GoogleProfile from "../Components/Google/GoogleProfile";
import GoogleAuthLogin from "../Components/Google/GoogleAuthLogin";
import PostItem from "../Components/Post/PostItem";
import PostCreate from "../Components/Post/PostCreate";

export default class Profile extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            userData: {
                firstName: '',
                lastName: '',
                profileName: '',
                email: ''
            },
            posts: [],
            facebookData: null,
            googleData: null,
            hasGoogleAccount: false,
            hasFacebookAccount: false,
            loading: false
        }
    }

    getPosts() {
        fetch('https://api.allshak.lukaku.tech/post/user',{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN': cookie.load('access-token')
            },
            method: "GET"
        })
            .then((response => response.json()))
            .then((data => {
                this.setState({loading: false, posts: data});
            }))
            .catch(err => {
                this.setState({error: true,loading: false});
            })
    }

    componentDidMount() {

        if(!cookie.load('access-token')) {
            this.props.history.push('/login')
        }

        this.getPosts();

        if(cookie.load('access-token')) {
            fetch('https://api.allshak.lukaku.tech/get/user',{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-AUTH-TOKEN': cookie.load('access-token')
                }
            })
                .then(response => response.json())
                .then(data => {
                    this.setState({
                        userData: {
                            firstName: data.firstName,
                            lastName: data.lastName,
                            profileName: data.profileName,
                            email: data.email,
                        }
                    });
                })
        }

        if(cookie.load('facebook-access-token')) {
            fetch('https://api.allshak.lukaku.tech/connect/facebook/get/user',{
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-AUTH-TOKEN': cookie.load('access-token'),
                    'facebook-access-token': cookie.load('facebook-access-token')
                }

            })
                .then(response => {
                    if(response.status > 400 && response.status < 500) {
                        throw Error('Invalid credentials please log in again');
                    }
                    return response.json()
                })
                .then(data => {
                    this.setState({facebookData: data})
                })
                .catch(err => {
                    cookie.remove('facebook-access-token');
                });
        }

        if(cookie.load('google-access-token')) {
            let url = new URL('https://www.googleapis.com/oauth2/v1/userinfo');
            let params = {'access_token': cookie.load('google-access-token')};
            url.search = new URLSearchParams(params).toString();

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    this.setState({googleData: data})
                })
                .catch(err => {
                });

        }

    }

    render() {
        const {firstName,lastName,profileName,email} = this.state.userData;
        const {posts} = this.state;

        return (
            <MDBContainer>
                <MDBRow className={'mt-5'}>
                    <MDBCol sm={12} className={'px-0 border-top border-left border-right'}>
                        <img alt={'Banner'} className={'img-fluid'} style={{height: 400,width: '100%'}} src={'images/profile_banner.png'}/>
                    </MDBCol>
                    <MDBCol sm={12} className={'px-0'}>
                        <MDBCard>
                            <MDBCardBody>
                                <img className={'img-fluid'} style={{position: "relative", bottom: 60}} src={'https://eu.ui-avatars.com/api/?rounded=true&background=f44336&color=ffffff&size=128&name='+firstName+'+'+lastName} />
                                <p>{firstName+' '+lastName}({profileName})</p>
                                {email}
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
                <PostCreate size={12}/>
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
                <MDBRow>
                    <MDBCol className={'mt-5'} sm={12}>
                        {(!this.state.facebookData || !this.state.googleData) &&
                        <MDBCard>
                            <MDBCardBody>
                                { !this.state.facebookData && <FacebookAuthLogin />}
                                { !this.state.googleData && <GoogleAuthLogin />}
                            </MDBCardBody>
                        </MDBCard>}
                        { this.state.facebookData &&
                            <FacebookProfile facebookData={this.state.facebookData} />
                        }
                        { this.state.googleData &&
                            <GoogleProfile googleData={this.state.googleData} />
                        }
                    </MDBCol>
                </MDBRow>
            </MDBContainer>

        );
    }
}