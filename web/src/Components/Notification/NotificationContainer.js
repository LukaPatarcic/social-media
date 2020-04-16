import React,{Component} from "react";
import toastr from 'toastr/build/toastr.min'
import NotificationList from "./NotificationList";
import {acceptFollowRequest, declineFollowRequest, getFriendRequests} from "../../Api/notification";

export default class NotificationContainer extends Component{
    constructor(props) {
        super(props);
        this.state = {
            notifications: [],
        }

        this.getNotifications = this.getNotifications.bind(this);
        this.acceptFollowHandler = this.acceptFollowHandler.bind(this);
        this.declineFollowHandler = this.declineFollowHandler.bind(this);
    }

    componentDidMount() {
        this.getNotifications();
    }

    getNotifications() {
        getFriendRequests()
            .then(response => {
                this.setState({notifications: response});
            })
            .catch(err => err.response.json().then(err => {
                toastr.error(err.error)
            }))

    }

    acceptFollowHandler(id) {
        this.setState((prevState) => {
            return {
                notifications: prevState.notifications.filter(notification => {
                    if(notification.id !== id) {
                        return notification;
                    }
                })
            }
        })
        acceptFollowRequest(id)
            .then(response => {
            })
            .catch(err => err.response.json().then(err => {
                toastr.error(err.error)
            }))

    }

    declineFollowHandler(id) {
        this.setState((prevState) => {
            return {
                notifications: prevState.notifications.filter(notification => {
                    if(notification.id !== id) {
                        return notification;
                    }
                })
            }
        })
        declineFollowRequest(id)
            .then(response => {
            })
            .catch(err => err.response.json().then(err => {
                toastr.error(err.error)
            }))
    }

    render() {
        return (
            <NotificationList
                {...this.state}
                getNotifications={this.getNotifications}
                onAcceptFollowHandler={this.acceptFollowHandler}
                onDeclineFollowHandler={this.declineFollowHandler}
            />
        )
    }

}