import React from "react";
import {
    MDBContainer,
    MDBModal,
    MDBModalBody,
    MDBModalFooter,
    MDBModalHeader,
} from "mdbreact";
import {BASE_URL} from "../../Config";
import cookie from "react-cookies";
import SingleComment from "./SingleComment";
import {ClipLoader} from "react-spinners";
import CommentInput from "./CommentInput";

export default class CommentsAll extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            loading: false,
            offset: 0,
            hasMore: true,
            comments: [],
            commentCount: this.props.commentCount
        }

        this.handleScroll = this.handleScroll.bind(this)
        this.setNewComments = this.setNewComments.bind(this)
        this.getComments = this.getComments.bind(this)
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal,
            comments: [],
            offset: 0,
            hasMore: true,
            post: this.props.post
        },() => {
            if(this.state.modal) {
               this.getComments()
            }
        });
    };

    handleScroll(e) {
        let el = e.target;
        if(el.scrollHeight - el.scrollTop === el.clientHeight) {
            this.getComments();
        }
    }

    setNewComments(newComment) {
        this.setState((prevState) => {
            let newComments = [newComment,...prevState.comments];
            return ({
                comments: newComments
            })
        });
    }

    getComments() {
        const {post} = this.props;
        const {offset,hasMore} = this.state;
        if(!hasMore)
            return;
        this.setState({loading: true})
        fetch(BASE_URL+'/comment/'+post+'?offset='+offset,{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' +  cookie.load('access-token')
            },
            method: "GET",
        })
            .then((response => response.json()))
            .then((data => {
                this.setState((prevState) => ({
                    loading: false,
                    comments: [...prevState.comments,...data],
                    offset: prevState.offset + 10,
                    hasMore: data.length > 0
                }));
            }))
            .catch(err => {
                this.setState({error: 'Oops... Something went wrong!',loading: false});
            })
    }


    render() {
        const {comments,loading,hasMore,modal} = this.state;
        const {post,commentCount} = this.props;
        return (
            <>
                <MDBContainer onScroll={this.handleScroll}>
                    <p className={'text-center'}>
                        <a onClick={this.toggle} href={'#'} className={'text-danger'}>Show comments...</a>
                    </p>
                    <MDBModal size={'lg'} isOpen={modal} toggle={this.toggle}>
                        <MDBModalHeader toggle={this.toggle}>Comments ({commentCount})</MDBModalHeader>
                        <MDBModalBody style={{height: 600,overflowY: 'scroll'}}>
                            {comments.map((comment,index) =>
                                <SingleComment key={index} comment={comment} />
                            )}
                            {hasMore ?
                                (loading &&
                                    <div className={'text-center mt-3'}>
                                        <ClipLoader
                                            sizeUnit={"px"}
                                            size={100}
                                            color={'#f00'}
                                            loading={loading}
                                        />
                                    </div>
                                )
                                :
                                <p className={'text-center text-dark'}>No more comments...</p>
                            }
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBContainer>
                                <CommentInput
                                    commentInput={true}
                                    comments={comments}
                                    modal={modal}
                                    setNewSingleComment={this.props.setNewSingleComment}
                                    setNewCommentCount={this.props.setNewCommentCount}
                                    setNewComments={this.setNewComments}
                                    id={post}
                                />
                            </MDBContainer>
                        </MDBModalFooter>
                    </MDBModal>
                </MDBContainer>

            </>
        );
    }
}