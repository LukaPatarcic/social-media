import React, {Fragment} from "react";
import {
    MDBBadge, MDBCol,
    MDBDropdown,
    MDBDropdownItem,
    MDBDropdownMenu,
    MDBDropdownToggle,
    MDBIcon,
    MDBNavItem, MDBRow
} from "mdbreact";
import {isMobile} from "react-device-detect";
import PropTypes from 'prop-types';
import TimeAgo from "react-timeago/lib";

export default class NotificationList extends React.Component{
    constructor(props) {
        super(props);

    }


    render() {
        const {notifications,onAcceptFollowHandler,onDeclineFollowHandler} = this.props;
        return (
            <MDBNavItem>
                <MDBDropdown>
                    <MDBDropdownToggle nav caret>
                        <MDBIcon icon={'bell'} />
                        <MDBBadge color="dark" className="ml-2">{notifications.length}</MDBBadge>
                    </MDBDropdownToggle>
                    <MDBDropdownMenu basic right={!isMobile} onClick={(e) => e.preventDefault()}>
                        <MDBDropdownItem header>Follower Requests ({notifications.length})</MDBDropdownItem>
                        <MDBDropdownItem divider />
                        {notifications.map((notification,index) =>
                            <Fragment key={index}>
                                <MDBDropdownItem onClick={(e) => e.preventDefault()}>
                                    <MDBRow>
                                        <MDBCol col={12}>
                                            <MDBRow>
                                                <MDBCol>
                                                    <MDBRow>
                                                        <MDBCol>
                                                            {notification.firstName} {notification.lastName}&nbsp;
                                                            <span className={'text-muted'}>wants to follow you</span>
                                                        </MDBCol>
                                                        <MDBCol>
                                                            <small className={'grey-text'}>
                                                                <TimeAgo date={notification.createdAt} />
                                                            </small>
                                                            <a
                                                                href={'#'}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    onAcceptFollowHandler(notification.id)
                                                                }}
                                                            >
                                                                <MDBIcon style={{color: 'green'}} icon={'check'}/>
                                                            </a>
                                                            <a
                                                                href={'#'}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    onDeclineFollowHandler(notification.id)
                                                                }}
                                                            >
                                                                <MDBIcon style={{color: 'red'}} icon={'times'}/>
                                                            </a>
                                                        </MDBCol>
                                                    </MDBRow>
                                                </MDBCol>
                                            </MDBRow>
                                        </MDBCol>
                                    </MDBRow>
                                </MDBDropdownItem>
                                <MDBDropdownItem divider />
                            </Fragment>
                        )}
                    </MDBDropdownMenu>
                </MDBDropdown>
            </MDBNavItem>
        )
    }
}

NotificationList.propTypes = {
    notifications: PropTypes.array.isRequired,
    getNotifications: PropTypes.func.isRequired,
    onAcceptFollowHandler: PropTypes.func.isRequired,
    onDeclineFollowHandler: PropTypes.func.isRequired,
}