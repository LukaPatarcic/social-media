import * as React from "react";
import {MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBRow} from "mdbreact";
import {Link} from "react-router-dom";

export default class Banner extends React.Component{
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <MDBCard>
                <MDBCardBody>
                    <MDBRow>
                        <MDBCol sm={12}>
                            <img className={'img-fluid'} src={'./images/logo.svg'} width={300} alt={'Logo'}/>
                        </MDBCol>
                        <MDBCol sm={12}>
                            <p style={{fontSize: 20}} className={'mt-3'}>
                                Have all your social media in one place. One account for everything!
                            </p>
                            <MDBBtn color="red" size={'lg'} outline rounded>
                                <Link className={'text-dark'} to={'/register'}>Register Now</Link>
                            </MDBBtn>
                        </MDBCol>
                    </MDBRow>
                </MDBCardBody>
            </MDBCard>
        );
    }

}