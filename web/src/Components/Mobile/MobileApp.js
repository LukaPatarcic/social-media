import {Component} from "react";
import {MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBRow} from "mdbreact";
import {Link} from "react-router-dom";
import {LOGIN_URL, REGISTER_URL} from "../../Config";
import * as React from "react";

export default class MobileApp extends Component {
    render() {
        return (
            <MDBCard className={'mt-5'}>
                <MDBCardBody>
                    <MDBRow>
                        <MDBCol sm={12}>
                            <p style={{fontSize: 20}} className={'mt-3'}>
                                Download our mobile app for an even better experience!
                            </p>
                            <MDBBtn color="red" size={'lg'} rounded>
                                <Link className={'text-white'} to={'https://downloads.allshack.lukaku.tech/Allshack.apk'}>Download now</Link>
                            </MDBBtn>
                        </MDBCol>
                    </MDBRow>
                </MDBCardBody>
            </MDBCard>
        );
    }
}