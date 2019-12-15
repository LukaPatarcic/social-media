import React from 'react';
import {Alert, ImageBackground, ToastAndroid} from 'react-native';
import { NativeRouter, Switch, Route } from "react-router-native";

import Login from "./src/screens/Login";
import Register from "./src/screens/Register";
import Splash from "./src/screens/Splash";
import User from "./src/components/User";
import NetInfo from "@react-native-community/netinfo";


export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            response: {},
        };
    }

    componentDidMount() {
        NetInfo.addEventListener(state => {
            if(state.isConnected) {
                ToastAndroid.show('Connected to Internet',50)
            } else {
                ToastAndroid.show('No Internet Connection',50)
            }
        });

    }

    render() {
        return (
            <NativeRouter>
                <ImageBackground
                    style={{width: '100%', height: '100%', zIndex: -1, resizeMode: 'cover'}}
                    source={{uri: 'https://allshak.lukaku.tech/images/background.png'}}>
                    <Switch>
                        <Route exact path="/" component={Splash}/>
                        <Route exact path="/user" component={User}/>
                        <Route exact path="/register" component={Register}/>
                        <Route exact path="/login" component={Login}/>
                    </Switch>
                </ImageBackground>
            </NativeRouter>
        );
    }
}