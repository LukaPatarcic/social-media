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


export default class Splash extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        setTimeout(() => {
            this.props.history.push('/user')
        },100);
        return (
            <View>
            </View>
        );
    }
}
