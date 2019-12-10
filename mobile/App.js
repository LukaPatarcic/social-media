import React from 'react';
import {Text, View, Button, StyleSheet, Alert, TextInput, Image, AsyncStorage} from 'react-native';
import BootstrapStyleSheet from 'react-native-bootstrap-styles';

const bootstrapStyleSheet = new BootstrapStyleSheet();
const s = bootstrapStyleSheet.create();
const c = bootstrapStyleSheet.constants;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
    },
    input: {
        width: 200,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 10,
    },
});


export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            error: '',
            token: '',
        };
    }

    onLogin() {
        const { email, password, error } = this.state;
        if(email === '' || password === '') {
            this.setState({
                error: 'Please enter all fields'
            })
        } else {
            fetch('http://api.allshak.lukaku.tech/login',{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({email,password})
            })
                .then((response => response.json()))
                .then((data => {
                    this.setState({error: data.error});
                    if(data.token) {
                        this.setState({error: 'Success',token: data.token})
                    }
                }))
        }

    }

    render() {
        const {error,email,password,token} = this.state;
        const color = error === 'Success' ? 'green' : 'red';
        return (
            <View style={styles.container}>
                <Image
                    style={{width: '100%', height: 100, margin: 30}}
                    source={{uri: 'http://allshak.lukaku.tech/images/logo.png'}}
                />
                <TextInput
                    value={email}
                    onChangeText={(email) => this.setState({ email })}
                    placeholder={'Email'}
                    style={styles.input}
                />
                <TextInput
                    value={password}
                    onChangeText={(password) => this.setState({ password })}
                    placeholder={'Password'}
                    secureTextEntry={true}
                    style={styles.input}
                />
                <Text style={{color: color}}>
                    {error ? error : ''}
                </Text>

                <Button
                    title={'Login'}
                    style={styles.input}
                    onPress={this.onLogin.bind(this)}
                />
                <Text style={{marginTop: 20, textAlign: 'center'}}>{error === 'Success' ? token : ''}</Text>
            </View>
        );
    }
}
