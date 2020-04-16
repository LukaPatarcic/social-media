import React,{Component} from "react";
import {MDBCol, MDBRow} from "mdbreact";
import PropTypes from 'prop-types';
import SingleSubComment from "./SingleSubComment";
import {ClipLoader} from "react-spinners";
import ShowMoreReplies from "./ShowMoreReplies";

export default class SubCommentList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            offset: 0
        };

        this.showMoreReplies = this.showMoreReplies.bind(this);
    }

    // shouldComponentUpdate(nextProps, nextState, nextContext) {
    //     return nextProps.loadingMoreSubComments !== this.props.loadingMoreSubComments || nextProps.subComments !== this.props.subComments
    // }


    showMoreReplies(e) {
        e.preventDefault();
        this.props.getSubComments(this.props.commentId,this.state.offset);
        this.setState((prevState) => ({offset: prevState.offset+3}))
    }

    render() {
        const {loadingMoreSubComments,subComments,subCommentCount,loadingMoreSubCommentsId,commentId} = this.props;

        return (
            <MDBRow className={'mt-3'}>
                <MDBCol size={12}>
                    {subComments.map((comment,index) => (
                        <SingleSubComment key={index} comment={comment} />
                    ))}
                    {loadingMoreSubComments ?
                        loadingMoreSubCommentsId === commentId ?
                            <div className={'text-center'}>
                                <ClipLoader sizeUnit={"px"} size={30} color={'#f00'} loading={loadingMoreSubComments}/>
                            </div>
                            :
                            subCommentCount > 0 ?
                                <ShowMoreReplies
                                    showMoreReplies={this.showMoreReplies}
                                    subCommentCount={subCommentCount}
                                />
                                : null
                        : subCommentCount > 0 ?
                            <ShowMoreReplies
                                showMoreReplies={this.showMoreReplies}
                                subCommentCount={subCommentCount}
                            />
                            :null
                    }
                </MDBCol>
            </MDBRow>
        );
    }
}

SubCommentList.propTypes = {
    loadingMoreSubComments: PropTypes.bool.isRequired,
    subComments: PropTypes.array.isRequired,
    subCommentCount: PropTypes.number.isRequired,
    commentId: PropTypes.number.isRequired,
    loadingMoreSubCommentsId: PropTypes.number.isRequired,
    sendingCommentReplyId: PropTypes.number.isRequired,
}