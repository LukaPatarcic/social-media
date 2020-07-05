import React from "react";
import {MDBBadge, MDBBtn, MDBCol, MDBIcon, MDBRow} from "mdbreact";
import {ClipLoader} from "react-spinners";
import {Link} from "react-router-dom";
import PropTypes from 'prop-types';


import 'toastr/build/toastr.min.css'
export default class FriendItem extends React.Component{
    constructor(props) {
        super(props);
    }


    render() {
        const {friend,onSendFriendRequest,loadingSendFriendRequest, loadingSendFriendRequestId} = this.props;

        return (
            <>
                <MDBRow className={'text-left'}>
                    <MDBCol>
                        <MDBBadge color="red" className={'mr-3'}>
                             <MDBIcon className={'text-white'} icon={'user'} />
                        </MDBBadge>
                        <Link className={'text-dark'} to={'/profile/' + friend.profileName} onClick={() => this.props.toggle()}>
                            {friend.firstName} {friend.lastName} ({friend.profileName})
                        </Link>
                        <MDBBtn
                            className={'float-right'}
                            disabled={friend.requested ? true : (friend.following ? true : false)}
                            color={'grey'}
                            size={'sm'}
                            id={friend.id}
                            outline={'true'}
                            onClick={() => onSendFriendRequest(friend.id,true)}>
                            {loadingSendFriendRequestId == friend.id && loadingSendFriendRequest ?
                                <ClipLoader
                                    sizeUnit={"px"}
                                    size={20}
                                    color={'#f00'}
                                    loading={loadingSendFriendRequest}
                                />
                                : (friend.requested ? 'Requested' : (friend.following ? 'Following' : 'Follow'))
                            }
                        </MDBBtn>
                        <div className={'clearfix'}></div>
                    </MDBCol>
                </MDBRow>
                <hr/>
            </>
        )
    }
}

FriendItem.porpTypes = {
    onSendFriendRequest: PropTypes.func.isRequired,
    friend: PropTypes.object.isRequired,
    loadingSendFriendRequest: PropTypes.bool.isRequired,
    loadingSendFriendRequestId: PropTypes.number,
}