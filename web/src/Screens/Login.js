import React from "react";
import cookie from "react-cookies";
import {Link} from "react-router-dom";
import {MDBAlert, MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBInput, MDBRow} from "mdbreact";
import {ClipLoader} from "react-spinners";
import SimpleReactValidator from "simple-react-validator";

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
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

        document.title = 'Allshak | Login';
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
                body: JSON.stringify({email,password})
            })
                .then((response => response.json()))
                .then((data => {
                    this.setState({error: data.error,loading: false});
                    if(data.token) {
                        cookie.save('access-token', data.token,{maxAge: 31536000});
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
        
        const {error,email,password,loading,rememberMe} = this.state;

        return (
            <MDBContainer>
                <MDBRow center>
                    <MDBCol lg={8} md={6} sm={12} className={'mt-5'}>
                        <MDBCard className={'my-5'}>
                            <div className="header pt-3 red">
                                <MDBRow className="d-flex justify-content-center">
                                    <h3 className="white-text mb-3 pt-3 font-weight-bold">
                                        Log in
                                    </h3>
                                </MDBRow>
                            </div>
                            <MDBCardBody className="mx-4 mt-4">
                                <form
                                    className="grey-text"
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