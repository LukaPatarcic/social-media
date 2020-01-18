import React from 'react';
import {Alert, ImageBackground, PushNotificationIOSStatic as PushNotificationIOS, ToastAndroid} from 'react-native';
import { NativeRouter, Switch, Route } from "react-router-native";
import AsyncStorage from "@react-native-community/async-storage";

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
        // NetInfo.addEventListener(state => {
        //     if(state.isConnected) {
        //         ToastAndroid.show('Connected to Internet',50)
        //     } else {
        //         ToastAndroid.show('No Internet Connection',50)
        //     }
        // });
        var PushNotification = require("react-native-push-notification");

        PushNotification.configure({
            // (optional) Called when Token is generated (iOS and Android)
            largeIcon: 'notification_icon',
            smallIcon: 'notification_icon',
            icon: 'notification_icon',
            actions: '["Yes", "No"]',
            color: '#ff0000',
            onRegister: function(token) {
                console.log("TOKEN:", token.token);
                AsyncStorage.setItem('notification-key',token.token)
            },

            // (required) Called when a remote or local notification is opened or received
            onNotification: function(notification) {
                console.log("NOTIFICATION:", notification);
            },

            // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
            senderID: "292960777305",

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