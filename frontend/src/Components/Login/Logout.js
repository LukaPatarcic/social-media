import * as React from "react";
import cookie from 'react-cookies'
import {Redirect} from "react-router-dom";

export default class Logout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToLogin: false
        }
        this.logout = this.logout.bind(this);

    }

    logout() {
        cookie.remove('token');
        this.setState({
            redirectToLogin: true
        })
    }

    render() {
        if(this.state.redirectToLogin) {
            return (<Redirect to={'/login'}/>)
        }
        return (
            <a onClick={this.logout} href={'#'}>Logout</a>
        );
    }

}