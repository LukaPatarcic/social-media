import * as React from "react";
import {ErrorMessage, Field, Formik} from "formik";
import * as Yup from "yup";
import {Alert, Button, Col, Form, Spinner} from "react-bootstrap";
import {Link,Redirect} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faFacebook,faGoogle} from "@fortawesome/free-brands-svg-icons";
import FacebookLogin from "react-facebook-login";
import cookie from 'react-cookies';
import GoogleLogin from "react-google-login";
import FacebookAuthLogin from "./Facebook/FacebookAuthLogin";
import GoogleAuthLogin from "./Google/GoogleAuthLogin";

export default class RegistrationForm extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            serverError: ''
        }
        document.title = 'Register'

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

    redirectToUrl(url) {
        window.location.href = url;
    }
    render() {
        return (
            <Formik
                initialValues={{
                    firstName: '',
                    lastName: '',
                    profileName: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    isLoading: false
                }}
                validationSchema={Yup.object().shape({
                    firstName: Yup.string()
                        .min(2, 'First name must be at least 2 characters'),
                    lastName: Yup.string()
                        .min(2, 'Last Name must be at least 2 characters'),
                    profileName: Yup.string()
                        .min(2, 'Username must be at least 2 characters'),
                    email: Yup.string()
                        .email('Email is invalid')
                        .required('Email is required'),
                    password: Yup.string()
                        .min(6, 'Password must be at least 6 characters')
                        .required('Password is required'),
                    confirmPassword:  Yup.string()
                        .oneOf([Yup.ref('password'), null], 'Passwords must match')
                        .required('Confirm Password is required')
                })}
                onSubmit={fields => {
                    this.onFormSubmitHandler(fields);
                }}
            >
                {({ errors, status, touched,handleBlur,handleChange,handleReset,handleSubmit }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                    {this.state.serverError
                        ?
                        <Alert variant={'danger'} dismissible={false}>
                            {this.state.serverError.map(error => {
                                return error;
                            })}
                        </Alert>
                        :
                        ''
                    }
                    <Form.Row>
                    <Col md={6} sm={12}>
                    <Form.Label htmlFor="firstName">First Name</Form.Label>
                    <Field name="firstName" type="text" className={'form-control' + (errors.firstName && touched.firstName ? ' is-invalid' : '')} />
                    <ErrorMessage name="firstName" component="div" className="invalid-feedback" />
                    </Col>
                    <Col md={6} sm={12}>
                    <Form.Label htmlFor="lastName">Last Name</Form.Label>
                    <Field name="lastName" type="text" className={'form-control' + (errors.lastName && touched.lastName ? ' is-invalid' : '')} />
                    <ErrorMessage name="lastName" component="div" className="invalid-feedback" />
                    </Col>
                    </Form.Row>
                    <Form.Row>
                    <Col md={6} sm={12}>
                    <Form.Label htmlFor="email">Email</Form.Label>
                    <Field name="email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                    <ErrorMessage name="email" component="div" className="invalid-feedback" />
                    </Col>
                    <Col md={6} sm={12}>
                    <Form.Label htmlFor="profileName">Username</Form.Label>
                    <Field name="profileName" type="text" className={'form-control' + (errors.profileName && touched.profileName ? ' is-invalid' : '')} />
                    <ErrorMessage name="profileName" component="div" className="invalid-feedback" />
                    </Col>
                    </Form.Row>
                    <Form.Row>
                    <Col md={6} sm={12}>
                    <Form.Label htmlFor="password">Password</Form.Label>
                    <Field name="password" type="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                    <ErrorMessage name="password" component="div" className="invalid-feedback" />
                    </Col>
                    <Col md={6} sm={12}>
                    <Form.Label htmlFor="confirmPassword">Confirm Password</Form.Label>
                    <Field name="confirmPassword" type="password" className={'form-control' + (errors.confirmPassword && touched.confirmPassword ? ' is-invalid' : '')} />
                    <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
                    </Col>
                    </Form.Row>
                    <Form.Row className={'mt-3'}>
                    <Button type={'submit'} block={'true'}>
                    {this.state.isLoading
                        ?
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                        :
                        "Register"
                    }
                    </Button>
                    </Form.Row>
                    <p>Already have an account? <Link to={'/login'}>Log in</Link></p>
                    <hr/>
                    <p>Or Register with another app</p>
                    <p>
                        <FacebookAuthLogin/>
                        <GoogleAuthLogin/>
                    </p>
                    </Form>
                )}
            </Formik>
        )
    }
}