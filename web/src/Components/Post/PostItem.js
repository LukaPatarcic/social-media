import React from "react";
import {MDBBadge, MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBIcon, MDBRow} from "mdbreact";
import TimeAgo from "react-timeago";
import LikeButton from "./LikeButton";
import {Link} from "react-router-dom";

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
                                <p>
                                    <img
                                        className={'img-fluid mr-3'}
                                        src={'https://eu.ui-avatars.com/api/?rounded=true&background=f44336&color=ffffff&size=38&name='+post.firstName+'+'+post.lastName}
                                    />
                                    <Link className={'text-dark'} to={'/profile/'+ post.profileName}>{post.firstName} {post.lastName}</Link>
                                </p>
                            </h2>
                            <small><TimeAgo date={post.createdAt} /></small>
                            <p>{post.text}</p>
                            <MDBRow>
                                <MDBCol>
                                    Liked by <MDBBadge style={{fontSize: 14}} color={'red'}>{likes}</MDBBadge> people
                                </MDBCol>
                            </MDBRow>
                            <MDBRow center={true} className={'text-center'}>
                                <MDBCol size={4}>
                                    <LikeButton
                                        liked={post.liked}
                                        postId={post.id}
                                        handleLikes={this.handleLikes.bind(this)}
                                    />
                                </MDBCol>
                                <MDBCol size={4}>
                                    <MDBBtn color={'white'} block={true} style={{boxShadow: 'none'}}>
                                        <MDBIcon  far={true} icon={'comment'} size={'2x'}/>
                                    </MDBBtn>
                                </MDBCol>
                                <MDBCol size={4}>
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