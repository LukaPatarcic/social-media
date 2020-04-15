import React,{Component} from "react";
import {BASE_URL} from "../../Config";
import cookie from "react-cookies";
import DesktopNotification from "./DesktopNotification";
import {acceptFollowRequest, declineFollowRequest, getFriendRequests} from "../../Api/notification";

export default class NotificationContainer extends Component{
    constructor(props) {
        super(props);
        this.state = {
            notifications: [],
            loading: false
        }

        this.getNotifications = this.getNotifications.bind(this);
        this.acceptFollowHandler = this.acceptFollowHandler.bind(this);
        this.declineFollowHandler = this.declineFollowHandler.bind(this);
    }

    componentDidMount() {
        this.getNotifications();
    }

    getNotifications() {
        this.setState({loading: true});
        getFriendRequests()
            .then(response => {
                console.log(response)
                this.setState({notifications: response,loading: false});
            })
            .catch(err => err.response.json().then(err => {
                this.setState({error: err,loading: false});
            }))

    }

    acceptFollowHandler(e) {
        let id = e.currentTarget.id;
        acceptFollowRequest()
            .then(response => {
                this.setState({loading: false});
                this.getNotifications();
            })
            .catch(err => err.response.json().then(err => {
                this.setState({error: err,loading: false});
            }))

    }

    declineFollowHandler(id) {
        declineFollowRequest(id)
            .then(response => {
                this.setState({loading: false});
                this.getNotifications();
            })
            .catch(err => err.response.json().then(err => {
                this.setState({error: err,loading: false});
            }))
    }

    render() {
        return (
            <DesktopNotification
                {...this.state}
                getNotifications={this.getNotifications}
                onAcceptFollowHandler={this.acceptFollowHandler}
                onDeclineFollowHandler={this.declineFollowHandler}
            />
        )
    }

}