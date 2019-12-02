import React from "react";
import cookie from "react-cookies";
import {Link, Redirect} from "react-router-dom";
import LoginErrorMessage from "./LoginErrorMessage";

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            error: '',
            data: [],
            loading: true,
            email: '',
            password: '',
        }
        this.sendData = this.sendData.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    sendData(e) {
        e.preventDefault();

        fetch('http://localhost:8000/login',{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                "email" : this.state.email,
                "password" : this.state.password
            })
        })
            .then((response => response.json()))
            .then((data => {
                this.setState({
                    error: data.error
                });
                if(data.token) {
                    cookie.save('token', data.token);
                    cookie.save('email',this.state.email);
                    this.setState({
                        error: 'Success'
                    })
                }
            }))
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
        return (
            <React.Fragment>
                <div className={'row'}>
                    <div className={'col-sm-4 offset-sm-4 mt-5'}>P
                        <form onSubmit={this.sendData}>
                            <label htmlFor={'email'}>Email</label>
                            <input className={'form-control'} value={this.state.email} onChange={this.handleChange} type={'text'} name={'email'}/>
                            <label htmlFor={'password'}>Password</label>
                            <input className={'form-control'} value={this.state.password} onChange={this.handleChange} type={'password'} name={'password'}/>
                            <button type={'submit'} className={'btn btn-primary btn-block mt-3'}>Submit</button>
                        </form>
                        <LoginErrorMessage string={this.state.name} error={this.state.error}/>
                    </div>
                </div>
                <Link to="/">Back</Link>
                {this.state.error == 'Success' ? <Redirect to="/" /> : ''}
            </React.Fragment>
        );
    }
}