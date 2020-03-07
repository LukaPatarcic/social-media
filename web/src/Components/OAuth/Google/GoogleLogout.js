import * as React from "react";
import cookie from 'react-cookies'
import {Redirect} from "react-router-dom";
import {MDBBtn} from "mdbreact";

export default class GoogleLogout extends React.Component {

    logout() {
        cookie.remove('google-access-token');
        window.location.reload(true);
    }

    render() {

        return (
            <MDBBtn color={'grey'} onClick={this.logout}> Logout</MDBBtn>
        );
    }

}