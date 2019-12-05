import * as React from "react";
import {
    MDBBtn,
    MDBCardBody,
    MDBCardImage, MDBCardText, MDBCardTitle,
    MDBCol,
    MDBCollapse, MDBContainer,
    MDBDropdown,
    MDBDropdownItem,
    MDBDropdownMenu,
    MDBDropdownToggle,
    MDBFormInline, MDBJumbotron,
    MDBNavbar, MDBNavbarBrand,
    MDBNavbarNav, MDBNavbarToggler,
    MDBNavItem, MDBNavLink, MDBRow
} from "mdbreact";
import { BrowserRouter as Router } from 'react-router-dom';
import cookie from "react-cookies";
import Navigation from "./Navigation";

export default class Homepage extends React.Component{

    constructor(props) {
        super(props);

    }

    render() {
        const background = {
            // backgroundImage: "./images/background.jpg",
            backgroundColor: '#ebe9e9'
        }

        return (
            <React.Fragment>
                <Navigation/>
                <MDBContainer className="text-center p-0" fluid>
                    <MDBRow>
                        <MDBCol>
                            <MDBJumbotron className="p-0">
                                <MDBCardBody style={background}>
                                    <MDBCardTitle className="h3">
                                        <img className={'img-fluid'} src={'./images/logo.svg'} width={300}/>
                                    </MDBCardTitle>
                                    <MDBCardText>
                                       Have all your social media in one place. One account for everything
                                    </MDBCardText>
                                    <MDBBtn href="/register" color="elegant" rounded>
                                        Register Now
                                    </MDBBtn>
                                </MDBCardBody>
                            </MDBJumbotron>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </React.Fragment>
        );
    }

}