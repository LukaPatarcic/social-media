import * as React from "react";
import cookie from 'react-cookies'
import {Redirect} from "react-router-dom";
import {MDBBtn} from "mdbreact";

export default class FacebookLogout extends React.Component {

    logout() {
        cookie.remove('facebook-access-token');
        window.location.reload(true);
    }

    render() {

        return (
            <MDBBtn color={'blue'} onClick={this.logout}> Logout</MDBBtn>
        );
    }
}