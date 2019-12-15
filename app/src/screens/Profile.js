import React from 'react';
import {View, StyleSheet, ImageBackground, Alert,} from 'react-native';
import { Text } from 'native-base';
import AsyncStorage from "@react-native-community/async-storage";
import FacebookLogin from "../components/FacebookLogin";
import { Avatar } from 'react-native-paper';
import {Button} from "react-native-elements";
import { Redirect } from "react-router-native";
import { NativeModules } from "react-native";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            profileName: '',
            redirect: false
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('access-token', (err, val) => {
            if (!val) {
                // this.props.history.push('/login');
            } else {
                this.getUserData(val)
            }
        });
    }

    getUserData(token) {

       fetch('https://api.allshak.lukaku.tech/get/user',{
           headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json',
               'X-AUTH-TOKEN': token
           }
       })
           .then((response => response.json()))
           .then((data => {
               if(data) {
                   this.setState({
                       firstName: data.firstName,
                       lastName: data.lastName,
                       profileName: data.profileName
                   })
               }

           }))
           .catch(err => {

           })
   }

   logout() {
       AsyncStorage.removeItem('access-token')
       NativeModules.DevSettings.reload();
   }

    render() {
        const {firstName,lastName,profileName,redirect} = this.state;
        if(redirect) {
            return (<Redirect to={'/login'}/>);
        }
        return (
            <ImageBackground
                style={{width: '100%', height: '100%',zIndex: -1,resizeMode: 'cover'}}
                source={{uri: 'https://allshak.lukaku.tech/images/background.png'}}>
                <View style={styles.container}>
                    <View style={{backgroundColor: '#fff',paddingHorizontal: 50, alignItems: 'center'}}>
                        <View style={{bottom: 35}}>
                            <Avatar.Image size={150} source={{uri: 'https://i.pinimg.com/originals/53/3c/18/533c18ff0df87fbbdf58b11e0048a199.jpg'}}/>
                        </View>
                        <Text style={{color: '#000', textAlign: 'center', fontSize: 30}}>{firstName + " " + lastName}{"\n"}</Text>
                        <Text style={{color: '#000', textAlign: 'center', fontSize: 30}}>{profileName}</Text>
                        <View style={{marginBottom: 30}}>
                            <FacebookLogin/>
                        </View>
                        <View>
                            <Button
                                title={'Logout'}
                                style={styles.input}
                                color={'#f00'}
                                onPress={this.logout}
                            />
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
