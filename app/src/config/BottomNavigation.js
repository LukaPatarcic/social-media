import React from 'react';
import Feed from "../screens/Feed";
import Profile from "../screens/Profile";
import {ImageBackground} from "react-native";
import {TabNavigator} from 'react-navigation';

const Tab = TabNavigator();

export default class BottomNavigation extends React.Component {

    constructor(props) {
        super(props);
    }
    render() {
        return Tab;
    }
}