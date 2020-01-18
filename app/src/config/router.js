import React from 'react';
import { BottomNavigation } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import Feed from "../screens/Feed";
import Profile from "../screens/Profile";
import Search from "../screens/Search";
import Stats from "../screens/Stats";
import Notifications from "../screens/Notifications";
import AsyncStorage from "@react-native-community/async-storage";

export default class Router extends React.Component {

    constructor(props) {
        super(props);
        this.getNotifications();
        this.state = {
            index: 1,
            routes: [
                { key: 'feed', icon: 'home', color: '#ff101f' },
                { key: 'search', icon: 'magnify', color: '#ff101f' },
                { key: 'stats', icon: 'chart-line', color: '#ff101f' },
                { key: 'notifications', icon: 'bell', color: '#ff101f' },
                { key: 'profile', icon: 'account', color: '#ff101f' },
            ],
            notification: 0
        };
    }


    getNotifications() {
        AsyncStorage.getItem('access-token', (err, val) => {
            if (!val) {
                // this.props.history.push('/login');
            } else {
                this.setState({loading: false});
                fetch('https://api.allshak.lukaku.tech/friend/request',{
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-AUTH-TOKEN': val
                    },
                    method: "GET",
                })
                    .then((response => response.json()))
                    .then((data => {
                        const icon = data.length ? "bell" : 'bell-off';
                        this.setState({
                            index: 1,
                            routes: [
                                { key: 'feed', icon: 'home', color: '#ff101f' },
                                { key: 'search', icon: 'magnify', color: '#ff101f' },
                                { key: 'stats', icon: 'chart-line', color: '#ff101f' },
                                { key: 'notifications', icon: icon, color: '#ff101f' },
                                { key: 'profile', icon: 'account', color: '#ff101f' },
                            ]
                        })
                    }))
            }
        });
    }

    _handleIndexChange = index => this.setState({ index });

    _renderScene = BottomNavigation.SceneMap({
        feed: Feed,
        search: Search,
        stats: Stats,
        notifications: Notifications,
        profile: Profile,
    });

    render() {
        return (
            <BottomNavigation
                navigationState={this.state}
                onIndexChange={this._handleIndexChange}
                renderScene={this._renderScene}
            />
        );
    }
}