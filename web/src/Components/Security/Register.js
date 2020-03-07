import * as React from "react";
import {MDBAlert, MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBIcon, MDBInput, MDBRow} from "mdbreact";
import SimpleReactValidator from "simple-react-validator";
import PasswordStrengthBar from 'react-password-strength-bar';
import {ClipLoader} from "react-spinners";
import {Redirect, Link} from "react-router-dom";

export default class Register extends React.Component{

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator({
            validators: {
                confirmPassword: {  // name the rule
                    message: 'The password does not match.',
                    rule: (val, params, validator) => {
                        return this.state.password === val
                    },
                }
            }
        });
        this.state = {
            serverError: [],
            firstName: '',
            lastName: '',
            profileName: '',
            email: '',
            password: '',
            confirmPassword: '',
            loading: '',
            successMessage: ''
        }
        document.title = 'Allshak | Register';
    }

    submitHandler = event => {
        event.preventDefault();
        const {firstName,lastName,profileName,email,password,confirmPassword} = this.state;
        if (this.validator.allValid()) {
            this.setState({loading: true});
            let json = {firstName,lastName,profileName,email,'password' :{'first':password,'second':confirmPassword}};

            fetch('https://api.allshak.lukaku.tech/register', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(json)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        this.setState({
                            serverError: data.error,
                            loading: false
                        })

                    } else if (data.success) {
                        this.setState({
                            successMessage: 'A verification email has been sent to your account',
                            firstName: '',
                            lastName: '',
                            profileName: '',
                            email: '',
                            password: '',
                            confirmPassword: '',
                            serverError: '',
                            loading: false
                        })
                    }
                })
                .catch(error => {
                    this.setState({
                        serverError: ['Oops something went wrong try again later...'],
                        loading: false
                    })
                })
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    };

    changeHandler = event => {
        this.setState({ [event.target.name]: event.target.value});
    };

    render() {
        const {firstName,lastName,email,profileName,password,confirmPassword,loading,error,serverError,successMessage} = this.state;
        if(error === 'Success') {
                return(<Redirect to="/" />);
        }

        return (
            <MDBContainer>
                <MDBRow center>
                    <MDBCol md={8} sm={12} className={'my-5'}>
                        <MDBCard>
                            <div className="header pt-3 red">
                                <MDBRow className="d-flex justify-content-center">
                                    <h3 className="white-text mb-3 pt-3 font-weight-bold">
                                        Registration
                                    </h3>
                                </MDBRow>
                            </div>
                            <MDBCardBody className="mx-4 mt-4">
                                <form
                                    onSubmit={this.submitHandler}
                                    noValidate
                                >
                                    <div className="grey-text">
                                        <MDBRow>
                                            <MDBCol sm={12} md={6}>
                                                <MDBInput
                                                    value={firstName.value}
                                                    name="firstName"
                                                    onChange={this.changeHandler}
                                                    label="First Name"
                                                    group
                                                />
                                                <small>{this.validator.message('firstName', firstName, 'required|alpha|min:2|max:255')}</small>
                                            </MDBCol>
                                            <MDBCol sm={12} md={6}>
                                                <MDBInput
                                                    value={lastName}
                                                    name="lastName"
                                                    onChange={this.changeHandler}
                                                    label="Last Name"
                                                    group
                                                    type="text"
                                                />
                                                <small>{this.validator.message('lastName', lastName, 'required|alpha|min:2|max:255')}</small>
                                            </MDBCol>
                                        </MDBRow>
                                        <MDBRow>
                                            <MDBCol sm={12} md={6}>
                                                <MDBInput
                                                    value={email}
                                                    name="email"
                                                    onChange={this.changeHandler}
                                                    label="Email"
                                                    icon="at"
                                                    group
                                                    type="email"
                                                />
                                                <small>{this.validator.message('email', email, 'required|email|max:255')}</small>
                                            </MDBCol>
                                            <MDBCol sm={12} md={6}>
                                                <MDBInput
                                                    value={profileName}
                                                    name="profileName"
                                                    onChange={this.changeHandler}
                                                    label="Username"
                                                    icon="user"
                                                    group
                                                    type="text"
                                                />
                                                <small>{this.validator.message('profileName', profileName, 'required|alpha_num|min:3|max:255')}</small>
                                            </MDBCol>
                                        </MDBRow>
                                        <MDBRow>
                                            <MDBCol sm={12} md={6}>
                                                <MDBInput
                                                    value={password}
                                                    name="password"
                                                    onChange={this.changeHandler}
                                                    label="Your password"
                                                    icon="lock"
                                                    group
                                                    type="password"
                                                />
                                                {password
                                                    ?
                                                    <PasswordStrengthBar password={password} />
                                                    :
                                                    ''
                                                }
                                                <small>
                                                    {this.validator.message('password', password, 'required|min:3|max:255')}
                                                </small>
                                            </MDBCol>
                                            <MDBCol sm={12} md={6}>
                                                <MDBInput
                                                    value={confirmPassword}
                                                    name="confirmPassword"
                                                    onChange={this.changeHandler}
                                                    label="Confirm password"
                                                    icon="exclamation-triangle"
                                                    group
                                                    type="password"
                                                />
                                                <small>
                                                    {this.validator.message('confirmPassword', confirmPassword, 'required|confirmPassword')}
                                                </small>
                                            </MDBCol>
                                        </MDBRow>
                                    </div>
                                    <div>
                                        {serverError.length > 0
                                            ?
                                            <MDBAlert color="danger" className={'text-center'}>
                                                {serverError.map(error => <React.Fragment>{error}<br/></React.Fragment>)}
                                            </MDBAlert>
                                            :
                                            ''
                                        }
                                        {successMessage
                                            ?
                                            <MDBAlert color="success" className={'text-center'}>
                                                {successMessage}
                                            </MDBAlert>
                                            :
                                            ''
                                        }
                                    </div>
                                    <MDBBtn className={'mt-5'} outline color="elegant" block type={'submit'}>
                                        {loading
                                            ?
                                            <ClipLoader
                                                sizeUnit={"px"}
                                                size={20}
                                                color={'#2e2e2e'}
                                                loading={loading}
                                            />
                                            :
                                            <React.Fragment>
                                                Register <MDBIcon far icon="paper-plane" className="ml-1" />
                                            </React.Fragment>
                                        }
                                    </MDBBtn>
                                    <p className={'text-center'}>Already have an account?
                                    <Link
                                        to={'/login'}
                                        className="dark-grey-text ml-1 font-weight-bold"
                                    >
                                        Log in!
                                    </Link></p>
                                </form>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        )
    }
}