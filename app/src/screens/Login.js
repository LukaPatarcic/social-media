import React from 'react';
import {Button, StyleSheet, ActivityIndicator, View, TouchableOpacity,} from 'react-native';
import { Item, Input, Icon, Card, Content, Text, ListItem, Body } from 'native-base';
import { Checkbox } from 'react-native-paper';
import AsyncStorage from "@react-native-community/async-storage";
import {CheckBox} from "react-native-elements";

export default class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            rememberMe: false,
            error: '',
            token: '',
            loading: false,
        };
    }

    onLogin() {
        const { email, password, error, rememberMe } = this.state;
        if(email === '' || password === '') {
            this.setState({
                error: 'Please enter all fields'
            })
        } else {
            this.setState({loading: true});
            fetch('https://api.allshak.lukaku.tech/login',{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({email,password,rememberMe})
            })
                .then((response => response.json()))
                .then((data => {
                    this.setState({error: data.error,loading: false});
                    if(data.token) {
                        AsyncStorage.setItem('access-token',data.token);
                        this.props.history.push('/user')
                    }
                }))
                .catch(err => {
                    this.setState({error: 'Oops... Something went wrong!',loading: false});
                })
        }

    }

    render() {
        const {error,email,password,token,loading,rememberMe} = this.state;
        const {history} = this.props;
        const colorValue = 'red'
        const color = error === 'Success' ? 'green' : 'red';
        return (
            <View style={styles.container}>
                <Card style={{padding: 50}}>
                    <Text style={{textAlign: 'center',fontSize: 40,marginBottom: 20,fontFamily: "font"}}>Login</Text>
                    <Item>
                        <Icon active name='mail' />
                        <Input
                            value={email}
                            onChangeText={(email) => this.setState({ email })}
                            placeholder={'Email'}
                            autoCompleteType={'email'}
                            style={{fontFamily: "font"}}
                        />
                    </Item>
                    <Item>
                        <Icon active name='lock' />
                        <Input
                            value={password}
                            onChangeText={(password) => this.setState({ password })}
                            placeholder={'Password'}
                            secureTextEntry={true}
                            style={{fontFamily: "font"}}
                        />
                    </Item>
                    <CheckBox
                        checked={!!rememberMe}
                        checkedColor={'#f00'}
                        title={<Text style={{fontFamily: 'font'}}>Remember Me!</Text>}
                        onPress={() => { this.setState({ rememberMe: !rememberMe });}}
                        containerStyle={{backgroundColor: '#fff',borderColor: '#fff'}}
                    />
                    <Text style={{color: color,fontFamily: "font"}}>
                        {error ? error : ''}
                    </Text>

                    {loading
                        ?
                        <ActivityIndicator size="small" color="#f00" />
                        :
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={this.onLogin.bind(this)}
                        >
                            <Text style={styles.btnText}>Login</Text>
                        </TouchableOpacity>
                    }
                    <Text style={{marginTop: 20,fontFamily: "font"}}>Don't have an account? <Text style={{color:'red',fontFamily: "font"}} onPress={() => history.push('/register')}>Register now!</Text></Text>
                </Card>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: 300,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 10,
        fontFamily: "font"
    },
    btn: {
        backgroundColor: '#f00',
        width: 300,
        height: 44,
        padding: 10,
        borderRadius: 2,
        marginBottom: 10,
        fontFamily: "font"
    },
    btnText: {
        fontFamily: 'font',
        textAlign: 'center',
        color: '#fff',
        fontSize: 18
    }
});

