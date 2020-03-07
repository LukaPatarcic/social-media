import * as React from "react";
import cookie from 'react-cookies'
import {AuthContext} from "../../Contexts/AuthContext";

export default class Logout extends React.Component {
    constructor(props) {
        super(props);
    }
    static contextType = AuthContext;
    render() {

        cookie.remove('access-token');
        this.context.setAuthenticated(false);
        this.props.history.push('/');
        return null;
    }

}