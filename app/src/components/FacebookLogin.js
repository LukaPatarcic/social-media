import  {LoginButton} from "react-native-fbsdk";
import AsyncStorage from "@react-native-community/async-storage";
import {View} from "react-native";
import FBSDK from 'react-native-fbsdk';
import React from "react";

const { AccessToken } = FBSDK;

export default class FacebookLogin extends React.Component{
    render() {
        return (
            <LoginButton
                publishPermissions={["email"]}
                onLoginFinished={
                    (error, result) => {
                        console.log(result);
                        if (error) {
                            alert("Login failed with error: " + error.message);
                        } else if (result.isCancelled) {
                            alert("Login was cancelled");
                        } else {
                            AccessToken.getCurrentAccessToken()
                                .then((data) => {
                                    AsyncStorage.setItem('facebook-access-token', data.accessToken);
                                })
                                .catch(error => {
                                    alert('Oops something went wrong...');
                                    console.log(error);
                                })
                        }
                    }
                }
                onLogoutFinished={() => {
                    alert("User logged out")
                    AsyncStorage.removeItem('facebook-access-token');
                }}/>
        );
    }
}