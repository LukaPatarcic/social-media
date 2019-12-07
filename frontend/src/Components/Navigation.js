import * as React from "react";
import {
    MDBCollapse,
    MDBNavbar, MDBNavbarBrand,
    MDBNavbarNav, MDBNavbarToggler,
    MDBNavItem, MDBNavLink,
} from "mdbreact";
import { BrowserRouter as Router } from 'react-router-dom';
import {withRouter} from 'react-router'
import cookie from "react-cookies";

export default class Navigation extends React.Component{

    constructor(props) {
        super(props);

    }
    state = {
        isOpen: false,
        isLoggedIn: !!cookie.load('access-token')
    };

    toggleCollapse = () => {
        this.setState({ isOpen: !this.state.isOpen });
    }

    render() {
        const background = {
            backgroundColor: '#ebe9e9'
        }

        return (
            <MDBNavbar color="red" dark expand="md">
                <MDBNavbarBrand className={'text-dark font-weight-bold'}>
                    Allshak
                </MDBNavbarBrand>
                <MDBNavbarToggler onClick={this.toggleCollapse} />
                <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
                    <MDBNavbarNav left>
                        <MDBNavItem active>
                            <MDBNavLink to="/">Home</MDBNavLink>
                        </MDBNavItem>
                        {this.state.isLoggedIn == true ?
                            <MDBNavItem>
                                <MDBNavLink href="/profile">Profile</MDBNavLink>
                            </MDBNavItem>
                            :''
                        }
                        <MDBNavItem>
                            <MDBNavLink to="/about">About</MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem>
                            <MDBNavLink to="/contact">Contact</MDBNavLink>
                        </MDBNavItem>
                    </MDBNavbarNav>
                    <MDBNavbarNav right>
                        {this.state.isLoggedIn == false ?
                            <>
                                <MDBNavItem>
                                    <MDBNavLink to={'/register'}>Register</MDBNavLink>
                                </MDBNavItem>
                                <MDBNavItem>
                                    <MDBNavLink to={'/login'}>Login</MDBNavLink>
                                </MDBNavItem>
                            </>
                            :
                            <MDBNavItem>
                                <MDBNavLink to={'/logout'}>Logout</MDBNavLink>
                            </MDBNavItem>
                        }
                    </MDBNavbarNav>
                </MDBCollapse>
            </MDBNavbar>
        );
    }

}