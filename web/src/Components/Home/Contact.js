import * as React from "react";
import {MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBIcon, MDBInput, MDBRow} from "mdbreact";

export default class About extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            subject: '',
            message: ''
        }

    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    render() {
        const {name,email,subject,message} = this.state;
        return (
            <MDBCard className={'mt-5'}>
                <MDBCardBody>
                    <h2>Contact</h2>
                    <MDBRow center className={'mt-5'}>
                        <MDBCol sm={12} md={8} lg={6}>
                            <form className={'text-left'}>
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
                                    <MDBInput
                                        label="Email"
                                        icon="envelope"
                                        onChange={this.handleChange.bind(this)}
                                        value={email}
                                        type="email"
                                        name="email"
                                    />
                                    <MDBInput
                                        label="Subject"
                                        icon="tag"
                                        value={subject}
                                        onChange={this.handleChange.bind(this)}
                                        name="subject"
                                        type="text"
                                    />
                                    <MDBInput
                                        type="textarea"
                                        rows="2"
                                        label="Message..."
                                        value={message}
                                        onChange={this.handleChange.bind(this)}
                                        name="message"
                                        icon="pencil-alt"
                                    />
                                    <p><small className={'float-right'}>{message.length}/120</small></p>
                                </div>
                                <div className="text-center">
                                    <MDBBtn outline color="red">
                                        Send <MDBIcon far icon="paper-plane" className="ml-1" />
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