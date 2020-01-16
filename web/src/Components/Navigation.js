import * as React from "react";
import {
    MDBCollapse, MDBContainer, MDBDropdown, MDBDropdownItem, MDBDropdownMenu, MDBDropdownToggle, MDBFormInline, MDBIcon,
    MDBNavbar, MDBNavbarBrand,
    MDBNavbarNav, MDBNavbarToggler,
    MDBNavItem, MDBNavLink
} from "mdbreact";
import cookie from "react-cookies";
import {Link} from "react-router-dom";
import Search from "./Search";

import Select from 'react-select';

export default class Navigation extends React.Component{

    constructor(props) {
        super(props);

    }
    state = {
        isOpen: false,
        auth: !!cookie.load('access-token'),
        search: ''
    };

    toggleCollapse = () => {
        this.setState({ isOpen: !this.state.isOpen });
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    render() {
        const { auth } = this.state;

        const options = [
            // ...
            { value: 'Stanford University', label: 'Stanford' },
            { value: 'Stanford University', label: 'Stanford' },
            { value: 'Stanford University', label: 'Stanford' },
            // ...
        ];

        return (
            <MDBNavbar color="red" dark expand="md">
                <MDBContainer>
                    <MDBNavbarBrand>
                        <strong><Link className={'text-white mr-2'} to='/'>Allshak</Link></strong>
                    </MDBNavbarBrand>
                    <MDBNavbarToggler onClick={this.toggleCollapse} />
                    <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
                        <MDBNavbarNav right className={'mr-md-5'}>
                            {auth
                                ?
                                <React.Fragment>
                                    <MDBNavItem>
                                        <Link to={'#'}>
                                            <Search />
                                        </Link>
                                    </MDBNavItem>
                                    <MDBNavItem>
                                        <Link className={'text-white mr-2'} to='/profile'>Profile</Link>
                                    </MDBNavItem>
                                    <MDBNavItem className={'mt-2'}>
                                        <Link className={'text-white mr-2'} to='/logout'>Logout</Link>
                                    </MDBNavItem>
                                </React.Fragment>
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
                </MDBContainer>
            </MDBNavbar>
        );
    }

}