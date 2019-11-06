import * as React from "react";
import FacebookLogin from "react-facebook-login";
import cookie from "react-cookies";
import {Redirect} from "react-router-dom";

export default class FacebookAuthLogin extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            redirect: false
        }

    }

    render() {

        const responseFacebook = (response) => {
            console.log(response);
            cookie.save('facebook-access-token',response.accessToken);
            this.setState({
                redirect: true
            });
        };
        if(this.state.redirect) {

            return (
                <Redirect to={'/profile'} />
            );
        }

        return (
            <FacebookLogin
                appId="1189985861185629"
                fields="email,picture"
                scope="
                                public_profile,email,user_photos,
                                user_age_range,user_birthday,
                                user_gender,user_likes,user_posts,
                                user_status,user_location,user_friends
                                "
                returnScopes={true}
                callback={responseFacebook}
            />
        );
    }

}