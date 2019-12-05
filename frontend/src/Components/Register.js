import * as React from "react";
import {MDBAlert, MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBInput, MDBRow} from "mdbreact";
import {Link, Redirect} from "react-router-dom";
import {BrowserRouter as Router} from "react-router-dom";
import Navigation from "./Navigation";
import LoginErrorMessage from "./Login/LoginErrorMessage";
import {useFormik} from "formik";

export default class Register extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            serverError: ''
        }
        document.title = 'Register';
    }

    onFormSubmitHandler(value) {

        let json = Object.assign({},value);
        let password = json.password;
        let confirmPassword = json.confirmPassword;
        delete json.password;
        delete json.confirmPassword;
        delete json.isLoading;
        json.password = {'first': password, 'second': confirmPassword};

        this.setState({
            isLoading: true
        });

        fetch('http://localhost:8000/register', {
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
                        isLoading: false
                    })

                } else if (data.success) {
                    window.location = '/login'
                }
            })
            .catch(error => {
                this.setState({
                    serverError: ['Oops something went wrong try again later...'],
                    isLoading: false
                })
            })
    }

    render() {
        const formik = useFormik({
            initialValues: {
                firstName: '',
                lastName: '',
                email: '',
            },
            onSubmit: values => {
                alert(JSON.stringify(values, null, 2));
            },
        });

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
                                            Registration
                                        </h3>
                                    </MDBRow>
                                </div>
                                <MDBCardBody className="mx-4 mt-4">
                                    <MDBRow>
                                        <form onSubmit={formik.handleSubmit}>
                                            <label htmlFor="firstName">First Name</label>
                                            <input
                                                id="firstName"
                                                name="firstName"
                                                type="text"
                                                onChange={formik.handleChange}
                                                value={formik.values.firstName}
                                            />
                                            <label htmlFor="lastName">Last Name</label>
                                            <input
                                                id="lastName"
                                                name="lastName"
                                                type="text"
                                                onChange={formik.handleChange}
                                                value={formik.values.lastName}
                                            />
                                            <label htmlFor="email">Email Address</label>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                onChange={formik.handleChange}
                                                value={formik.values.email}
                                            />
                                            <button type="submit">Submit</button>
                                        </form>
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
        )
    }
}