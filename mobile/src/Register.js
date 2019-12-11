import React from 'react';
import {Card, Content, CardItem, Body, Form, Item, Input, Label, Icon} from 'native-base';
import {ActivityIndicator, Button, StyleSheet, Text} from "react-native";

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

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: 'Luka',
            lastName: 'Patarcic',
            profileName: 'Khallion',
            email: 'patarcic98@gmail.com',
            password: 'punopetica98',
            confirmPassword: 'punopetica98',
            error: '',
            serverError: [],
            loading: ''
        }

    }

    onRegister() {
        const {firstName,lastName,email,profileName,password,confirmPassword,error,loading} = this.state;
        this.setState({loading: true});
        let json = {firstName,lastName,profileName,email,'password' :{'first':password,'second':confirmPassword}};
        fetch('http://api.allshak.lukaku.tech/register', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(json)
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    this.setState({
                        serverError: data.error,
                        loading: false
                    })

                } else if (data.success) {
                    this.setState({
                        successMessage: 'A verification email has been sent to your account',
                        firstName: '',
                        lastName: '',
                        profileName: '',
                        email: '',
                        password: '',
                        confirmPassword: '',
                        serverError: [],
                        loading: false
                    })
                }
            })
            .catch(error => {
                this.setState({
                    serverError: ['Oops something went wrong try again later...'],
                    loading: false
                })
            })
    }

    render() {
        const {history} = this.props;
        const {firstName,lastName,email,profileName,password,confirmPassword,error,loading,serverError} = this.state;
        return (
            <Card style={{padding: 50}}>
                <Text style={{textAlign: 'center',fontWeight: 'bold',fontSize: 40,marginBottom: 20}}>Register</Text>
                <Item>
                    <Icon active name='' />
                    <Input
                        value={firstName}
                        onChangeText={(firstName) => this.setState({ firstName })}
                        placeholder={'First Name'}
                    />
                </Item>
                <Item>
                    <Icon active name='' />
                    <Input
                        value={lastName}
                        onChangeText={(lastName) => this.setState({ lastName })}
                        placeholder={'Last Name'}
                    />
                </Item>

                <Item>
                    <Icon active name='' />
                    <Input
                        value={email}
                        onChangeText={(email) => this.setState({ email })}
                        placeholder={'Email'}
                    />
                </Item>

                <Item>
                    <Icon active name='' />
                    <Input
                        value={profileName}
                        onChangeText={(profileName) => this.setState({ profileName })}
                        placeholder={'Username'}
                    />
                </Item>

                <Item>
                    <Icon active name='' />
                    <Input
                        value={password}
                        onChangeText={(password) => this.setState({ password })}
                        placeholder={'Password'}
                    />
                </Item>

                <Item>
                    <Icon active name='' />
                    <Input
                        value={confirmPassword}
                        onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
                        placeholder={'Confirm Password'}
                    />
                </Item>

                <Text style={{color: 'red'}}>
                    {error ? error : ''}
                    {serverError.length > 0
                        ?
                        serverError.map(err => err)
                        :
                        ""
                    }
                </Text>

                {loading
                    ?
                    <ActivityIndicator size="small" color="#f00" />
                    :
                    <Button
                        title={'Register'}
                        style={styles.input}
                        color={'#f00'}
                        onPress={this.onRegister.bind(this)}
                    />
                }
                <Text style={{marginTop: 20}}>Already have an account? <Text style={{color:'red',fontWeight: 'bold'}} onPress={() => history.push('/')}>Log in now!</Text></Text>
            </Card>
        );
    }
}
