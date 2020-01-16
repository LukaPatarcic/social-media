import React from "react";
import {
    MDBBadge, MDBBtn,
    MDBDropdown,
    MDBDropdownItem,
    MDBDropdownMenu,
    MDBDropdownToggle,
    MDBIcon,
    MDBNavItem
} from "mdbreact";
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

    componentDidMount() {
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
                    <MDBDropdownMenu className="dropdown-default">
                        {notifications.map((value,index) =>
                            <MDBDropdownItem key={index}>
                                {value.firstName} {value.lastName} want to follow you
                                <MDBBtn size={'sm'} color={'red'} id={value.id} onClick={(e) =>this.acceptFollow(e)}><MDBIcon icon={'check'}/></MDBBtn>
                                <MDBBtn size={'sm'} color={'grey'} id={value.id}><MDBIcon icon={'times'}/></MDBBtn>
                            </MDBDropdownItem>
                        )}

                    </MDBDropdownMenu>
                    }
                </MDBDropdown>
            </MDBNavItem>
        )
    }
}