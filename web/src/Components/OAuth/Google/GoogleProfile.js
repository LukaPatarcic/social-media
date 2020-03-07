import * as React from "react";
import {MDBCard, MDBCardBody, MDBCardHeader, MDBCol, MDBContainer, MDBRow} from "mdbreact";
import GoogleLogout from "./GoogleLogout";

export default class GoogleProfile extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        const {given_name,family_name,picture,email} = this.props.googleData;
        return (
            <MDBContainer>
                <MDBRow>
                    <MDBCol sm={12}>
                        <MDBCard className={'mt-5'}>
                            <MDBCardHeader className={'text-center text-danger'}>
                                <h3>Google Profile</h3>
                            </MDBCardHeader>
                            <MDBCardBody>
                                <MDBRow center>
                                    <MDBCol sm={12} md={4}>
                                        <img className={'img-fluid rounded-circle z-depth-3'} src={picture}/>
                                    </MDBCol>
                                    <MDBCol sm={12} md={4}>
                                        Name: {given_name + ' ' + family_name}<br/>
                                        Email: {email}<br/>
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow end>
                                    <GoogleLogout />
                                </MDBRow>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>

            </MDBContainer>
        );
    }
}