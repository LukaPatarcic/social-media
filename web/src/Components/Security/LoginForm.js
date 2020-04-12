import {MDBAlert, MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBInput, MDBRow} from "mdbreact";
import {ClipLoader} from "react-spinners";
import {Link} from "react-router-dom";
import React, {Component} from "react";
import SimpleReactValidator from "simple-react-validator";
import Header from "./Header";
import PropTypes from 'prop-types'
import {REGISTER_URL} from "../../Config";

export default class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            verified: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.validator = new SimpleReactValidator();

    }

    componentDidMount() {
        const query = new URLSearchParams(this.props.location.search);
        this.setState({verified: query.get('verified')})
    }

    validateForm(e) {
        e.preventDefault();
        const {email,password} = this.state;
        if (this.validator.allValid()) {
            this.props.onHandleSubmit(email,password);
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

        const {loading,error,clearErrorMessage} = this.props;
        const {email,password,verified} = this.state;

        return (
            <MDBContainer>
                <MDBRow center>
                    <MDBCol lg={8} md={6} sm={12} className={'mt-5'}>
                        <MDBCard className={'my-5'}>
                            <Header name={'Login'}/>
                            <MDBCardBody className="mx-4 mt-4">
                                <form
                                    className="grey-text"
                                    onSubmit={this.validateForm}
                                    noValidate
                                >
                                    {(error || verified) &&
                                        <MDBAlert color={error ? 'danger' : 'success'} dismiss onClose={() => clearErrorMessage()} className={'text-center'}>
                                            {error}
                                            {!error ? ' You have successfully verified your account!' : null}
                                        </MDBAlert>
                                    }

                                    <MDBInput
                                        value={email}
                                        name="email"
                                        onChange={this.handleChange}
                                        onBlur={() => this.validator.showMessageFor('email')}
                                        label="Email"
                                        icon="at"
                                        group
                                        type="email"
                                    />
                                    <small>{this.validator.message('email', email, 'required|email')}</small>

                                    <MDBInput
                                        value={password}
                                        name="password"
                                        onChange={this.handleChange}
                                        onBlur={() => this.validator.showMessageFor('password')}
                                        label="Your password"
                                        icon="lock"
                                        group
                                        type="password"
                                    />
                                    <small>{this.validator.message('password', password, 'required')}</small>

                                    <MDBRow className="font-small grey-text mt-5">
                                        <MDBCol sm={12} md={6} className={'mt-5 mt-md-0'}>
                                            Forgot
                                            <a href="#!" className="dark-grey-text ml-1 font-weight-bold">
                                                Password?
                                            </a>
                                        </MDBCol>
                                    </MDBRow>
                                    <MDBRow className="d-flex align-items-center mb-4 mt-5">
                                        <MDBCol sm={12} md={5}>
                                            <div className="text-center">
                                                <MDBBtn
                                                    color="elegant"
                                                    rounded
                                                    block
                                                    type="submit"
                                                    className="z-depth-1a"
                                                    disabled={loading}
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
                                        <MDBCol sm={12} md={7} className="text-center">
                                            <p className="font-small grey-text mt-3">
                                                Don't have an account?
                                                <Link
                                                    to={REGISTER_URL}
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
        )
    }
}

LoginForm.propTypes = {
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
    onHandleSubmit: PropTypes.func.isRequired,
    clearErrorMessage: PropTypes.func.isRequired
};