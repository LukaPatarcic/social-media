import React,{Component} from "react";
import {
    MDBAlert,
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardHeader,
    MDBCol,
    MDBContainer,
    MDBIcon,
    MDBInput,
    MDBRow
} from "mdbreact";
import PropTypes from 'prop-types'
import ls from "local-storage";
import SimpleReactValidator from "simple-react-validator";
import PasswordStrengthBar from "react-password-strength-bar";
import Loading from "../../Helpers/Loading";

export default class ProfileEdit extends Component{
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            profileName: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
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

        this.handleChange = this.handleChange.bind(this);
        this.validateForm = this.validateForm.bind(this);
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    validateForm(e) {
        e.preventDefault();
        if (this.validator.allValid()) {
            const {firstName,lastName,profileName,email,password,confirmPassword} = this.state;
            const data = {firstName, lastName, profileName, email, password: {first: password, second: confirmPassword }}
            this.props.onSubmitHandler(data);
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    componentDidMount() {
        const {firstName,lastName,profileName,email} = ls.get('user');
        this.setState({firstName,lastName,profileName,email})
    }

    render() {
        const {firstName,lastName,profileName,email,password,confirmPassword} = this.state;
        const {loading,error} = this.props;
        return (
            <MDBContainer className={'mt-5'}>
                <MDBRow>
                    <MDBCol>
                        <MDBCard>
                            <MDBCardHeader>
                                <h1 className={'text-center'}>Profile Edit</h1>
                            </MDBCardHeader>
                            <MDBCardBody>
                                <MDBInput
                                    value={firstName}
                                    name="firstName"
                                    onChange={this.handleChange}
                                    label="First Name"
                                    group
                                />
                                <small>{this.validator.message('firstName', firstName, 'required|alpha|min:2|max:255')}</small>
                                <MDBInput
                                    value={lastName}
                                    name="lastName"
                                    onChange={this.handleChange}
                                    label="Last Name"
                                    group
                                    type="text"
                                />
                                <small>{this.validator.message('lastName', lastName, 'required|alpha|min:2|max:255')}</small>
                                <MDBInput
                                    value={profileName}
                                    name="profileName"
                                    onChange={this.handleChange}
                                    onBlur={() => this.validator.showMessageFor('profileName')}
                                    label="Username"
                                    icon="user"
                                    group
                                    type="text"
                                />
                                <small>{this.validator.message('profileName', profileName, 'required|alpha_num|min:3|max:255')}</small>
                                <MDBInput
                                    value={email}
                                    name="email"
                                    onChange={this.handleChange}
                                    label="Email"
                                    icon="at"
                                    group
                                    type="email"
                                />
                                <small>{this.validator.message('email', email, 'required|email|max:255')}</small>
                                <MDBInput
                                    value={password}
                                    name="password"
                                    onChange={this.handleChange}
                                    label="Your password"
                                    icon="lock"
                                    group
                                    type="password"
                                />
                                {password.first &&
                                <PasswordStrengthBar password={password} />
                                }
                                <small>{this.validator.message('password', password, 'min:3|max:255')}</small>
                                <MDBInput
                                    value={confirmPassword}
                                    name="confirmPassword"
                                    onChange={this.handleChange}
                                    label="Confirm password"
                                    icon="exclamation-triangle"
                                    group
                                    type="password"
                                />
                                <small>
                                    {this.validator.message('confirmPassword', confirmPassword, 'confirmPassword')}
                                </small>
                                {error.length > 0 &&
                                    <MDBAlert color={'danger'}>
                                        {error.map((err,index) => (
                                            <p key={index}>{err}</p>
                                        ))}
                                    </MDBAlert>
                                }
                                <MDBBtn block={true} color={'red'} size={'lg'} onClick={this.validateForm}>
                                    <Loading loading={loading} color={'white'}>
                                        Save Changes <MDBIcon icon={'save'} />
                                    </Loading>
                                </MDBBtn>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        )
    }
}

ProfileEdit.propTypes = {
    onSubmitHandler: PropTypes.func.isRequired,
}