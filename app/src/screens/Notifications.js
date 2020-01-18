import React from 'react';
import {View, StyleSheet, ImageBackground, ScrollView, Button, ActivityIndicator,} from 'react-native';
import { Text } from 'native-base';

export default class Notifications extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ImageBackground
                style={{width: '100%', height: '100%',zIndex: -1,resizeMode: 'cover'}}
                source={{uri: 'https://allshak.lukaku.tech/images/background.png'}}>
                <View>
                    <Text>Hello World</Text>
                </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 70,
        alignItems: 'center',
        justifyContent: 'flex-start',
        shadowOffset:{  width: 10,  height: 10,  },
        shadowColor: 'black',
        shadowOpacity: 1.0,
    },
    card: {
        backgroundColor: '#fff',
        margin: 20,
        marginVertical: 10,
        padding: 20
    }
});
