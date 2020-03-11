import React from "react";
import cookie from "react-cookies";
import PostItem from "./PostItem";
import {BASE_URL} from "../../Config";
import debounce from "lodash.debounce";
import {ClipLoader} from "react-spinners";

export default class PostList extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            loading: false,
            offset: 0,
            hasMore: true
        }

        // this.getPosts = this.getPosts().bind(this);
    }

    getPosts() {
        this.setState({loading: true})
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
                this.setState((prevState) => {
                    return {
                        loading: false,
                        posts: prevState.posts.concat(data),
                        offset: prevState.offset + 10,
                        hasMore: data.length > 0
                    }
                });

            }))
            .catch(err => {
                this.setState({error: true,loading: false});
            })
    }

    componentDidMount() {
        this.getPosts();
        window.addEventListener('scroll', debounce(this.handleScroll.bind(this),100));
    }

    handleScroll() {
        if(window.scrollY+window.innerHeight > document.body.offsetHeight - 200) {
            this.getPosts();
        }
    }

    render() {
        const {posts,loading,hasMore} = this.state;
        return (
            <>
                {posts.map((post,index) =>
                    <PostItem key={index} post={post} />
                )}
                {hasMore ? (loading &&   <div className={'text-center mt-3'}><ClipLoader sizeUnit={"px"} size={100} color={'#f00'} loading={loading}/></div>) : <p className={'text-center text-white'}>No more posts</p>}
            </>
        );
    }
}