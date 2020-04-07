import React from "react";
import {
    MDBBadge,
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCol,
    MDBIcon,
    MDBRow,
} from "mdbreact";
import TimeAgo from "react-timeago";
import LikeButton from "./LikeButton";
import {Link} from "react-router-dom";
import PostShare from "./PostShare";
import {BASE_URL} from "../../Config";
import cookie from "react-cookies";
import CommentInput from "../PostComment/CommentInput";
import SingleComment from "../PostComment/SingleComment";
import CommentsAll from "../PostComment/CommentsAll";

export default class PostItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            likes: this.props.post.likes,
            commentInput: false,
            comment: '',
            commentObj: this.props.post.comment,
            commentCount: this.props.post.commentCount
        }
        this.setNewSingleComment = this.setNewSingleComment.bind(this);
        this.setNewCommentCount = this.setNewCommentCount.bind(this);

    }

    setNewSingleComment(comment) {

        this.setState({commentObj: {}})
        this.setState({commentObj: comment},() => {
            console.log(this.state.commentObj);
        })
    }

    setNewCommentCount() {
        this.setState((prevState) => ({commentCount: prevState.commentCount + 1}))
    }

    commentInputVisibility() {
        this.setState((prevState) => ({commentInput: !prevState.commentInput}))
    }

    handleLikes(e) {
        this.setState((prevState) => ({likes: e ? prevState.likes + 1 : prevState.likes - 1}))
    }


    render() {
        const {post, size} = this.props;
        const {likes, commentInput, commentObj, commentCount} = this.state;
        return (
            <MDBRow center>
                <MDBCol sm={12} md={size ? size : 8}>
                    <MDBCard className={'my-3'}>
                        <MDBCardBody>
                            <MDBRow className={'mb-3'}>
                                <MDBCol size={1} className={'pr-0 d-flex justify-content-start align-items-center'}>
                                    <img
                                        className={'img-fluid'}
                                        src={'https://eu.ui-avatars.com/api/?rounded=true&background=f44336&color=ffffff&size=48&name=' + post.firstName + '+' + post.lastName}
                                        alt={post.firstName + ' ' + post.lastName}
                                    />
                                </MDBCol>
                                <MDBCol size={10} className={'pl-3'}>
                                    <h5 className={'mb-0'}>
                                        <Link className={'text-dark'}
                                              to={'/profile/' + post.profileName}>{post.firstName} {post.lastName}</Link><br/>
                                    </h5>
                                    <small className={'text-muted'} style={{fontSize: 11}}><TimeAgo
                                        date={post.createdAt}/></small>
                                </MDBCol>
                            </MDBRow>
                            <MDBRow>
                                <MDBCol>
                                    <p>{post.text}</p>
                                </MDBCol>
                            </MDBRow>
                            <MDBRow>
                                <MDBCol>
                                    <span className={'mr-3'}>Likes <MDBBadge style={{fontSize: 14}}
                                                                             color={'red'}>{likes}</MDBBadge></span>
                                    <span>Comments <MDBBadge style={{fontSize: 14}}
                                                             color={'black'}>{this.state.commentCount}</MDBBadge></span>
                                </MDBCol>
                            </MDBRow>
                            <hr/>
                            <MDBRow>
                                <MDBCol col={12}>
                                    <SingleComment comment={this.state.commentObj} />

                                    {commentCount > 1 &&
                                    <CommentsAll
                                        commentCount={commentCount}
                                        setNewSingleComment={this.setNewSingleComment}
                                        setNewCommentCount={this.setNewCommentCount}
                                        getComment={this.getComment}
                                        post={post.id}
                                    />}
                                </MDBCol>
                            </MDBRow>

                            <CommentInput
                                comment={false}
                                post={true}
                                commentInput={commentInput}
                                setNewSingleComment={this.setNewSingleComment}
                                setNewCommentCount={this.setNewCommentCount}
                                id={this.props.post.id}
                            />

                            <MDBRow center={true} className={'text-center'}>
                                <MDBCol size={4}>
                                    <LikeButton
                                        liked={post.liked}
                                        postId={post.id}
                                        handleLikes={this.handleLikes.bind(this)}
                                    />
                                </MDBCol>
                                <MDBCol size={4}>
                                    <MDBBtn color={'white'} block={true} style={{boxShadow: 'none'}}
                                            onClick={this.commentInputVisibility.bind(this)}>
                                        <MDBIcon far={true} icon={'comment'} size={'2x'}/>
                                    </MDBBtn>
                                </MDBCol>
                                <MDBCol size={4}>
                                    <PostShare/>
                                </MDBCol>
                            </MDBRow>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        );
    }
}