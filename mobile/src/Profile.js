import React from 'react';
import {
    View,
    Button,
    StyleSheet,
    TextInput,
    Image,
    Alert,
    ActivityIndicator,
    ImageBackground,
} from 'react-native';
import { Item, Input, Icon, Card, Content, Text, ListItem, Body } from 'native-base';
import { CheckBox } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";
import { LoginButton } from 'react-native-fbsdk';

const styles = StyleSheet.create({
    input: {
        width: 300,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 10,
    },
});


export default class Profile extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // AsyncStorage.getItem('access-token',(err,val) => {
        //     if(!val) {
        //         this.props.history.push('/login');
        //     }
        // });
    }


    render() {
        return (
            <View>
                <View>
                    <Text style={{color: '#fff'}}>Profile</Text>
                    <LoginButton
                        publishPermissions={["email"]}
                        onLoginFinished={
                            (error, result) => {
                                if (error) {
                                    alert("Login failed with error: " + error.message);
                                } else if (result.isCancelled) {
                                    alert("Login was cancelled");
                                } else {
                                    alert("Login was successful with permissions: " + result.grantedPermissions)
                                }
                            }
                        }
                        onLogoutFinished={() => alert("User logged out")}/>
                </View>
            </View>
        );
    }
}
