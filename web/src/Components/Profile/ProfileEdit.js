import React,{Component} from "react";
import {MDBBtn, MDBCard, MDBCardBody, MDBCardHeader, MDBCol, MDBContainer, MDBIcon, MDBInput, MDBRow} from "mdbreact";
import ls from 'local-storage'

export default class ProfileEdit extends Component{
    render() {
        const {firstName,lastName,profileName,email} = ls.get('user');
        console.log();
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
                                    label={'Username'}
                                    value={profileName}
                                />
                                <MDBInput
                                    label={'Email'}
                                    value={email}
                                />
                                <MDBInput
                                    label={'First Name'}
                                    value={firstName}
                                />
                                <MDBInput
                                    label={'Last Name'}
                                    value={lastName}
                                />
                                <MDBInput
                                    label={'Password'}
                                />
                                <MDBInput
                                    label={'Password Repeat'}
                                />
                                <MDBBtn block={true} color={'red'} size={'lg'}>
                                    Save Changes <MDBIcon icon={'save'} />
                                </MDBBtn>


                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        )
    }
}