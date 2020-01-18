import React from "react";
import {MDBBadge, MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBIcon, MDBRow} from "mdbreact";
import LikeButton from "./LikeButton";
import cookie from "react-cookies";
import TimeAgo from "react-timeago";
import PostItem from "./PostItem";

export default class PostList extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            loading: false
        }
    }

    componentDidMount() {
        fetch('https://api.allshak.lukaku.tech/post',{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN': cookie.load('access-token')
            },
            method: "GET"
        })
            .then((response => response.json()))
            .then((data => {
                this.setState({loading: false, posts: data});
            }))
            .catch(err => {
                this.setState({error: true,loading: false});
            })
    }


    render() {
        return (
            <>
            {this.state.posts.map((post,index) =>
                <PostItem key={index} post={post} />
            )}
            </>
        );
    }
}