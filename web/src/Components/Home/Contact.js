import * as React from "react";
import {MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBIcon, MDBInput, MDBRow} from "mdbreact";
import {BASE_URL} from "../../Config";
import SimpleReactValidator from "simple-react-validator";
import {ClipLoader} from "react-spinners";

export default class About extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            subject: '',
            message: '',
            loading: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.validator = new SimpleReactValidator();
    }

    submitHandler(e) {
        e.preventDefault();
        const {name,email,subject,message} = this.state;
        this.setState({loading: true});
        if (this.validator.allValid()) {
            fetch(BASE_URL+'/contact',{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({name,email,subject,message})
            })
                .then(response => response.json())
                .then(data => {
                    if(data.success) {
                        this.setState({
                            name: '',
                            email: '',
                            subject: '',
                            message: '',
                            loading: false
                        });
                    }
                })
                .catch(err => {
                    this.setState({loading: true});
                })
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    render() {
        const {name,email,subject,message,loading} = this.state;
        return (
            <MDBCard className={'mt-5'}>
                <MDBCardBody>
                    <h2 className={'homepage'}>Contact</h2>
                    <MDBRow center className={'mt-5'}>
                        <MDBCol sm={12} md={8} lg={6}>
                            <form
                                className={'text-left'}
                                onSubmit={this.submitHandler}
                                noValidate
                            >
                                <p className="h5 text-center mb-4">Write to us</p>
                                <div className="grey-text">
                                    <MDBInput
                                        label="Name"
                                        icon="user"
                                        value={name}
                                        // onBlur={() => this.validator.showMessageFor('name')}
                                        onChange={this.handleChange.bind(this)}
                                        type="text"
                                        name="name"
                                    />
                                    <small>{this.validator.message('name', name, 'required|alpha_space')}</small>
                                    <MDBInput
                                        label="Email"
                                        icon="envelope"
                                        // onBlur={() => this.validator.showMessageFor('email')}
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
                                        // onBlur={() => this.validator.showMessageFor('subject')}
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
                                        // onBlur={() => this.validator.showMessageFor('message')}
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
                                            <ClipLoader
                                                sizeUnit={"px"}
                                                size={20}
                                                color={'#f00'}
                                                loading={loading}
                                            />
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