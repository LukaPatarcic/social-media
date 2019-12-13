import React from 'react';
import {View, StyleSheet, ImageBackground,} from 'react-native';
import { Text } from 'native-base';
import AsyncStorage from "@react-native-community/async-storage";
import FacebookLogin from "../components/FacebookLogin";
import { Avatar } from 'react-native-paper';

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ImageBackground
                style={{width: '100%', height: '100%',zIndex: -1,resizeMode: 'cover'}}
                source={{uri: 'http://allshak.lukaku.tech/images/background.png'}}>
                <View style={styles.container}>
                    <View style={{backgroundColor: '#fff',paddingHorizontal: 50, alignItems: 'center'}}>
                        <View style={{bottom: 35}}>
                            <Avatar.Image size={150} source={{uri: 'https://i.pinimg.com/originals/53/3c/18/533c18ff0df87fbbdf58b11e0048a199.jpg'}}/>
                        </View>
                        <Text style={{color: '#000', textAlign: 'center', fontSize: 30}}>{'Luka Patarcic'}</Text>
                        <View style={{marginBottom: 30}}>
                            <FacebookLogin/>
                        </View>
                    </View>
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
    }
});
