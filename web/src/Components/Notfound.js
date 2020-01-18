import * as React from "react";
import {MDBCard, MDBCardBody, MDBCardHeader, MDBCol, MDBContainer, MDBIcon, MDBRow} from "mdbreact";
import {Link} from "react-router-dom";

export default class Notfound extends React.Component{

    render() {
        return (
            <MDBContainer className={'my-5'}>
                <MDBRow center className={'my-5'}>
                    <MDBCol sm={12} md={8} className={'my-5'}>
                        <MDBCard>
                            <MDBCardHeader>
                                <h1 className={'text-center'}>Error 404</h1>
                            </MDBCardHeader>
                            <MDBCardBody className={'text-center'}>
                                <MDBIcon icon={'exclamation-circle'} size={'10x'} className={'text-danger'}/>
                                <h2>Page not found</h2>
                                <h3>If you thing this is a mistake please contact customer support</h3>
                                <p>Click the links below to go to a page</p>
                                <Link to={'/'}>Go to homepage</Link> <Link to={'/profile'}>Go to profile</Link>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        );
    }
}