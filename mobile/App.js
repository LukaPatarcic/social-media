/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    Button,
    TouchableHighlight,
    Alert,
    StatusBar,
} from 'react-native';
import BootstrapStyleSheet from 'react-native-bootstrap-styles';


const bootstrapStyleSheet = new BootstrapStyleSheet();
const s = bootstrapStyleSheet.create();
const c = bootstrapStyleSheet.constants;

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: ''
        }

    }


    componentDidMount() {
        fetch('http://electrowallet.lukaku.tech/test')
            .then(response => response.json())
            .then(data => {
                this.setState({message: data.message})
            })
            .catch(err => {
                this.setState({message: "Error"})
            })
    }

    onPress() {
        Alert.alert('Hello World','Hello World');
    }

    render() {
        return (
            <View style={[s.body]}>
                <TouchableHighlight onPress={this.onPress} style={[s.btnTouchable]}>
                    <View style={[s.btn, s.btnPrimary]}>
                        <Text style={[s.btnText, s.btnTextPrimary]}>Signup</Text>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }

}

