import React from "react";
import {MDBBadge, MDBBtn, MDBCol, MDBIcon, MDBRow} from "mdbreact";
import cookie from "react-cookies";
import {ClipLoader} from "react-spinners";
import ReactNotification from 'react-notifications-component'
import { store } from 'react-notifications-component';
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
        fetch('https://api.allshak.lukaku.tech/friend/request',{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN': cookie.load('access-token')
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
                    store.addNotification({
                        title: "Hold up!",
                        message: "Friend request already sent!",
                        type: "danger",
                        insert: "bottom",
                        container: "bottom-right",
                        animationIn: ["animated", "fadeIn"],
                        animationOut: ["animated", "fadeOut"],
                        dismiss: {
                            duration: 5000,
                            onScreen: true
                        }
                    });
                }
            }))
            .catch(err => {
                this.setState({error: true,loading: false});
                store.addNotification({
                    title: "Hold up!",
                    message: "Friend request already sent!",
                    type: "danger",
                    insert: "bottom",
                    container: "bottom-right",
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeOut"],
                    dismiss: {
                        duration: 5000,
                        onScreen: true
                    }
                });
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
                        {friend.firstName} {friend.lastName} ({friend.profileName})
                        <MDBBtn
                            className={'float-right'}
                            disabled={friend.requested ? true : (friend.following ? true : false)}
                            color={'grey'}
                            size={'sm'}
                            id={friend.id}
                            outline={'true'}
                            onClick={(e) =>{
                                this.sendFriendRequest(e)
                            }}>
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
                {/*{error && <ReactNotification />}*/}
            </>
        )
    }
}