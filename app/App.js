import React from 'react';
import {AuthProvider} from "./src/context/AuthProvider";
import Router from "./src/config/router";
import { configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import PushNotification from 'react-native-push-notification'
import messaging from '@react-native-firebase/messaging'
import firebase from '@react-native-firebase/app'
import {WebsocketProvider} from "./src/context/WebsocketProvider";

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


        // messaging().onNotificationOpenedApp(message => {
        //     console.log(message)
        // })

    }

    render() {
        return(
            <AuthProvider>
                <WebsocketProvider>
                    <PaperProvider theme={theme}>
                        <Router />
                    </PaperProvider>
                </WebsocketProvider>
            </AuthProvider>
        );
    }
}