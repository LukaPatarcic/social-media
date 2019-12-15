import * as React from "react";
import {
    MDBCollapse, MDBDropdown, MDBDropdownItem, MDBDropdownMenu, MDBDropdownToggle, MDBIcon,
    MDBNavbar, MDBNavbarBrand,
    MDBNavbarNav, MDBNavbarToggler,
    MDBNavItem, MDBNavLink,
} from "mdbreact";
import cookie from "react-cookies";
import {Link} from "react-router-dom";

export default class Navigation extends React.Component{

    constructor(props) {
        super(props);

    }
    state = {
        isOpen: false,
        auth: !!cookie.load('access-token')
    };

    toggleCollapse = () => {
        this.setState({ isOpen: !this.state.isOpen });
    }

    render() {
        const { auth } = this.state;

        return (
            <MDBNavbar color="red" dark expand="md">
                <MDBNavbarBrand>
                    <strong><Link className={'text-white mr-2'} to='/'>Allshak</Link></strong>
                </MDBNavbarBrand>
                <MDBNavbarToggler onClick={this.toggleCollapse} />
                <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
                    <MDBNavbarNav right className={'mr-md-5'}>
                        {auth
                            ?
                            <MDBNavItem>
                                <MDBDropdown>
                                    <MDBDropdownToggle nav caret>
                                        <MDBIcon icon="user" />
                                    </MDBDropdownToggle>
                                    <MDBDropdownMenu className="dropdown-default">
                                        <MDBDropdownItem href="/profile">Profile</MDBDropdownItem>
                                        <MDBDropdownItem href="/settings">Settings</MDBDropdownItem>
                                        <MDBDropdownItem href="/logout">Logout</MDBDropdownItem>
                                    </MDBDropdownMenu>
                                </MDBDropdown>
                            </MDBNavItem>
                            :
                            <React.Fragment>
                                <MDBNavItem>
                                    <Link className={'text-white mr-2'} to='/register'>Register</Link>
                                </MDBNavItem>
                                <MDBNavItem>
                                    <Link className={'text-white mr-2'} to='/login'>Login</Link>
                                </MDBNavItem>
                            </React.Fragment>
                        }
                    </MDBNavbarNav>
                </MDBCollapse>
            </MDBNavbar>
        );
    }

}