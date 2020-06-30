import React from "react";
import {
    MDBContainer,
    MDBModal,
    MDBModalBody,
    MDBModalFooter,
    MDBModalHeader,
} from "mdbreact";
import SingleComment from "./SingleComment";
import {ClipLoader} from "react-spinners";
import CommentInput from "./CommentInput";
import PropTypes from 'prop-types';
import './Comment.css'

export default class CommentList extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
        };

        this.toggle = this.toggle.bind(this);
        this.loadMoreComments = this.loadMoreComments.bind(this);
    }

    toggle() {
        this.setState({modal: !this.state.modal},() => {
            if(this.state.modal) {
                this.props.getComments(this.props.postId)
            } else {
                this.props.onCommentModalCloseHandler();
            }
        });
    }

    loadMoreComments() {
        this.props.getComments(this.props.postId,true)
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.state.modal === true
    }

    render() {
        const {modal} = this.state;
        const {commentCount,comments,onHandleCommentLike,onHandleCommentReply,
            onHandlePostComment,sendingCommentReply,hasMoreComments,
            loadingComments,loadingMoreComments,getSubComments,loadingMoreSubComments,
            postId,sendingComment,loadingMoreSubCommentsId,sendingCommentId,
            sendingCommentReplyId,showMoreTag
        } = this.props;
        return (
            <>
                {React.cloneElement(showMoreTag, {
                    onClick: this.toggle
                })}
                <MDBModal size={'lg'} isOpen={modal} toggle={this.toggle}>
                    <MDBModalHeader toggle={this.toggle}>Comments ({commentCount})</MDBModalHeader>
                    <MDBModalBody style={{height: 600,overflowY: 'scroll'}}>
                        {loadingComments ?
                            <div className={'text-center mt-3'}>
                                <ClipLoader
                                    sizeUnit={"px"}
                                    size={100}
                                    color={'#f00'}
                                    loading={loadingComments}
                                />
                            </div>
                            :
                            comments.map((comment,index) =>
                                <SingleComment
                                    key={index}
                                    comment={comment}
                                    onHandleCommentLike={onHandleCommentLike}
                                    onHandleCommentReply={onHandleCommentReply}
                                    onHandlePostComment={onHandlePostComment}
                                    sendingCommentReply={sendingCommentReply}
                                    getSubComments={getSubComments}
                                    loadingMoreSubComments={loadingMoreSubComments}
                                    loadingMoreSubCommentsId={loadingMoreSubCommentsId}
                                    sendingCommentId={sendingCommentId}
                                    sendingCommentReplyId={sendingCommentReplyId}
                                    fromCommentList={true}
                                />
                            )
                        }
                        {hasMoreComments ?
                            (loadingMoreComments ?
                                <div className={'text-center mt-3'}>
                                    <ClipLoader
                                        sizeUnit={"px"}
                                        size={100}
                                        color={'#f00'}
                                        loading={loadingMoreComments}
                                    />
                                </div>
                                :
                                !loadingComments ?
                                    <p className={'text-center'} onClick={this.loadMoreComments}><a href={'#'} className={'text-dark'}>Load more comments (+)</a></p>
                                    :null
                            )
                            :
                            <p className={'text-center text-dark'}>No more comments...</p>
                        }
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBContainer>
                            <CommentInput
                             inputVisibility={true}
                             onHandlePostComment={onHandlePostComment}
                             postId={postId}
                             sendingComment={sendingComment}
                             sendingCommentId={sendingCommentId}
                            />
                        </MDBContainer>
                    </MDBModalFooter>
                </MDBModal>

            </>
        );
    }
}

CommentList.propTypes = {
    hasMoreComments: PropTypes.bool.isRequired,
    loadingComments: PropTypes.bool.isRequired,
    loadingMoreComments: PropTypes.bool.isRequired,
    getComments: PropTypes.func.isRequired,
    onHandlePostComment: PropTypes.func.isRequired,
    sendingCommentReply: PropTypes.bool.isRequired,
    onHandleCommentReply: PropTypes.func.isRequired,
    onHandleCommentLike: PropTypes.func.isRequired,
    commentCount: PropTypes.number.isRequired,
    postId: PropTypes.number.isRequired,
    onCommentModalCloseHandler: PropTypes.func.isRequired,
    getSubComments: PropTypes.func.isRequired,
    loadingMoreSubComments: PropTypes.bool.isRequired,
    loadingMoreSubCommentsId: PropTypes.number.isRequired,
    sendingCommentId: PropTypes.number.isRequired,
    sendingCommentReplyId: PropTypes.number.isRequired,
    sendingComment: PropTypes.bool.isRequired,
    showMoreTag: PropTypes.element.isRequired
}

