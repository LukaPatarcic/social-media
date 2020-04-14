import {MDBBadge, MDBCol, MDBIcon, MDBRow, MDBTooltip} from "mdbreact";
import TimeAgo from "react-timeago";
import React from "react";
import {setProfilePicture} from "../../Helpers";
import PropTypes from 'prop-types'
import SubCommentInput from "./SubCommentInput";
import SubCommentList from "./SubCommentList";
import {Link} from "react-router-dom";

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
            sendingCommentId,fromCommentList
        } = this.props;
        const {inputVisibility} = this.state;

        return (
            <>
            <MDBRow>
                <MDBCol size={1} className={'pr-0 d-flex align-items-start justify-content-center'}>
                    <Link to={'/profile/'+comment.profileName}>
                        <img
                            className={'img-fluid pb-2'}
                            src={setProfilePicture(comment.firstName,comment.lastName,36)}
                            alt={''}
                        />
                    </Link>
                </MDBCol>
                <MDBCol size={11} className={'pl-0'}>
                    <MDBCol size={12} style={{fontSize: 14}} className={'pl-2'}>
                        <MDBTooltip>
                            <Link to={'/profile/'+comment.profileName} className={'text-dark'}>{comment.profileName}</Link>
                            <div>{comment.firstName + ' ' + comment.lastName}</div>
                        </MDBTooltip>
                        <span className={'text-muted'}> {comment.text}</span>
                    </MDBCol>
                    <MDBCol size={12} className={'pl-2'}>
                        <a className={'text-danger mr-3'} style={{fontSize: 14,fontWeight: 400}} onClick={this.handleLike}>
                            {comment.liked ? 'Liked' : 'Like'}
                        </a>
                        <a href={'#'} className={'text-danger'} style={{fontSize: 14,fontWeight: 400}} onClick={this.handleInputVisibility}>Reply</a>
                        <MDBIcon icon={'dot-circle'} className={'mx-1 text-muted'} style={{fontSize: 8}} />
                        <TimeAgo className={'text-muted'} style={{fontSize: 12}} date={comment.createdAt} />
                        <MDBTooltip>
                            <Link to={'#'} className={'float-right'}>
                                <MDBBadge color={'red'}>{comment.likes}</MDBBadge>
                            </Link>
                            <div>Likes</div>
                        </MDBTooltip>
                    </MDBCol>
                    <MDBCol size={12}>
                        <SubCommentInput
                            profileName={comment.profileName}
                            inputVisibility={inputVisibility}
                            onHandleCommentReply={onHandleCommentReply}
                            sendingCommentReply={sendingCommentReply}
                            commentId={comment.id}
                            fromCommentList={fromCommentList}
                        />
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
    fromCommentList: PropTypes.bool
};
