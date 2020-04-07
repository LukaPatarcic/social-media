import * as React from "react";
import {MDBContainer} from "mdbreact";
import Banner from "./Banner";
import About from "./About";
import Contact from "./Contact";
import cookie from "react-cookies";
import Feed from "../Feed/Feed";
import './Home.css'

export default class Homepage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            auth: cookie.load('access-token')
        };


        document.title = this.state.auth ? 'Allshack' : 'Welcome to Allshack';
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
                    </MDBContainer>
                }
            </React.Fragment>
        );
    }

}