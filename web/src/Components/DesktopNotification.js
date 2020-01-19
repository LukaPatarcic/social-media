import React from "react";
import {
    MDBBadge, MDBBtn, MDBCol,
    MDBDropdown,
    MDBDropdownItem,
    MDBDropdownMenu,
    MDBDropdownToggle,
    MDBIcon,
    MDBNavItem, MDBRow
} from "mdbreact";
import {isMobile} from "react-device-detect";
import cookie from "react-cookies";
import {store} from "react-notifications-component";

export default class DesktopNotification extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            notifications: [],
            loading: false
        }
    }

    getNotifications() {
        this.setState({loading: false});
        fetch('https://api.allshak.lukaku.tech/friend/request',{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN': cookie.load('access-token')
            },
            method: "GET",
        })
            .then((response => response.json()))
            .then((data => {
                this.setState({notifications: data,loading: false});
                this.props.getFriends();
                if(data.error) {
                    this.setState({error: true})
                }
            }))
            .catch(err => {
                this.setState({error: true,loading: false});
            })
    }
    componentDidMount() {
        this.getNotifications();
    }

    acceptFollow(e) {
        let id = e.currentTarget.id;
        fetch('https://api.allshak.lukaku.tech/friend/request',{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN': cookie.load('access-token')
            },
            method: "PATCH",
            body: JSON.stringify({id})
        })
            .then((response => response.json()))
            .then((data => {
                this.setState({loading: false});
                if(data.error) {
                    this.setState({error: true})
                }
                this.getNotifications();
            }))
            .catch(err => {
                this.setState({error: true,loading: false});
            })
        this.getNotifications();

    }

    declineFollow(e) {
        let id = e.currentTarget.id;
        fetch('https://api.allshak.lukaku.tech/friend/request',{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN': cookie.load('access-token')
            },
            method: "DELETE",
            body: JSON.stringify({id})
        })
            .then((response => response.json()))
            .then((data => {
                this.setState({loading: false});
                if(data.error) {
                    this.setState({error: true})
                }
                this.getNotifications();
            }))
            .catch(err => {
                this.setState({error: true,loading: false});
            })
        this.getNotifications();
    }


    render() {
        const {notifications} = this.state;
        return (
            <MDBNavItem>
                <MDBDropdown>
                    <MDBDropdownToggle nav caret>
                        <MDBIcon icon={'bell'} />
                        <MDBBadge color="dark" className="ml-2">{notifications.length}</MDBBadge>
                    </MDBDropdownToggle>
                    {notifications &&
                    <MDBDropdownMenu basic right={!isMobile} onClick={(e) => e.stopPropagation()}>
                        <MDBDropdownItem header>Follower Requests ({notifications.length})</MDBDropdownItem>
                        <MDBDropdownItem divider />
                        {notifications.map((value,index) =>
                            <>
                            <MDBDropdownItem key={index} onClick={(e) => e.preventDefault()}>
                                <MDBRow>
                                    <MDBCol col={8}>
                                        {value.firstName} {value.lastName} want to follow you
                                    </MDBCol>
                                    <MDBCol className={'text-center'}>
                                        <MDBBtn size={'sm'} color={'red'} id={value.id} onClick={(e) =>this.acceptFollow(e)}><MDBIcon icon={'check'}/></MDBBtn>
                                        <MDBBtn size={'sm'} color={'grey'} id={value.id}  onClick={(e) =>this.declineFollow(e)}><MDBIcon icon={'times'}/></MDBBtn>
                                    </MDBCol>
                                </MDBRow>
                            </MDBDropdownItem>
                            <MDBDropdownItem divider />
                            </>
                        )}
                    </MDBDropdownMenu>
                    }
                </MDBDropdown>
            </MDBNavItem>
        )
    }
}