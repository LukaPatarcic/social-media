import React from "react";
import {MDBBadge, MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBIcon, MDBRow} from "mdbreact";
import TimeAgo from "react-timeago";
import LikeButton from "./LikeButton";

export default class PostItem extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            likes: this.props.post.likes
        }
    }

    handleLikes(e) {
        this.setState((prevState) => ({likes: e ? prevState.likes+1 : prevState.likes-1}))
    }

    render() {
        const {post,size} = this.props;
        const {likes} = this.state;
        return (
            <MDBRow center>
                <MDBCol sm={12} md={size ? size : 8}>
                    <MDBCard className={'my-3'}>
                        <MDBCardBody>
                            <h2>
                                <MDBBadge color="red" className={'mr-3'}>
                                    <MDBIcon className={'text-white'} icon={'user'} />
                                </MDBBadge>
                                {post.firstName} {post.lastName}
                            </h2>
                            <small><TimeAgo date={post.createdAt} /></small>
                            <p>{post.text}</p>
                            <MDBRow>
                                <MDBCol>
                                    Liked by <MDBBadge style={{fontSize: 14}} color={'red'}>{likes}</MDBBadge> people
                                </MDBCol>
                            </MDBRow>
                            <MDBRow center={true} className={'text-center'}>
                                <MDBCol sm={4}>
                                    <LikeButton
                                        liked={post.liked}
                                        postId={post.id}
                                        handleLikes={this.handleLikes.bind(this)}
                                    />
                                </MDBCol>
                                <MDBCol sm={4}>
                                    <MDBBtn color={'white'} block={true} style={{boxShadow: 'none'}}>
                                        <MDBIcon  far={true} icon={'comment'} size={'2x'}/>
                                    </MDBBtn>
                                </MDBCol>
                                <MDBCol sm={4}>
                                    <MDBBtn color={'white'} block={true} style={{boxShadow: 'none'}}>
                                        <MDBIcon far={false} icon={'share'} size={'2x'}/>
                                    </MDBBtn>
                                </MDBCol>
                            </MDBRow>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        );
    }
}