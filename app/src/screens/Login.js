import React, { useContext } from 'react';
import {
    StyleSheet,
    ActivityIndicator,
    View,
    TouchableOpacity,
    ImageBackground, ScrollView,
} from 'react-native';
import {Card, HelperText, Paragraph, Snackbar, Text, TextInput, Title} from 'react-native-paper'
import AsyncStorage from "@react-native-community/async-storage";
import {BASE_URL} from "../config";
import {AuthContext} from "../context/AuthProvider";

export default class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            error: '',
            errorEmail: false,
            errorEmailMessage: '',
            errorPassword: false,
            errorPasswordMessage: '',
            token: false,
            notificationKey: '',
            loading: false,
            visible: false
        };
        AsyncStorage.getItem('notification-key', (err,val) => {
            this.setState({notificationKey:val})
        });

        this.emailRef = React.createRef();
        this.passwordRef = React.createRef();

    }

    onLogin() {
        const { email, password, error, notificationKey, errorPassword, errorEmail } = this.state;
        this.setState({errorEmail: false,errorPassword: false,errorPasswordMessage: '',errorEmailMessage: '',error: ''});
        let formHasError = false;

        if(password.trim() === '') {
            this.setState({
                errorPassword: password.trim().length < 1,
                errorPasswordMessage: 'Please enter password field'
            });
            formHasError = true;
        }
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(email) === false){
            this.setState({
                errorEmail: true,
                errorEmailMessage: 'Email address is invalid'
            });
            formHasError = true;
        }

        if(formHasError) {
            return;
        }

        this.setState({loading: true});
        fetch(BASE_URL+'/login',{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({email,password,notificationKey})
        })
            .then((response => response.json()))
            .then((data => {
                this.setState({error: data.error,loading: false});
                if(data.token) {
                    AsyncStorage.setItem('access-token',data.token);
                    AsyncStorage.setItem("id",data.user.id.toString())
                    this.context.setIsAuth();
                }
                if(data.error === 'Invalid password') {
                    this.passwordRef.current.focus();
                } else {
                    this.emailRef.current.focus();
                }
            }))
            .catch(err => {
                this.setState({error: 'Oops... Something went wrong!',loading: false});
            })

    }

    static contextType = AuthContext;

    render() {
        const {error,email,password,loading,focusPasswordInput,errorPassword,errorEmail,errorEmailMessage,errorPasswordMessage} = this.state;
        return (
            <ImageBackground
                style={{width: '100%', height: '100%'}}
                source={require('../../assets/images/background-01.png')}
            >

                <ScrollView scrollEnabled={true} contentContainerStyle={{flex: 1,alignContent: 'center',justifyContent: 'center'}}>
                    <Card style={{marginHorizontal: 10}}>
                        <Card.Content>
                            <Title style={{textAlign: 'center',fontFamily: 'font',fontSize: 30,marginBottom: 20,paddingTop: 20}}>Login</Title>
                            <TextInput
                                ref={this.emailRef}
                                mode={'outlined'}
                                label='Email'
                                error={errorEmail}
                                value={email}
                                selectionColor={'red'}
                                underlineColor={'red'}
                                theme={{ fonts: {font: 'font'}, colors: { primary: 'red',underlineColor:'transparent',}}}
                                autoCompleteType={'email'}
                                keyboardType={'email-address'}
                                onSubmitEditing={() =>  this.passwordRef.current.focus()}
                                autoCapitalize={'none'}
                                returnKeyType={'next'}
                                blurOnSubmit={false}
                                style={{fontSize: 20}}
                                onChangeText={email => this.setState({ email })}
                            />
                            <HelperText
                                type="error"
                                visible={errorEmail}
                            >
                                {errorEmailMessage}
                            </HelperText>

                            <TextInput
                                ref={this.passwordRef}
                                selectionColor={'red'}
                                underlineColor={'red'}
                                error={errorPassword}
                                theme={{ colors: { primary: 'red',underlineColor:'transparent'}}}
                                secureTextEntry={true}
                                blurOnSubmit={false}
                                mode={'outlined'}
                                focus={focusPasswordInput}
                                label='Password'
                                value={password}
                                style={{fontSize: 20}}
                                returnKeyType={'send'}
                                onSubmitEditing={() =>  this.onLogin()}
                                onChangeText={password => this.setState({ password })}
                            />
                            <HelperText
                                type="error"
                                visible={errorPassword}
                            >
                                {errorPasswordMessage}
                            </HelperText>

                            {error ?
                                <View style={{
                                    position: 'relative',
                                    paddingHorizontal: 20,
                                    paddingVertical: 10,
                                    marginBottom: 10,
                                    borderWidth: 1,
                                    borderRadius: 2,
                                    color: '#721c24',
                                    textAlign: 'center',
                                    backgroundColor: '#f8d7da',
                                    borderColor: '#f5c6cb'}}
                                >
                                    <Text style={{textAlign: 'center',fontFamily: 'font'}}>{error}</Text>
                                </View>
                                : null
                            }

                                <TouchableOpacity
                                    style={styles.btn}
                                    activeOpacity={0.76}
                                    onPress={this.onLogin.bind(this)}
                                >
                                    {
                                        loading
                                        ?
                                        <ActivityIndicator size="small" color="#fff" />
                                        :
                                        <Text style={styles.btnText}>Login</Text>
                                    }
                                </TouchableOpacity>
                            <Text style={{marginTop: 20,fontFamily: "font",textAlign: 'center'}}>Don't have an account? <Text style={{color:'red',fontFamily: "font"}} onPress={() => this.props.navigation.navigate('Register')}>Register now!</Text></Text>
                        </Card.Content>
                    </Card>
                </ScrollView>

            </ImageBackground>
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
        height: 44,
        padding: 10,
        borderRadius: 2,
        marginTop: 35,
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

