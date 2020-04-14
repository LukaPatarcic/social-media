import React,{Component} from "react";
import {ClipLoader} from "react-spinners";
import PropTypes from 'prop-types';
import PostItem from "./PostItem";

export default class PostList extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {
            posts,hasMore,loading,comments,onHandlePostLike,
            hasMoreComments,commentOffset,loadingComments,loadingMoreComments,
            sendingComment,onHandlePostComment,onHandleCommentReply,
            onHandleCommentLike,sendingCommentReply,getComments,onCommentModalCloseHandler,
            getSubComments,loadingMoreSubComments,hasMoreSubComments,
            loadingMoreSubCommentsId,sendingCommentId,sendingCommentReplyId
        } = this.props;
        return (
            <>
                {posts.map((post,index) => (
                   <PostItem
                       key={index}
                       post={post}
                       comments={comments}
                       hasMoreComments={hasMoreComments}
                       commentOffset={commentOffset}
                       loadingComments={loadingComments}
                       onCommentModalCloseHandler={onCommentModalCloseHandler}
                       loadingMoreComments={loadingMoreComments}
                       sendingComment={sendingComment}
                       getComments={getComments}
                       sendingCommentReply={sendingCommentReply}
                       onHandleCommentReply={onHandleCommentReply}
                       onHandleCommentLike={onHandleCommentLike}
                       onHandlePostLike={onHandlePostLike}
                       onHandlePostComment={onHandlePostComment}
                       getSubComments={getSubComments}
                       loadingMoreSubComments={loadingMoreSubComments}
                       hasMoreSubComments={hasMoreSubComments}
                       loadingMoreSubCommentsId={loadingMoreSubCommentsId}
                       sendingCommentId={sendingCommentId}
                       sendingCommentReplyId={sendingCommentReplyId}
                   />
                ))}
                {hasMore ?
                    (loading &&
                        <div className={'text-center mt-3'}><ClipLoader sizeUnit={"px"} size={100} color={'#f00'} loading={loading}/></div>)
                    :
                    <p className={'text-center text-white'}>No more posts</p>}
            </>
        );
    }
}

PostList.propTypes = {
    posts: PropTypes.array.isRequired,
    comments: PropTypes.array.isRequired,
    hasMoreComments: PropTypes.bool.isRequired,
    loadingComments: PropTypes.bool.isRequired,
    loadingMoreComments: PropTypes.bool.isRequired,
    getComments: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    sendingComment: PropTypes.bool.isRequired,
    hasMore: PropTypes.bool.isRequired,
    onCommentModalCloseHandler: PropTypes.func.isRequired,
    onHandlePostLike: PropTypes.func.isRequired,
    onHandlePostComment: PropTypes.func.isRequired,
    sendingCommentReply: PropTypes.bool.isRequired,
    onHandleCommentReply: PropTypes.func.isRequired,
    onHandleCommentLike: PropTypes.func.isRequired,
    getSubComments: PropTypes.func.isRequired,
    loadingMoreSubComments: PropTypes.bool.isRequired,
    loadingMoreSubCommentsId: PropTypes.number.isRequired,
    sendingCommentId: PropTypes.number.isRequired,
    sendingCommentReplyId: PropTypes.number.isRequired,

};