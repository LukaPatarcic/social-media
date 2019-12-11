import React from 'react';
import {
    Text,
    View,
    Button,
    StyleSheet,
    TextInput,
    Image,
    Alert,
    ActivityIndicator,
    ImageBackground,
} from 'react-native';
import { Item, Input, Icon, Card, Content } from 'native-base';
import AsyncStorage from "@react-native-community/async-storage";

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


export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            error: '',
            token: '',
            loading: false,
        };
    }

    onLogin() {
        const { email, password, error } = this.state;
        if(email === '' || password === '') {
            this.setState({
                error: 'Please enter all fields'
            })
        } else {
            this.setState({loading: true});
            fetch('http://api.allshak.lukaku.tech/login',{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({email,password,"rememberMe":false})
            })
                .then((response => response.json()))
                .then((data => {
                    this.setState({error: data.error,loading: false});
                    if(data.token) {
                        AsyncStorage.setItem('access-token',data.token);
                        this.setState({error: 'Success'})
                    }
                }))
        }

    }

    render() {
        const {error,email,password,token,loading} = this.state;
        const {history} = this.props;
        const color = error === 'Success' ? 'green' : 'red';
        return (
            <Card style={{padding: 50}}>
                <Text style={{textAlign: 'center',fontWeight: 'bold',fontSize: 40,marginBottom: 20}}>Login</Text>
                <Item>
                    <Icon active name='mail' />
                    <Input
                        value={email}
                        onChangeText={(email) => this.setState({ email })}
                        placeholder={'Email'}
                        autoCompleteType={'email'}
                    />
                </Item>
                <Item>
                    <Icon active name='lock' />
                    <Input
                        value={password}
                        onChangeText={(password) => this.setState({ password })}
                        placeholder={'Password'}
                        secureTextEntry={true}
                    />
                </Item>

                <Text style={{color: color}}>
                    {error ? error : ''}
                </Text>

                {loading
                    ?
                    <ActivityIndicator size="small" color="#f00" />
                    :
                    <Button
                        title={'Login'}
                        style={styles.input}
                        color={'#f00'}
                        onPress={this.onLogin.bind(this)}
                    />
                }
                <Text style={{marginTop: 20}}>Don't have an account? <Text style={{color:'red',fontWeight: 'bold'}} onPress={() => history.push('/register')}>Register now!</Text></Text>
            </Card>
        );
    }
}
