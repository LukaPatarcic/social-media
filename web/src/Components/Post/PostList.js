import React from "react";
import {MDBBadge, MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBIcon, MDBRow} from "mdbreact";
import LikeButton from "./LikeButton";
import cookie from "react-cookies";
import TimeAgo from "react-timeago";
import PostItem from "./PostItem";
import {BASE_URL} from "../../Config";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "react-spinners/ClipLoader";

export default class PostList extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            loading: false,
            offset: 1
        }
    }

    componentDidMount() {
        const {offset} = this.state;
        fetch(BASE_URL + '/post?offset='+offset,{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+cookie.load('access-token')
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
        const {posts} = this.state;
        return (
            <InfiniteScroll next={this.componentDidMount} hasMore={true} loader={<Loader size={20} color={'red'} />} dataLength={posts.length}>
                {this.state.posts.map((post,index) =>
                    <PostItem key={index} post={post} />
                )}
            </InfiniteScroll>
        );
    }
}