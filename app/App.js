import React from 'react';
import {AuthContext, AuthProvider} from "./src/context/AuthProvider";
import Router from "./src/config/router";
import { configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import PushNotification from 'react-native-push-notification'
import messaging from '@react-native-firebase/messaging'
import firebase from '@react-native-firebase/app'
import {WebsocketProvider} from "./src/context/WebsocketProvider";
import {AsyncStorage, ToastAndroid} from "react-native";
import {BASE_URL} from "./src/config";

const fontConfig = {
    default: {
        regular: {
            fontFamily: 'font',
            fontWeight: 'normal',
        },
        medium: {
            fontFamily: 'font',
            fontWeight: 'normal',
        },
        light: {
            fontFamily: 'font',
            fontWeight: 'normal',
        },
        thin: {
            fontFamily: 'font',
            fontWeight: 'normal',
        },
    },
};

const theme = {
    ...DefaultTheme,
    fonts: configureFonts(fontConfig),
};

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        messaging().registerDeviceForRemoteMessages();
        messaging()
            .getToken()
            .then(token => {
                AsyncStorage.setItem('notification-key',token);
                console.log(token);
            });

        messaging().onMessage(notification => {
            console.log('onMessage')
        });

        messaging().onNotificationOpenedApp(notification => {
            console.log('notification opened app')
        })

        messaging().setBackgroundMessageHandler(message => {
            console.log('messageHandler')
        })

        messaging().getInitialNotification()
            .then(notification => {
                if (notification) {
                    console.log('exited app')
                }
            })

        return messaging().onTokenRefresh(token => {
            AsyncStorage.getItem('access-token',(err,val) => {
                fetch(BASE_URL+'/token/refresh',{
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+val
                    },
                    method: "POST",
                    body: JSON.stringify({token})
                })
            })
                .then(response => response.json())
                .then(data => {
                    AsyncStorage.removeItem('notification-key')
                    AsyncStorage.setItem('notification-key',token);
                })
                .catch(err => {
                    ToastAndroid.show('Oops... Something went wrong!',ToastAndroid.SHORT);
                })
            console.log(token,'refreshToken');
        });


        // messaging().onNotificationOpenedApp(message => {
        //     console.log(message)
        // })

    }

    render() {
        return(
            <AuthProvider>
                <PaperProvider theme={theme}>
                    <Router />
                </PaperProvider>
            </AuthProvider>
        );
    }
}