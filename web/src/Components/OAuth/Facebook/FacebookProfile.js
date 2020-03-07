import * as React from "react";
import {MDBBtn, MDBCard, MDBCardBody, MDBCardHeader, MDBCol, MDBContainer, MDBRow} from "mdbreact";
import FacebookLogout from "./FacebookLogout";

export default class FacebookProfile extends React.Component{

    render() {
        const {first_name,last_name,gender,age_range,picture,birthday,friends} = this.props.facebookData;
        console.log(this.props);
        return (
            <MDBContainer>
                <MDBRow>
                    <MDBCol sm={12}>
                        <MDBCard className={'mt-5'}>
                            <MDBCardHeader className={'text-center text-danger'}>
                                <h3>Facebook Profile</h3>
                            </MDBCardHeader>
                            <MDBCardBody>
                                <MDBRow center>
                                    <MDBCol sm={12} md={4}>
                                        <img className={'img-fluid rounded-circle z-depth-3'} src={picture.data.url}/>
                                    </MDBCol>
                                    <MDBCol sm={12} md={4}>
                                        Name: {first_name + ' ' + last_name} ({gender})<br/>
                                        Birthday: {birthday} ({age_range.min})<br/>
                                        Friends (total: {friends.summary.total_count}):
                                        {friends.data.map((friend,index) => {
                                            return (
                                                <MDBRow key={index} className={'mb-2'}>
                                                    <MDBCol sm={12} md={2}>
                                                        <img className={'img-fluid rounded-circle'} src={friend.picture.data.url}/>
                                                    </MDBCol>
                                                    <MDBCol sm={12} md={10}>
                                                        {friend.name}
                                                    </MDBCol>
                                                </MDBRow>
                                            );
                                        })}
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow end>
                                    <FacebookLogout />
                                </MDBRow>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>

        );
    }
}