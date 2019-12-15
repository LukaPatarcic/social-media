import * as React from "react";
import FacebookLogin from "react-facebook-login";
import cookie from "react-cookies";
import {Redirect} from "react-router-dom";
import GoogleLogin from "react-google-login";

export default class GoogleAuthLogin extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            redirect: false
        }

    }

    render() {

        const responseGoogle = (response) => {
            console.log(response);
            cookie.save('google-access-token',response.accessToken);
            this.setState({
                redirect: true
            });
        };

        if(this.state.redirect) {
            window.location.reload(true);
            return (
            <React.Fragment/>
            );
        }

        return (
            <GoogleLogin
                clientId="292960777305-ftkcpdoccdqft12kh1oqsvvtsv8c62kl.apps.googleusercontent.com"
                buttonText="LOGIN WITH GOOGLE"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
            />
        );
    }

}