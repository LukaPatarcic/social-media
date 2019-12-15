import React, { Component } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody } from 'mdbreact';
import {isMobile} from "react-device-detect";
import cookie from "react-cookies";

export default class MobileAppModal extends Component {


    constructor(props) {
        super(props);
        this.state = {
            modal1: true,
        }
    }

    componentDidMount() {
        this.toggle(1)
    }


    toggle = nr => () => {
        cookie.save('mobileAppModal',true);
        let modalNumber = 'modal' + nr;
        this.setState({
            [modalNumber]: !this.state[modalNumber]
        });
    };

    render() {
        if(cookie.load('mobileAppModal')) {
            return (<React.Fragment />)
        }
        return (
            <React.Fragment>
                {isMobile &&
                <MDBContainer>
                    <MDBModal isOpen={this.state.modal1} toggle={this.toggle(1)} frame position="bottom">
                        <MDBModalBody className="text-center">
                            We see you are using a mobile device. Consider downloading and using our app. It's free!
                            <MDBBtn color="grey" onClick={this.toggle(1)}>Close</MDBBtn>
                            <MDBBtn color="red"><a className={'text-white'} href={'https://downloads.allshak.lukaku.tech/Allshak.apk'} download>Download</a></MDBBtn>
                        </MDBModalBody>
                    </MDBModal>
                </MDBContainer>
            }
            </React.Fragment>
        );
    }
}