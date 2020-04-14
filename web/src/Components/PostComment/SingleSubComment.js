import React,{Component} from "react";
import {MDBBadge, MDBCol, MDBRow} from "mdbreact";
import {setProfilePicture} from "../../Helpers";
import TimeAgo from "react-timeago";

export default class SingleSubComment extends Component {
    con
    render() {
        const {comment} = this.props;
        return (
            <>
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
                </MDBCol>
            </MDBCol>
            </>
        );
    }
}