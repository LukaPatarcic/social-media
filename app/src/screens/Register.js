import React from 'react';
import {Card, Item, Input} from 'native-base';
import {ActivityIndicator, Button, ScrollView, StyleSheet, Text, TouchableOpacity} from "react-native";

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            profileName: '',
            email: '',
            password: '',
            confirmPassword: '',
            error: '',
            serverError: [],
            loading: ''
        }

    }

    onRegister() {
        const {firstName,lastName,email,profileName,password,confirmPassword,error,loading} = this.state;
        this.setState({loading: true});
        let json = {firstName,lastName,profileName,email,'password' :{'first':password,'second':confirmPassword}};
        fetch('https://api.allshak.lukaku.tech/register', {
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
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={{textAlign: 'center',fontFamily: 'font',fontSize: 40,marginBottom: 20}}>Register</Text>
                    <Item>
                        <Input
                            value={firstName}
                            onChangeText={(firstName) => this.setState({ firstName })}
                            placeholder={'First Name'}
                            style={{fontFamily: 'font'}}
                        />
                    </Item>
                    <Item>
                        <Input
                            value={lastName}
                            onChangeText={(lastName) => this.setState({ lastName })}
                            placeholder={'Last Name'}
                            style={{fontFamily: 'font'}}
                        />
                    </Item>

                    <Item>
                        <Input
                            value={email}
                            onChangeText={(email) => this.setState({ email })}
                            placeholder={'Email'}
                            autoCompleteType={'email'}
                            style={{fontFamily: 'font'}}
                        />
                    </Item>

                    <Item>
                        <Input
                            value={profileName}
                            onChangeText={(profileName) => this.setState({ profileName })}
                            placeholder={'Username'}
                            style={{fontFamily: 'font'}}
                        />
                    </Item>

                    <Item>
                        <Input
                            value={password}
                            onChangeText={(password) => this.setState({ password })}
                            placeholder={'Password'}
                            secureTextEntry={true}
                            style={{fontFamily: 'font'}}
                        />
                    </Item>

                    <Item>
                        <Input
                            value={confirmPassword}
                            onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
                            placeholder={'Confirm Password'}
                            secureTextEntry={true}
                            style={{fontFamily: 'font'}}
                        />
                    </Item>

                    <Text style={{color: 'red',fontFamily: 'font'}}>
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
                        <TouchableOpacity
                        style={styles.btn}
                        onPress={this.onRegister.bind(this)}
                        >
                        <Text style={styles.btnText}>Register</Text>
                        </TouchableOpacity>
                    }
                    <Text style={{marginTop: 20,fontFamily: 'font'}}>Already have an account? <Text style={{color:'red',fontFamily: 'font'}} onPress={() => history.push('/login')}>Log in now!</Text></Text>
                </ScrollView>
            </Card>
        );
    }
}

const styles = StyleSheet.create({
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
