import React,{Component} from "react";
import cookie from 'react-cookies'
import {AuthContext} from "../../Contexts/AuthContext";

export default class Logout extends Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props);
    }


    componentDidMount() {
        cookie.remove('access-token');
        this.context.setAuthenticated(false);
        this.props.history.push('/');
    }


    render() {
        return null;
    }

}