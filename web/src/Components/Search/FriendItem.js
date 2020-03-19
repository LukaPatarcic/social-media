import React from "react";
import {MDBBadge, MDBBtn, MDBCol, MDBIcon, MDBRow} from "mdbreact";
import cookie from "react-cookies";
import {ClipLoader} from "react-spinners";
import { store } from 'react-notifications-component';
import {Link} from "react-router-dom";
import {BASE_URL} from "../../Config";
import toastr from 'toastr/build/toastr.min'

import 'toastr/build/toastr.min.css'
export default class FriendItem extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            btnText: 'Follow',
            error: false,
            requested: false
        }

    }

    sendFriendRequest(e) {
        this.setState({loading: true});
        fetch(BASE_URL+'/friend/request',{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + cookie.load('access-token')
            },
            method: "POST",
            body: JSON.stringify({id: e.currentTarget.id})
        })
            .then((response => response.json()))
            .then((data => {
                this.setState({loading: false});
                this.props.getFriends();
                if(data.error) {
                    this.setState({error: true})
                    toastr.info('Friend request already sent!');
                }
            }))
            .catch(err => {
                this.setState({error: true,loading: false});
                toastr.info('Friend request already sent!');
            })
    }

    render() {
        const {friend} = this.props;
        const {loading,error} = this.state;

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
                            onClick={this.sendFriendRequest.bind(this)}>
                            {loading ?
                                <ClipLoader
                                    sizeUnit={"px"}
                                    size={20}
                                    color={'#f00'}
                                    loading={loading}
                                />
                                :
                                (friend.requested ? 'Requested' : (friend.following ? 'Following' : 'Follow'))
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