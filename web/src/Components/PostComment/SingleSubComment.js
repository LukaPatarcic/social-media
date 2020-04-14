import React,{Component} from "react";
import {MDBBadge, MDBCol, MDBIcon, MDBRow, MDBTooltip} from "mdbreact";
import {setProfilePicture} from "../../Helpers";
import TimeAgo from "react-timeago";
import {Link} from "react-router-dom";

export default class SingleSubComment extends Component {
    render() {
        const {comment} = this.props;
        return (
            <MDBRow className={'d-flex align-items-start justify-content-center'}>
                <MDBCol size={1} className={'pr-0'}>
                    <Link to={'/profile/'+comment.profileName}>
                        <img
                            className={'img-fluid pb-2'}
                            src={setProfilePicture(comment.firstName,comment.lastName,30)}
                            alt={''}
                        />
                    </Link>
                </MDBCol>
                <MDBCol size={11} style={{fontSize: 14}} className={'pl-1'}>
                    <MDBRow>
                        <MDBCol size={12}>
                            <div className={'m-0'}>
                                <MDBTooltip>
                                    <Link to={'/profile/'+comment.profileName} className={'text-dark'}>{comment.profileName}</Link>
                                    <div>{comment.firstName + ' ' + comment.lastName}</div>
                                </MDBTooltip>
                                <span className={'text-muted'}> {comment.text}</span>
                            </div>
                            <div className={'m-0'}>
                                <TimeAgo className={'text-muted'} style={{fontSize: 11}} date={comment.createdAt} />
                            </div>
                        </MDBCol>
                    </MDBRow>
                </MDBCol>
            </MDBRow>
        );
    }
}