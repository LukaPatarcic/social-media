import React from 'react';
import {ImageBackground, StyleSheet, Linking, ScrollView} from "react-native";
import { NativeRouter, Switch, Route } from "react-router-native";

import Login from "./Login";
import Register from "./Register";
import Profile from "./Profile";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

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
                    <ScrollView contentContainerStyle={styles.container}>
                        <Switch>
                            <Route exact path="/" component={Profile} />
                            <Route exact path="/register" component={Register} />
                            <Route exact path="/login" component={Login} />
                        </Switch>
                    </ScrollView>
                </ImageBackground>
            </NativeRouter>
        );
    }
}