import * as React from "react";
import {MDBContainer} from "mdbreact";
import Banner from "../Components/Banner";
import About from "../Components/About";
import Contact from "../Components/Contact";
import {
    BrowserView,
    MobileView,
    isBrowser,
    isMobile
} from "react-device-detect";
import MobileAppModal from "../Components/MobileAppModal";

export default class Homepage extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <MDBContainer className={'text-center p-5'}>
                <Banner/>
                <About/>
                <Contact/>
                {isMobile && <MobileAppModal/>}
            </MDBContainer>
        );
    }

}