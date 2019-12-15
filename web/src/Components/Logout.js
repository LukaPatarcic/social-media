import * as React from "react";
import cookie from 'react-cookies'
import {Redirect} from "react-router-dom";

export default class Logout extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        cookie.remove('access-token');
        this.props.history.push('/');
        window.location.reload(true);
        return (<React.Fragment/>);
    }

}