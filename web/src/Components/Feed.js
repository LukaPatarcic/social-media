import * as React from "react";
import cookie from 'react-cookies'
import {Redirect} from "react-router-dom";
import FacebookProfile from "./Facebook/FacebookProfile";
// import GoogleProfile from "../Components/Google/GoogleProfile";
import {MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBRow} from "mdbreact";
import FacebookAuthLogin from "./Facebook/FacebookAuthLogin";

export default class Feed extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            facebookData: null,
            googleData: null,
            hasGoogleAccount: false,
            hasFacebookAccount: false,
            cards: ['Luka Patarcic','Tatjana Ivosevic','Stefan Gasparic','Nenad Vojnic','Stefan Rasuo','Andrej Tikvicki','Dubravko Bilinovic']
        }
    }

    render() {

        if(this.state.redirectToLogin) {
            return (<Redirect to='/login'/>)
        }

        return (
            <MDBContainer>
                {this.state.cards.map((card,index) => {
                    return (
                        <MDBRow center key={index}>
                            <MDBCol sm={12} md={8}>
                                <MDBCard className={'my-3'}>
                                    <MDBCardBody>
                                        <h2>Card title</h2>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores excepturi in iste labore placeat quam quos ratione reiciendis repudiandae vitae?</p>
                                    </MDBCardBody>
                                </MDBCard>
                            </MDBCol>
                        </MDBRow>
                    )
                })}
            </MDBContainer>

        );
    }
}