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
import PropTypes from 'prop-types';
import {ClipLoader} from "react-spinners";

export default class DesktopNotification extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            notifications: [{
                id: 1,
                title: 'some title', // not required
                message: 'The notification text',
                new: false, // if the user has read the notification
                tags: [{ // not required
                    type: 'success',
                    text: 'text'
                }],
                date: '09/12/2016' // not required
            }]
        };
    }


    render() {
        const {notifications,loading,onAcceptFollowHandler,onDeclineFollowHandler} = this.props;
        return (
            <MDBNavItem>
                {notifications &&
                <MDBDropdown>
                    <MDBDropdownToggle nav caret>
                        <MDBIcon icon={'bell'} />
                        <MDBBadge color="dark" className="ml-2">{notifications.length}</MDBBadge>
                    </MDBDropdownToggle>
                    <MDBDropdownMenu basic right={!isMobile} onClick={(e) => e.stopPropagation()}>
                        <MDBDropdownItem header>Follower Requests ({notifications.length})</MDBDropdownItem>
                        <MDBDropdownItem divider />
                        {notifications.map((notification,index) =>
                            <>
                            <MDBDropdownItem key={index} onClick={(e) => e.preventDefault()}>
                                <MDBRow>
                                    <MDBCol col={8}>
                                        {notification.firstName} {notification.lastName} wants to follow you
                                    </MDBCol>
                                    <MDBCol className={'text-center'}>
                                        <MDBBtn
                                            size={'sm'}
                                            color={'red'}
                                            onClick={() => onAcceptFollowHandler(notification.id)}
                                        >
                                            {loading ?
                                                <ClipLoader
                                                    sizeUnit={"px"}
                                                    size={20}
                                                    color={'#fff'}
                                                    loading={loading}
                                                />
                                                :
                                                <MDBIcon icon={'check'}/>
                                            }
                                        </MDBBtn>
                                        <MDBBtn
                                            size={'sm'}
                                            color={'grey'}
                                            onClick={() => onDeclineFollowHandler(notification.id)}
                                        >
                                            <MDBIcon icon={'times'}/>
                                        </MDBBtn>
                                    </MDBCol>
                                </MDBRow>
                            </MDBDropdownItem>
                            <MDBDropdownItem divider />
                            </>
                        )}
                    </MDBDropdownMenu>
                </MDBDropdown>
                }
            </MDBNavItem>
        )
    }
}

DesktopNotification.propTypes = {
    loading: PropTypes.bool.isRequired,
    notifications: PropTypes.array.isRequired,
    getNotifications: PropTypes.func.isRequired,
    onAcceptFollowHandler: PropTypes.func.isRequired,
    onDeclineFollowHandler: PropTypes.func.isRequired,
}