import * as React from "react";
import cookie from 'react-cookies'
import {Redirect} from "react-router-dom";
import {MDBBadge, MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBIcon, MDBRow} from "mdbreact";
import PostCreate from "./Post/PostCreate";
import PostList from "./Post/PostList";

export default class Feed extends React.Component{

    constructor(props) {
        super(props);
    }


    render() {

        return (
            <MDBContainer>
                <PostCreate />
                <PostList />
            </MDBContainer>

        );
    }
}