import React,{Component} from "react";
import {Redirect} from "react-router-dom";
import {COOKIE_TTL} from "../../Config";
import {AuthContext} from "../../Contexts/AuthContext";
import {login} from "../../Api/security";
import cookie from 'react-cookies'
import ls from 'local-storage';
import LoginForm from "./LoginForm";

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: '',
            loading: false,
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.clearErrorMessage = this.clearErrorMessage.bind(this);

        document.title = 'Allshak | Login';
    }

    static contextType = AuthContext;

    handleSubmit(email,password) {

        this.setState({loading: true});
        login(email,password)
            .then(response => {
                cookie.save('access-token', response.token,{maxAge: COOKIE_TTL, secure: true});
                ls.set('user',response.user)
                this.context.setAuthenticated(true);
            })
            .catch(err => {
                err.response.json().then(err => {
                    this.setState({error: err.error,loading: false});
                })
            })
    }

    clearErrorMessage() {
        this.setState({error: ''})
    }

    render() {

        const {authenticated} = this.context;

        if(authenticated) {
            return (
                <Redirect to={'/'} />
            )
        }
        return (
            <LoginForm
                {...this.state}
                {...this.props}
                onHandleSubmit={this.handleSubmit}
                clearErrorMessage={this.clearErrorMessage}
            />
            )
    }
}