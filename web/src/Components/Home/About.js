import * as React from "react";
import {MDBCard, MDBCardBody, MDBCol, MDBRow} from "mdbreact";
import AboutListItem from "./AboutListItem";

export default class About extends React.Component{

    render() {
        return (
            <MDBCard className={'mt-5'}>
                <MDBCardBody>
                    <h2 className={'homepage'}>About</h2>
                    <MDBRow className={'mt-5'}>
                        <MDBCol lg={6} md={12} className="px-4 mt-5">
                            <AboutListItem
                                icon={'fas fa-users'}
                                iconColor={'text-indigo'}
                                title={'Connect with friends'}
                                description={
                                    'Connect with your favourite people and share your cherished memories'
                                }
                            />
                            <AboutListItem
                                icon={'fas fa-comments'}
                                iconColor={'text-indigo'}
                                title={'Chat with friends'}
                                description={
                                    'Chat with your friends instantly. ' +
                                    'Get friend suggestions from connected social media.'
                                }
                            />
                            
                            <AboutListItem
                                icon={'fas fa-palette'}
                                iconColor={'text-indigo'}
                                title={'Modern design'}
                                description={'Have the best experience with out modern design and great UX'}
                            />
                        </MDBCol>
                        <MDBCol lg={6} md={12} className="px-4">
                            <img  src={'./images/spaceman.svg'} width={300} alt={'Banner'} className={'img-fluid'}/>
                        </MDBCol>
                    </MDBRow>
                </MDBCardBody>
            </MDBCard>
        );
    }

}