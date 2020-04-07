import {MDBBadge, MDBBtn, MDBCol, MDBContainer, MDBIcon, MDBInputGroup, MDBRow} from "mdbreact";
import TimeAgo from "react-timeago";
import CommentLike from "./CommentLike";
import CommentReply from "./CommentReply";
import React from "react";
import {BASE_URL} from "../../Config";
import cookie from "react-cookies";
import CommentInput from "./CommentInput";

export default class SingleComment extends React.Component {

    constructor(props) {
        super(props);
        const {likes} = this.props.comment
        this.state = {
            likes: likes ? parseInt(this.props.comment.likes) : 0,
            liked: !!this.props.comment.liked
        }

        this.addLike = this.addLike.bind(this)
        this.removeLike = this.removeLike.bind(this)
        this.handleLike = this.handleLike.bind(this)
    }

    addLike() {
        this.setState((prevState) => ({
            likes: prevState.likes+1
        }));
    }

    removeLike() {
        this.setState((prevState) => ({
            likes: prevState.likes-1
        }));
    }

    handleLike() {
        const {liked} = this.state;
        fetch(BASE_URL+'/comment/like',{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' +  cookie.load('access-token')
            },
            method: liked ? 'DELETE' : 'POST',
            body: JSON.stringify({id: this.props.comment.id})
        })
            .then(response => response.json())
            .then(data => {
                if(data.success) {
                    this.setState({liked: !this.state.liked},() => {
                        this.state.liked ?
                            this.addLike()
                            :
                            this.removeLike()
                    })

                }
            })
    }

    render() {
        const {comment} = this.props;
        const {likes,liked} = this.state;
        return (
            <>
            <MDBRow>
                <MDBCol sm={1} className={'pr-0 d-flex align-items-start justify-content-center'}>
                    <img
                        className={'img-fluid pb-2'}
                        src={'https://eu.ui-avatars.com/api/?rounded=true&background=f44336&color=ffffff&size=38&name=' + comment.firstName + '+' + comment.lastName}
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
                        <MDBBadge className={'float-right z-index-1 position-relative'} color={'red'}>{likes}</MDBBadge>
                    </MDBCol>
                    <MDBCol sm={12}>
                        <a className={'text-danger mr-3'} style={{fontSize: 14,fontWeight: 400}} onClick={this.handleLike}>
                            {liked ? 'Liked' : 'Like'}
                        </a>
                        <a href={'#'} className={'text-danger'} style={{fontSize: 14}}>Reply</a>
                        <MDBInputGroup
                            material
                            size={'sm'}
                            name={'comment'}
                            // value={this.state.comment}
                            // onChange={this.onChangeHandler}
                            // onKeyDown={this.keyPress}
                            containerClassName="mb-2 mt-0"
                            hint={'Enter comment...'}
                            append={
                                <MDBBtn color={'white'} style={{boxShadow: 'none'}} onClick={this.submitHandler}>
                                    <MDBIcon  far={true} style={{color: 'red'}} icon={'paper-plane'} size={'2x'}/>
                                </MDBBtn>
                            }
                        />
                    </MDBCol>
                </MDBCol>
            </MDBRow>
                <hr />
            </>
        )
    }
}