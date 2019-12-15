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
        let value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        this.setState({[e.target.name]: value});
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
                                        label="Your name"
                                        icon="user"
                                        value={name}
                                        group
                                        type="text"
                                        validate
                                        error="wrong"
                                        success="right"
                                    />
                                    <MDBInput
                                        label="Your email"
                                        icon="envelope"
                                        group
                                        type="email"
                                    />
                                    <MDBInput
                                        label="Subject"
                                        icon="tag"
                                        group
                                        type="text"
                                    />
                                    <MDBInput
                                        type="textarea"
                                        rows="2"
                                        label="Your message"
                                        icon="pencil-alt"
                                    />
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