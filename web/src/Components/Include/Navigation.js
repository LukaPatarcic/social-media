import * as React from "react";
import {
    MDBCollapse, MDBContainer, MDBDropdown, MDBDropdownItem, MDBDropdownMenu, MDBDropdownToggle, MDBFormInline, MDBIcon,
    MDBNavbar, MDBNavbarBrand,
    MDBNavbarNav, MDBNavbarToggler,
    MDBNavItem, MDBNavLink
} from "mdbreact";
import {Link} from "react-router-dom";
import {AuthContext} from "../../Contexts/AuthContext";
import cookie from 'react-cookies'
import NotificationContainer from "../Notification/NotificationContainer";
import SearchContainer from "../Search/SearchContainer";
import ls from 'local-storage'

export default class Navigation extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            search: ''
        };
    }
    static contextType = AuthContext;

    toggleCollapse = () => {
        this.setState({ isOpen: !this.state.isOpen });
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    render() {
        const {authenticated} = this.context;
        return (
            <MDBNavbar color="red" dark expand="md">
                <MDBContainer>
                    <MDBNavbarBrand>
                        <strong><Link className={'text-white mr-2'} to='/'>Allshack</Link></strong>
                    </MDBNavbarBrand>
                    <MDBNavbarToggler onClick={this.toggleCollapse} />
                    <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
                        <MDBNavbarNav right className={'mr-md-5 mt-1'}>
                            {authenticated
                                ?
                                <>
                                <MDBNavItem className={'mt-2'}>
                                    <SearchContainer />
                                </MDBNavItem>
                                <MDBNavItem className={'mt-2'}>
                                    <Link className={'text-white mr-2'} to={'/profile/'+ls.get('user').profileName}>Profile</Link>
                                </MDBNavItem>
                                <MDBNavItem className={'mt-2'}>
                                <Link className={'text-white mr-2'} to='/logout'>Logout</Link>
                                </MDBNavItem>
                                <NotificationContainer />
                                </>
                                :
                                <>
                                <MDBNavItem>
                                <Link className={'text-white mr-2'} to='/register'>Register</Link>
                                </MDBNavItem>
                                <MDBNavItem>
                                <Link className={'text-white mr-2'} to='/login'>Login</Link>
                                </MDBNavItem>
                                </>
                            }
                        </MDBNavbarNav>
                    </MDBCollapse>
                </MDBContainer>
            </MDBNavbar>
        );
    }

}