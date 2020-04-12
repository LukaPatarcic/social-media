import React,{Component} from "react";
import {MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBIcon, MDBInput, MDBRow} from "mdbreact";
import {ClipLoader} from "react-spinners";
import SimpleReactValidator from "simple-react-validator";
import PropTypes from 'prop-types'
const initialValue = {
    name: '',
    email: '',
    subject: '',
    message: '',
}
export default class ContactForm extends Component{
    constructor(props) {
        super(props);
        this.state = initialValue

        this.handleChange = this.handleChange.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.resetForm = this.resetForm.bind(this);
        this.validator = new SimpleReactValidator();
    }

    resetForm() {
        this.setState(initialValue);
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

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }


    render() {
        const {name,email,subject,message} = this.state;
        const {loading} = this.props;

        return (
            <MDBCard className={'mt-5'}>
                <MDBCardBody>
                    <h2 className={'homepage'}>Contact</h2>
                    <MDBRow center className={'mt-5'}>
                        <MDBCol sm={12} md={8} lg={6}>
                            <form
                                className={'text-left'}
                                onSubmit={this.validateForm}
                                noValidate
                            >
                                <p className="h5 text-center mb-4">Write to us</p>
                                <div className="grey-text">
                                    <MDBInput
                                        label="Name"
                                        icon="user"
                                        value={name}
                                        onChange={this.handleChange.bind(this)}
                                        type="text"
                                        name="name"
                                    />
                                    <small>{this.validator.message('name', name, 'required|alpha_space')}</small>
                                    <MDBInput
                                        label="Email"
                                        icon="envelope"
                                        onChange={this.handleChange.bind(this)}
                                        value={email}
                                        type="email"
                                        name="email"
                                    />
                                    <small>{this.validator.message('email', email, 'required|email')}</small>
                                    <MDBInput
                                        label="Subject"
                                        icon="tag"
                                        value={subject}
                                        onChange={this.handleChange.bind(this)}
                                        name="subject"
                                        type="text"
                                    />
                                    <small>{this.validator.message('subject', subject, 'required|max:50')}</small>
                                    <MDBInput
                                        type="textarea"
                                        rows="2"
                                        label="Message..."
                                        value={message}
                                        onChange={this.handleChange.bind(this)}
                                        name="message"
                                        icon="pencil-alt"
                                    />
                                    <small>{this.validator.message('message', message, 'required|max:120')}</small>
                                    <p><small className={'float-right'}>{message.length}/120</small></p>
                                    <br />
                                </div>
                                <div className="text-center">
                                    <MDBBtn
                                        outline
                                        color="red"
                                        type="submit"
                                    >
                                        {loading
                                            ?
                                            <>
                                                <ClipLoader
                                                    sizeUnit={"px"}
                                                    size={20}
                                                    color={'#f00'}
                                                    loading={loading}
                                                />
                                            </>
                                            :
                                            <>Send <MDBIcon far icon="paper-plane" className="ml-1" /></>
                                        }
                                    </MDBBtn>
                                </div>
                            </form>
                        </MDBCol>
                    </MDBRow>
                </MDBCardBody>
            </MDBCard>
        );
    }
}

ContactForm.propTypes = {
    loading: PropTypes.bool.isRequired,
    onSubmitHandler: PropTypes.func.isRequired
}
