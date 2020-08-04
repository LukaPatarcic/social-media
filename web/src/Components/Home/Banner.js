import * as React from "react";
import {MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBRow} from "mdbreact";
import {Link} from "react-router-dom";
import {LOGIN_URL, REGISTER_URL} from "../../Config";

export default class Banner extends React.Component{
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <MDBCard>
                <MDBCardBody>
                    <MDBRow>
                        <MDBCol sm={12} className={'d-flex justify-content-center align-items-center'}>
                            <img className={'img-fluid'} src={'./images/logo.svg'} width={100} alt={'Logo'}/>
                            <span style={{fontSize: '2rem',marginLeft: '0.5rem'}}>Allshack</span>
                        </MDBCol>
                        <MDBCol sm={12}>
                            <p style={{fontSize: 20}} className={'mt-3'}>
                                Best place for chatting with friends and sharing memories!
                            </p>
                            <MDBBtn color="red" size={'lg'} rounded>
                                <Link className={'text-white'} to={REGISTER_URL}>Register Now</Link>
                            </MDBBtn>
                            <p><small>Already have an account? <Link className={'text-danger'} to={LOGIN_URL}>Log in</Link></small></p>
                        </MDBCol>
                    </MDBRow>
                </MDBCardBody>
            </MDBCard>
        );
    }

}