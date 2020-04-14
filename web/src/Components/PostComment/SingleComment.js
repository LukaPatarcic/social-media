import {MDBBadge, MDBCol, MDBRow} from "mdbreact";
import TimeAgo from "react-timeago";
import React from "react";
import {setProfilePicture} from "../../Helpers";
import PropTypes from 'prop-types'
import SubCommentInput from "./SubCommentInput";
import SubCommentList from "./SubCommentList";

export default class SingleComment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            inputVisibility: false,
        };

        this.handleInputVisibility = this.handleInputVisibility.bind(this);
        this.handleLike = this.handleLike.bind(this);
    }

    handleInputVisibility(e) {
        e.preventDefault();
        this.setState((prevState) => ({inputVisibility: !prevState.inputVisibility}))
    }

    handleLike(e) {
        e.preventDefault();
        this.props.onHandleCommentLike(this.props.comment.id,this.props.comment.liked)
    }


    render() {
        const {comment,onHandleCommentReply,sendingCommentReply,
            getSubComments,loadingMoreSubComments,
            loadingMoreSubCommentsId,sendingCommentReplyId,
            sendingCommentId
        } = this.props;
        const {inputVisibility} = this.state;

        return (
            <>
            <MDBRow>
                <MDBCol sm={1} className={'pr-0 d-flex align-items-start justify-content-center'}>
                    <img
                        className={'img-fluid pb-2'}
                        src={setProfilePicture(comment.firstName,comment.lastName)}
                    />
                </MDBCol>
                <MDBCol sm={11} className={'pl-0'}>
                    <MDBCol sm={12} style={{fontSize: 14}}>
                        {comment.firstName + ' ' + comment.lastName}
                        <small className={'text-muted'}>
                            <TimeAgo date={comment.createdAt}/></small>
                    </MDBCol>
                    <MDBCol sm={12} className={'text-muted'}>
                        {comment.text}
                        <MDBBadge className={'float-right z-index-1 position-relative'} color={'red'}>{comment.likes}</MDBBadge>
                    </MDBCol>
                    <MDBCol sm={12}>
                        <a className={'text-danger mr-3'} style={{fontSize: 14,fontWeight: 400}} onClick={this.handleLike}>
                            {comment.liked ? 'Liked' : 'Like'}
                        </a>
                        <a href={'#'} className={'text-danger'} style={{fontSize: 14}} onClick={this.handleInputVisibility}>Reply</a>
                    </MDBCol>
                    <MDBCol size={12}>
                        <SubCommentList
                            subComments={comment.subComments}
                            subCommentCount={comment.subCommentCount}
                            getSubComments={getSubComments}
                            loadingMoreSubComments={loadingMoreSubComments}
                            commentId={comment.id}
                            loadingMoreSubCommentsId={loadingMoreSubCommentsId}
                            sendingCommentId={sendingCommentId}
                            sendingCommentReplyId={sendingCommentReplyId}
                        />
                    </MDBCol>
                </MDBCol>
                <SubCommentInput inputVisibility={inputVisibility} onHandleCommentReply={onHandleCommentReply} sendingCommentReply={sendingCommentReply} commentId={comment.id} />
            </MDBRow>
                <hr />
            </>
        )
    }
}

SingleComment.propTypes = {
    comment: PropTypes.object.isRequired,
    sendingCommentReply: PropTypes.bool.isRequired,
    onHandlePostComment: PropTypes.func.isRequired,
    onHandleCommentReply: PropTypes.func.isRequired,
    onHandleCommentLike: PropTypes.func.isRequired,
    getSubComments: PropTypes.func.isRequired,
    loadingMoreSubComments: PropTypes.bool.isRequired,
    loadingMoreSubCommentsId: PropTypes.number.isRequired,
    sendingCommentId: PropTypes.number.isRequired,
    sendingCommentReplyId: PropTypes.number.isRequired,
};
