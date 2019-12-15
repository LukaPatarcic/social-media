import React from "react";
import cookie from "react-cookies";
import {Link, Redirect} from "react-router-dom";
import LoginErrorMessage from "../Components/LoginErrorMessage";
import {MDBAlert, MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBIcon, MDBInput, MDBRow} from "mdbreact";
import { BrowserRouter as Router } from 'react-router-dom';
import Navigation from "../Components/Navigation";
import {ClipLoader} from "react-spinners";
import SimpleReactValidator from "simple-react-validator";

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            error: '',
            data: [],
            loading: false,
            email: '',
            password: '',
            rememberMe: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.validator = new SimpleReactValidator();


        let elem = document.querySelector('body');
        elem.classList.add('background');
    }

    submitHandler(e) {
        e.preventDefault();
        const {email,password,rememberMe} = this.state;
        if (this.validator.allValid()) {
            this.setState({loading: true});

            fetch('https://api.allshak.lukaku.tech/login',{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({email,password,rememberMe})
            })
                .then((response => response.json()))
                .then((data => {
                    this.setState({error: data.error,loading: false});
                    if(data.token) {
                        let time = rememberMe ? '+1 month' : '+8 hours';
                        cookie.save('access-token', data.token,{expires: new Date(time)});
                        this.props.history.push("/");
                        window.location.reload(true);
                    }
                }))
                .catch(err => {
                    this.setState({error: 'Oops... Something went wrong!',loading: false});
                })
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    handleChange(e) {
        let value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        this.setState({[e.target.name]: value});
    }

    render() {
        
        const {error,email,password,loading,rememberMe,name} = this.state;

        return (
            <MDBContainer>
                <MDBRow center>
                    <MDBCol lg={8} md={6} sm={12} className={'mt-5'}>
                        <MDBCard className={'mb-5'}>
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
                                <form
                                    onSubmit={this.submitHandler}
                                    noValidate
                                >
                                {error !== ''
                                    ?
                                    <MDBAlert color="danger" dismiss className={'text-center'}>
                                        {error}
                                    </MDBAlert>
                                    :
                                    ''
                                }
                                <MDBInput
                                    label="Your email"
                                    group
                                    type="text"
                                    validate value={email}
                                    onChange={this.handleChange}
                                    name={'email'}
                                />
                                <small>{this.validator.message('email', email, 'required|email')}</small>
                                <MDBInput
                                    value={password}
                                    onChange={this.handleChange}
                                    name={'password'}
                                    label="Your password"
                                    group
                                    type="password"
                                    validate
                                    containerClass="mb-0"
                                />
                                <small>{this.validator.message('password', password, 'required')}</small>
                                <MDBRow className="font-small grey-text">
                                    <MDBCol sm={6}>
                                        <MDBInput
                                            onChange={this.handleChange}
                                            checked={rememberMe}
                                            name="rememberMe"
                                            label="Remember Me"
                                            type="checkbox"
                                            id="rememberMe"
                                        />
                                    </MDBCol>
                                    <MDBCol sm={6}>
                                        Forgot
                                        <a href="#!" className="dark-grey-text ml-1 font-weight-bold">
                                            Password?
                                        </a>
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow className="d-flex align-items-center mb-4 mt-5">
                                    <MDBCol md={5}>
                                        <div className="text-center">
                                            <MDBBtn
                                                color="elegant"
                                                rounded
                                                block
                                                type="submit"
                                                className="z-depth-1a"
                                            >
                                                {loading
                                                    ?
                                                    <ClipLoader
                                                        sizeUnit={"px"}
                                                        size={20}
                                                        color={'#fff'}
                                                        loading={loading}
                                                    />
                                                    :
                                                    'Log In'
                                                }
                                            </MDBBtn>
                                        </div>
                                    </MDBCol>
                                    <MDBCol md="7" className="text-center">
                                        <p className="font-small grey-text mt-3">
                                            Don't have an account?
                                            <Link
                                                to={'/register'}
                                                className="dark-grey-text ml-1 font-weight-bold"
                                            >
                                                Sign up!
                                            </Link>
                                        </p>
                                    </MDBCol>
                                </MDBRow>
                                </form>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        );
    }
}