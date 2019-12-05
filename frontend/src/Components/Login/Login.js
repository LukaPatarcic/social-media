import React from "react";
import cookie from "react-cookies";
import {Link, Redirect} from "react-router-dom";
import LoginErrorMessage from "./LoginErrorMessage";
import {MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBIcon, MDBInput, MDBRow} from "mdbreact";
import { BrowserRouter as Router } from 'react-router-dom';
import Navigation from "../Navigation";

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


        let elem = document.querySelector('body');
        elem.classList.add('background');
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
            <Router>
                <Navigation/>
                <MDBContainer>
                    {this.state.error == 'Success' ? <Redirect to="/" /> : ''}
                    <MDBRow>
                        <MDBCol md={6} sm={12} className={'mx-auto mt-5'}>
                            <MDBCard>
                                <div className="header pt-3 red">
                                    <MDBRow className="mt-2 mb-3 d-flex justify-content-center">
                                       <img className={'img-fluid'} src={'./images/logo.svg'} />
                                    </MDBRow>
                                    <MDBRow className="d-flex justify-content-center">
                                        <h3 className="white-text mb-3 pt-3 font-weight-bold">
                                            Log in
                                        </h3>
                                    </MDBRow>
                                </div>
                                <MDBCardBody className="mx-4 mt-4">
                                    <MDBInput label="Your email" group type="text" validate value={this.state.email} onChange={this.handleChange} name={'email'} />
                                    <MDBInput
                                        value={this.state.password}
                                        onChange={this.handleChange}
                                        name={'password'}
                                        label="Your password"
                                        group
                                        type="password"
                                        validate
                                        containerClass="mb-0"
                                    />
                                    <LoginErrorMessage string={this.state.name} error={this.state.error}/>
                                    <p className="font-small grey-text d-flex justify-content-end">
                                        Forgot
                                        <a
                                            href="#!"
                                            className="dark-grey-text ml-1 font-weight-bold"
                                        >
                                            Password?
                                        </a>
                                    </p>
                                    <MDBRow className="d-flex align-items-center mb-4 mt-5">
                                        <MDBCol md="5" className="d-flex align-items-start">
                                            <div className="text-center">
                                                <MDBBtn
                                                    color="elegant"
                                                    rounded
                                                    type="button"
                                                    className="z-depth-1a"
                                                    onClick={this.sendData}
                                                >
                                                    Log in
                                                </MDBBtn>
                                            </div>
                                        </MDBCol>
                                        <MDBCol md="7" className="d-flex justify-content-end">
                                            <p className="font-small grey-text mt-3">
                                                Don't have an account?
                                                <a
                                                    href={'/register'}
                                                    className="dark-grey-text ml-1 font-weight-bold"
                                                >
                                                    Sign up
                                                </a>
                                            </p>
                                        </MDBCol>
                                    </MDBRow>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </Router>
        );
    }
}