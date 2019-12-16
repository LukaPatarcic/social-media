import React from 'react';
import { BottomNavigation } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import Feed from "../screens/Feed";
import Profile from "../screens/Profile";
import Search from "../screens/Search";
import Stats from "../screens/Stats";

export default class Router extends React.Component {
    state = {
        index: 1,
        routes: [
            { key: 'feed', icon: 'home', color: '#ff101f' },
            { key: 'search', icon: 'magnify', color: '#ff101f' },
            { key: 'stats', icon: 'chart-line', color: '#ff101f' },
            { key: 'profile', icon: 'account', color: '#ff101f' },
        ],
    };

    _handleIndexChange = index => this.setState({ index });

    _renderScene = BottomNavigation.SceneMap({
        feed: Feed,
        search: Search,
        stats: Stats,
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