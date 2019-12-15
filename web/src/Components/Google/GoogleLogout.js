import * as React from "react";
import cookie from 'react-cookies'
import {Redirect} from "react-router-dom";

export default class GoogleLogout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToLogin: false
        }
        this.logout = this.logout.bind(this);

    }

    logout() {
        cookie.remove('google-access-token');
        this.setState({
            redirectToLogin: true
        })
    }

    render() {
        if(this.state.redirectToLogin) {
            return (<Redirect to={'/profile'}/>)
        }
        return (
            <a onClick={this.logout} href={'#'}>Google Logout</a>
        );
    }

}