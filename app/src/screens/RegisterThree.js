import React from "react";
import {ActivityIndicator, ImageBackground, Text, TouchableOpacity, View} from "react-native";
import {Card, HelperText, TextInput, Title} from "react-native-paper";
import {styles} from "../style/Registration";
import {BASE_URL} from "../config";

export default class RegisterThree extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            password: '',
            errorPassword: false,
            errorPasswordMessage: '',
            confirmPassword: '',
            errorConfirmPassword: false,
            errorConfirmPasswordMessage: '',
            error: '',
            loading: false
        }

        this.passwordRef = React.createRef();
        this.confirmPasswordRef = React.createRef();
        this.onRegister = this.onRegister.bind(this);
    }

    onRegister() {
        const {password,confirmPassword,error,loading} = this.state;
        this.setState({errorPassword: false, errorPasswordMessage: '', errorConfirmPassword: false, errorConfirmPasswordMessage: '',error: false});
        if(password.trim().length < 1) {
            this.setState({errorPassword: true, errorPasswordMessage: 'Please enter a password'});
            return;
        }

        if(password !== confirmPassword) {
            this.setState({errorConfirmPassword: true, errorConfirmPasswordMessage: 'Passwords do not match'});
            return;
        }

        this.setState({loading: true});
        const {account,name} = this.props.route.params;
        let json = {
            'firstName':name.firstName,
            'lastName': name.lastName,
            'profileName': account.profileName,
            'email': account.email,
            'password' :{
                'first':password,
                'second':confirmPassword
            }};
        fetch(BASE_URL+'/register', {
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
                        error: data.error[0],
                        loading: false
                    })

                } else if (data.success) {
                    this.setState({
                        successMessage: 'A verification email has been sent to your email address',
                        password: '',
                        confirmPassword: '',
                        error: [],
                        loading: false
                    })
                }
            })
            .catch(error => {
                this.setState({
                    error: ['Oops something went wrong try again later...'],
                    loading: false
                })
            })
    }

    render() {
        console.log(this.props.route.params);
        const {successMessage,error} = this.state;
        return (
            <ImageBackground
                style={{width: '100%', height: '100%'}}
                source={require('../../assets/images/background-01.png')}
            >
                <View style={{flex: 1,alignContent: 'center',justifyContent: 'center'}}>
                    <Card style={{marginHorizontal: 10}}>
                        <Card.Content>
                            <Title style={{textAlign: 'center',fontFamily: 'font',fontSize: 30,marginBottom: 20,paddingTop: 20}}>Register</Title>

                            <TextInput
                                ref={this.passwordRef}
                                selectionColor={'red'}
                                underlineColor={'red'}
                                error={this.state.errorPassword}
                                theme={{ colors: { primary: 'red',underlineColor:'transparent'}}}
                                secureTextEntry={true}
                                blurOnSubmit={false}
                                mode={'outlined'}
                                label='Password'
                                value={this.state.password}
                                style={{fontSize: 20}}
                                returnKeyType={'send'}
                                onSubmitEditing={() =>  this.confirmPasswordRef.current.focus()}
                                onChangeText={password => this.setState({ password })}
                            />
                            <HelperText
                                type="error"
                                visible={this.state.errorPassword}
                            >
                                {this.state.errorPasswordMessage}
                            </HelperText>

                            <TextInput
                                ref={this.confirmPasswordRef}
                                selectionColor={'red'}
                                underlineColor={'red'}
                                error={this.state.errorConfirmPassword}
                                theme={{ colors: { primary: 'red',underlineColor:'transparent'}}}
                                secureTextEntry={true}
                                blurOnSubmit={false}
                                mode={'outlined'}
                                label='Confirm Password'
                                value={this.state.confirmPassword}
                                style={{fontSize: 20}}
                                returnKeyType={'send'}
                                onSubmitEditing={this.onRegister}
                                onChangeText={confirmPassword => this.setState({ confirmPassword })}
                            />
                            <HelperText
                                type="error"
                                visible={this.state.errorConfirmPassword}
                            >
                                {this.state.errorConfirmPasswordMessage}
                            </HelperText>

                            {error || successMessage ?
                                <View style={{
                                    position: 'relative',
                                    paddingHorizontal: 20,
                                    paddingVertical: 10,
                                    marginBottom: 10,
                                    borderWidth: 1,
                                    borderRadius: 2,
                                    color: successMessage ? '#155724' : '#721c24',
                                    textAlign: 'center',
                                    backgroundColor: successMessage ? '#d4edda' : '#f8d7da',
                                    borderColor: successMessage ? '#c3e6cb' : '#f5c6cb'}}
                                >
                                    <Text style={{textAlign: 'center',fontFamily: 'font'}}>{successMessage ? successMessage : error}</Text>
                                </View>
                                : null
                            }

                            <TouchableOpacity
                                style={styles.btn}
                                activeOpacity={0.76}
                                onPress={this.onRegister}
                            >
                                {
                                    this.state.loading
                                        ?
                                        <ActivityIndicator size="small" color="#fff" />
                                        :
                                        <Text style={styles.btnText}>Register</Text>
                                }
                            </TouchableOpacity>
                            <Text style={{marginTop: 20,fontFamily: "font",textAlign: 'center'}}>Already have an account? <Text style={{color:'red',fontFamily: "font"}} onPress={() => this.props.navigation.navigate('Login')}>Login now!</Text></Text>
                        </Card.Content>
                    </Card>
                </View>
            </ImageBackground>
        );
    }
}