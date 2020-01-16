import * as React from "react";
import {MDBContainer} from "mdbreact";
import Banner from "../Components/Banner";
import About from "../Components/About";
import Contact from "../Components/Contact";
import MobileAppModal from "../Components/MobileAppModal";
import CookieConsent, { Cookies } from "react-cookie-consent";
import {Link} from "react-router-dom";
import cookie from "react-cookies";
import Feed from "../Components/Feed";

export default class Homepage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            auth: cookie.load('access-token')
        };

        document.title = 'Allshak';
    }

    render() {
        const {auth} = this.state;
        return (
            <React.Fragment>
                {auth
                    ?
                    <Feed/>
                    :
                    <MDBContainer className={'text-center pt-5'}>
                        <Banner/>
                        <About/>
                        <Contact/>
                        <MobileAppModal/>
                        <CookieConsent
                            style={{ background: "#9e9e9e" }}
                            buttonStyle={{ color: "#fff", backgroundColor: '#f00', marginRight: 30}}
                        >
                            By using our site, you acknowledge that you have read and understand our
                            <Link to={'/legal/cookie'}> Cookie Policy</Link>,
                            <Link to={'/legal/privacy'}> Privacy Policy</Link>,
                            and our <Link to={'/legal/tos'}> Terms of Service</Link>.
                        </CookieConsent>
                    </MDBContainer>
                }
            </React.Fragment>
        );
    }

}