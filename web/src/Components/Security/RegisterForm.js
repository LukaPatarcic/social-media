import React,{Component} from "react";
import {MDBAlert, MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBIcon, MDBInput, MDBRow} from "mdbreact";
import PasswordStrengthBar from "react-password-strength-bar";
import {ClipLoader} from "react-spinners";
import {Link} from "react-router-dom";
import PropTypes from 'prop-types';
import SimpleReactValidator from "simple-react-validator";
import {LOGIN_URL} from "../../Config";
import Header from "./Header";

const initialState = {
    firstName: '',
    lastName: '',
    profileName: '',
    email: '',
    password: '',
    confirmPassword: ''
}
export default class RegisterForm extends Component{

    constructor(props) {
        super(props);
        this.state = initialState;
        this.validateForm = this.validateForm.bind(this);
        this.resetForm = this.resetForm.bind(this);
        this.validator = new SimpleReactValidator({
            validators: {
                confirmPassword: {
                    message: 'The password does not match.',
                    rule: (val) => {
                        return this.state.password === val
                    },
                }
            }
        });
    }

    validateForm(e) {
        e.preventDefault();
        if (this.validator.allValid()) {
            this.props.onSubmitHandler(this.state);
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    resetForm() {
        this.setState(initialState);
    }
    changeHandler = event => {
        this.setState({ [event.target.name]: event.target.value});
    };

    render() {
        const { firstName, lastName, profileName, email, password, confirmPassword } = this.state;
        const {loading,error,successMessage} = this.props;
        return (
            <MDBContainer>
                <MDBRow center>
                    <MDBCol md={8} sm={12} className={'my-5'}>
                        <MDBCard>
                            <Header name={'Register'}/>
                            <MDBCardBody className="mx-4 mt-4">
                                <form
                                    onSubmit={this.validateForm}
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
                                                {password &&
                                                    <PasswordStrengthBar password={password} />
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
                                        {(successMessage || error.length > 0) &&
                                            <MDBAlert color={successMessage ? 'success' : 'danger'} className={'text-center'}>
                                                {successMessage}
                                                {error.map(error => <>{error}<br/></>)}
                                            </MDBAlert>
                                        }
                                    </div>
                                    <MDBBtn className={'mt-5'} outline color="elegant" block type={'submit'} disabled={loading}>
                                        {loading
                                            ?
                                            <ClipLoader
                                                sizeUnit={"px"}
                                                size={20}
                                                color={'#2e2e2e'}
                                                loading={loading}
                                            />
                                            :
                                            <>Register <MDBIcon far icon="paper-plane" className="ml-1" /></>
                                        }
                                    </MDBBtn>
                                    <p className={'text-center'}>Already have an account?
                                        <Link
                                            to={LOGIN_URL}
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

RegisterForm.propTypes = {
    loading: PropTypes.bool.isRequired,
    error: PropTypes.array.isRequired,
    successMessage: PropTypes.string.isRequired
};