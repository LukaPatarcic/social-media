import * as React from "react";
import cookie from 'react-cookies'
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import {Col, Container, Image, ListGroup, Row} from "react-bootstrap";
import {Redirect} from "react-router-dom";
import FacebookProfile from "../Components/Facebook/FacebookProfile";
import GoogleProfile from "../Components/Google/GoogleProfile";

export default class Profile extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            facebookData: null,
            googleData: null,
            hasGoogleAccount: false,
            hasFacebookAccount: false
        }
    }

    componentDidMount() {
        if(cookie.load('facebook-access-token')) {
            this.setState({
                hasFacebookAccount: true
            });
            fetch('http://localhost:8000/connect/facebook/get/user',{
                method: "POST",
                body: JSON.stringify({'facebook-access-token': cookie.load('facebook-access-token')})

            })
                .then(response => response.json())
                .then(data => {this.setState({facebookData: data})})
                .catch(err => {
                    this.setState({
                        redirectToLogin: true
                    })
                });

        }

        if(cookie.load('facebook-access-token')) {
            this.setState({
                hasGoogleAccount: true
            });
            let url = new URL('https://www.googleapis.com/oauth2/v1/userinfo');
            let params = {'access_token': cookie.load('google-access-token')};
            url.search = new URLSearchParams(params).toString();

            fetch(url)
                .then(response => response.json())
                .then(data => {this.setState({googleData: data})})
                .catch(err => {
                });


        }

    }

    render() {
        if(this.state.facebookData === null) {
            return null;
        }

        if(this.state.redirectToLogin) {
            return (<Redirect to='/login'/>)
        }

        const {first_name,last_name,gender,age_range,picture,birthday,friends} = this.state.facebookData;
        return (
            <Container>
                <Row>
                    <Col sm={6}>
                        <h1>Facebook Profile</h1>
                        <FacebookProfile facebookData={this.state.facebookData}/>
                    </Col>
                    <Col sm={6}>

                        <h1>Google Profile</h1>
                        <GoogleProfile googleData={this.state.googleData}/>
                    </Col>
                </Row>
            </Container>

        );
    }
}