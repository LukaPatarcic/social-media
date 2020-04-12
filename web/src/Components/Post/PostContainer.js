import React from "react";
import PostList from "./PostList";
import debounce from "lodash.debounce";
import {getPosts, postLike} from "../../Api/post";
import toastr from 'toastr/build/toastr.min'

export default class PostContainer extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            loading: false,
            offset: 0,
            hasMore: true
        }

        this.handlePostLike = this.handlePostLike.bind(this);
    }

    getPosts() {
        const {offset,loading} = this.state;
        this.setState({loading: true});
        if(loading) {
            return;
        }
        getPosts(offset)
            .then(data => {
                this.setState((prevState) => ({
                    loading: false,
                    posts: prevState.posts.concat(data),
                    offset: prevState.offset + 10,
                    hasMore: data.length > 0
                }))
            })
            .catch(err => err.response.json().then(err => {
                this.setState({error: err.error, loading: false});
            }))
    }

    componentDidMount() {
        this.getPosts();
        window.addEventListener('scroll', debounce(this.handleScroll.bind(this),100));
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', debounce(this.handleScroll.bind(this),100))
    }

    handleScroll() {
        if(window.scrollY+window.innerHeight > document.body.offsetHeight - 600) {
            this.getPosts();
        }
    }

    handlePostLike(id,liked) {
        this.setState((prevState) => {
            prevState.posts.filter(post => {
                if (post.id === id) {
                    post.liked = !post.liked;
                    post.likes = post.liked ? post.likes+1 : post.likes -1;
                    return post;
                }
                return post;
            });
            return {posts: prevState.posts};
        });

        const method = liked ? 'DELETE' : 'POST';
        postLike(id,method)
            .then(response => {
            })
            .catch(err => err.response.json().then(err => {
                toastr.error(err.error);
            }))
    }

    render() {
        return (
            <PostList
                {...this.state}
                onHandlePostLike={this.handlePostLike}
            />
        );
    }
}