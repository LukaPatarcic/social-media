import React from 'react';
import {ImageBackground, StyleSheet, View} from "react-native";
import { NativeRouter, Switch, Route } from "react-router-native";

import Login from "./src/screens/Login";
import Register from "./src/screens/Register";
import Splash from "./src/screens/Splash";
import User from "./src/components/User";


export default class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <NativeRouter>
                <ImageBackground
                    style={{width: '100%', height: '100%',zIndex: -1,resizeMode: 'cover'}}
                    source={{uri: 'http://allshak.lukaku.tech/images/background.png'}}>
                    <Switch>
                        <Route exact path="/" component={Splash} />
                        <Route exact path="/user" component={User} />
                        <Route exact path="/register" component={Register} />
                        <Route exact path="/login" component={Login} />
                    </Switch>
                </ImageBackground>
            </NativeRouter>
        );
    }
}