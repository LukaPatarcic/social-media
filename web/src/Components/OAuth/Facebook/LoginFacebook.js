import React from "react";
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import {Redirect} from "react-router-dom";
import Profile from "../../Feed/Feed";

export default class LoginFacebook extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            facebookData: {}
        }

        this.responseFacebook = this.responseFacebook.bind(this);
    }

    responseFacebook(response) {
        this.setState({
            facebookData: response
        })
    }

    render() {
        return (
            <React.Fragment>
                <FacebookLogin
                    appId="1189985861185629"
                    autoLoad={true}
                    fields="name,email,picture"
                    redirectUri={'http://localhost:3000/profile'}
                    scope={'user_profile'}
                    cookie={true}
                    callback={this.responseFacebook}
                    render={() => <div></div>}
                />
                <Profile user={this.state.facebookData}/>
            </React.Fragment>

        );
    }
}