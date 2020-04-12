import React,{Component} from "react";
import {MDBBadge, MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBIcon, MDBRow} from "mdbreact";
import {setProfilePicture} from "../../Helpers";
import {Link} from "react-router-dom";
import TimeAgo from "react-timeago";
import SingleComment from "../PostComment/SingleComment";
import CommentInput from "../PostComment/CommentInput";
import LikeButton from "./LikeButton";
import PostShare from "./PostShare";
import PropTypes from 'prop-types';

export default class PostItem extends Component{
    constructor(props) {
        super(props);
        this.state = {
            inputVisibility: false
        }

        this.handleInputVisibility = this.handleInputVisibility.bind(this);
    }

    handleInputVisibility() {
        this.setState((prevState) => ({inputVisibility: !prevState.inputVisibility}))
    }

    render() {
        const {post,onHandlePostLike} = this.props;
        const {inputVisibility} = this.state;
        return (
            <MDBRow center>
                <MDBCol sm={12} md={8}>
                    <MDBCard className={'my-3'}>
                        <MDBCardBody>
                            <MDBRow className={'mb-3'}>
                                <MDBCol size={1} className={'pr-0 d-flex justify-content-start align-items-center'}>
                                    <img
                                        className={'img-fluid'}
                                        src={setProfilePicture(post.firstName,post.lastName)}
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
                                                                             color={'red'}>{post.likes}</MDBBadge></span>
                                    <span>Comments <MDBBadge style={{fontSize: 14}}
                                                             color={'black'}>{post.commentCount}</MDBBadge></span>
                                </MDBCol>
                            </MDBRow>
                            <hr/>
                            <MDBRow>
                                <MDBCol col={12}>
                                    <SingleComment comment={post.comment} />

                                    {/*{commentCount > 1 &&*/}
                                    {/*<CommentsAll*/}
                                    {/*    commentCount={commentCount}*/}
                                    {/*    setNewSingleComment={this.setNewSingleComment}*/}
                                    {/*    setNewCommentCount={this.setNewCommentCount}*/}
                                    {/*    getComment={this.getComment}*/}
                                    {/*    post={post.id}*/}
                                    {/*/>}*/}
                                </MDBCol>
                            </MDBRow>

                            <CommentInput
                                inputVisibility={inputVisibility}
                            />

                            <MDBRow center={true} className={'text-center'}>
                                <MDBCol size={4}>
                                    <LikeButton
                                        liked={post.liked}
                                        id={post.id}
                                        onHandlePostLike={onHandlePostLike}
                                    />
                                </MDBCol>
                                <MDBCol size={4}>
                                    <MDBBtn
                                        color={'white'}
                                        block={true}
                                        style={{boxShadow: 'none'}}
                                        onClick={this.handleInputVisibility}
                                    >
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

PostItem.propTypes = {
    post: PropTypes.object.isRequired,
    onHandlePostLike: PropTypes.func.isRequired
}