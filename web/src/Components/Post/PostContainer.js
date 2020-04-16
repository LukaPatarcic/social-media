import React from "react";
import PostList from "./PostList";
import {getPostLikes, getPosts, postComment, postLike} from "../../Api/post";
import toastr from 'toastr/build/toastr.min'
import {commentLike, commentReply, getComments, getSubComments} from "../../Api/comment";
import PropTypes from 'prop-types';
import PostCreate from "./PostCreate";

const defaultState = {
    posts: [],
    likes: [],
    loading: false,
    loadingComments: false,
    loadingPostLikes: false,
    loadingMorePostLikes: false,
    loadingMoreComments: false,
    loadingMoreSubComments: false,
    loadingMoreSubCommentsId: 0,
    sendingComment: false,
    sendingCommentId: 0,
    sendingCommentReply: false,
    sendingCommentReplyId: 0,
    hasMore: true,
    hasMoreComments: true,
    hasMorePostLikes: true,
    offset: 0,
    postLikesOffset: 0,
    commentOffset: 0,
    subCommentOffset: 0
}
export default class PostContainer extends React.Component{

    constructor(props) {
        super(props);
        this.state = defaultState;

        this.handlePostLike = this.handlePostLike.bind(this);
        this.handlePostAdd = this.handlePostAdd.bind(this);
        this.handlePostComment = this.handlePostComment.bind(this);
        this.handleCommentLike = this.handleCommentLike.bind(this);
        this.handleCommentReply = this.handleCommentReply.bind(this);
        this.commentModalCloseHandler = this.commentModalCloseHandler.bind(this);
        this.postLikesModalCloseHandler = this.postLikesModalCloseHandler.bind(this);
        this.handleScroll = this.handleScroll.bind(this)
        this.getSubComments = this.getSubComments.bind(this);
        this.getComments = this.getComments.bind(this);
        this.getPostLikes = this.getPostLikes.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if(nextProps.profile !== this.props.profile) {
            this.setState({})
            this.getPosts(nextProps.profile);
        }

        return  true;
    }

    componentDidMount() {
        this.getPosts(this.props.profile);
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll)
    }

    handleScroll() {
        if(window.scrollY+window.innerHeight > document.body.offsetHeight - 600) {
            this.getPosts(this.props.profile);
        }
    }

    commentModalCloseHandler() {
        this.setState({hasMoreComments: true, commentOffset: 0})
    }

    postLikesModalCloseHandler() {
        this.setState({hasMorePostLikes: true, postLikesOffset: 0})
    }

    handlePostAdd(post) {
        this.setState((prevState) => ({
            posts: [post,...prevState.posts]
        }))
    }

    getPosts(profile) {
        const {offset,loading,hasMore} = this.state;
        this.setState({loading: true});
        if(loading || !hasMore) {
            return;
        }
        getPosts(offset,profile)
            .then(data => {
                this.setState((prevState) => ({
                    loading: false,
                    posts: prevState.posts.concat(data),
                    offset: prevState.offset + 10,
                    hasMore: data.length >= 10
                }))
            })
            .catch(err => err.response.json().then(err => {
                this.setState({error: err.error, loading: false});
            }))
    }

    getPostLikes(id,loadingMore = false) {
        const loading = loadingMore ? {loadingMorePostLikes: true} : {loadingPostLikes: true}
        this.setState(loading);

        getPostLikes(id,this.state.postLikesOffset)
            .then(response => {
                this.setState((prevSate) => ({
                    likes: [...prevSate.likes,...response],
                    postLikesOffset: prevSate.postLikesOffset + 10,
                    loadingPostLikes: false,
                    hasMorePostLikes: response.length >= 10,
                    loadingMorePostLikes: false,
                }));
            })
            .catch(err => err.response.json().then(err => {
                toastr.error(err.error);
                this.setState({
                    loadingPostLikes: false,
                    loadingMorePostLikes: false,
                });
            }))
    }

    getComments(id,loadingMore = false) {
        const loading = loadingMore ? {loadingMoreComments: true} : {loadingComments: true}
        this.setState(loading);

        getComments(id,this.state.commentOffset)
            .then(response => {
                this.setState((prevSate) => {
                    prevSate.posts.filter(post => {
                        if(post.id === id) {
                            post.comments = [...post.comments,...response]
                        }
                        return post;
                    });

                    return {
                        posts: prevSate.posts,
                        commentOffset: prevSate.commentOffset + 10,
                        loadingComments: false,
                        hasMoreComments: response.length >= 10,
                        loadingMoreComments: false,
                    }
                });
            })
            .catch(err => err.response.json().then(err => {
                toastr.error(err.error);
                this.setState({
                    loadingComments: false,
                    loadingMoreComments: false,
                });
            }))
    }

    getSubComments(id,offset) {
        this.setState({loadingMoreSubComments: true,loadingMoreSubCommentsId: id});
        getSubComments(id,offset)
            .then(response => {
                this.setState((prevState) => {
                    prevState.posts.filter(post => {
                        post.comments.filter(comment => {
                            if(comment !== null) {
                                if (comment.id === id) {
                                    comment.subComments = [...comment.subComments,...response];
                                    comment.subCommentCount = comment.subCommentCount - response.length;
                                }
                            }
                        })

                        return post;
                    });

                    return {
                        comments: prevState.comments,
                        posts: prevState.posts,
                        hasMoreSubComments: response.length >= 10,
                        loadingMoreSubComments: false
                    }
                })
            })
            .catch(err => err.response.json().then(err => {
                toastr.error(err.error);
                this.setState({loadingMoreSubComments: false})
            }))
    }

    handlePostComment(comment,id) {
        this.setState({sendingComment: true,sendingCommentId: id});
        postComment(comment,id)
            .then(response => {
                this.setState((prevState) => {
                    prevState.posts.filter(post => {
                        if(post.id === id) {
                            post.comments = [response.comment,...post.comments];
                            post.commentsCount = post.commentsCount + 1;
                            return post;
                        }
                        return post;
                    });

                    return {
                        posts: prevState.posts,
                        sendingComment: false,
                    }
                })
            })
            .catch(err => err.response.json().then(err => {
                this.setState({sendingComment: false})
                toastr.error(err.error);
            }))

    }

    handleCommentReply(id,reply) {
        commentReply(id,reply)
            .then(response => {
                this.setState((prevState => {
                    prevState.posts.filter(post => {
                        if(post.comments !== null) {
                            post.comments.filter(comment => {
                                if (comment.id === id) {
                                    comment.subComments = [response.comment, ...comment.subComments];
                                }
                                return comment;
                            })
                            return post;
                        }
                        return post;
                    });
                    return {posts: prevState.posts,comments: prevState.comments};
                }))
            })
            .catch(err => err.response.json().then(err => {
                toastr.error(err.error);
            }))
    }

    handleCommentLike(id,liked) {

        this.setState((prevState) => {

            prevState.posts.filter(post => {
                post.comments.filter(comment => {
                    if(comment !== null) {
                        if (comment.id === id) {
                            comment.liked = !liked;
                            comment.likes = comment.liked ? comment.likes+1 : comment.likes -1;
                            return post;
                        }
                    }
                })
                return post;
            });

            return {posts: prevState.posts};
        });

        const method = liked ? 'DELETE' : 'POST';
        commentLike(id,method)
            .then(response => {})
            .catch(err => err.response.json().then(err => {
                toastr.error(err.error);
            }))
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
        }, () => {

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
        const {showCreatePost} = this.props
        return (
            <>
                {
                    showCreatePost ?
                    <PostCreate
                        showCreatePost={showCreatePost}
                        onHandlePostAdd={this.handlePostAdd}
                    />
                    : null
                }
            <PostList
                {...this.state}
                onHandlePostLike={this.handlePostLike}
                onHandleCommentReply={this.handleCommentReply}
                onHandleCommentLike={this.handleCommentLike}
                onHandlePostComment={this.handlePostComment}
                onCommentModalCloseHandler={this.commentModalCloseHandler}
                onPostLikesModalCloseHandler={this.postLikesModalCloseHandler}
                getComments={this.getComments}
                getSubComments={this.getSubComments}
                getPostLikes={this.getPostLikes}
            />
            }
            </>
        );
    }


    static defaultProps = {
        showCreatePost: true,
        profile: null
    }
}

PostContainer.propTypes = {
    showCreatePost: PropTypes.bool,
    profile: PropTypes.number
};