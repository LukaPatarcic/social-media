import React,{Component} from "react";
import cookie from 'react-cookies'
import {AuthContext} from "../../Contexts/AuthContext";
import ls from 'local-storage'

export default class Logout extends Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props);
    }


    componentDidMount() {
        cookie.remove('access-token');
        ls.remove('user');
        this.context.setAuthenticated(false);
        this.props.history.push('/');
    }


    render() {
        return null;
    }

}