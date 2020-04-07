import React from "react";
import {ActivityIndicator, ImageBackground, Text, TouchableOpacity, View, Button} from "react-native";
import {Card, HelperText, TextInput, Title} from "react-native-paper";
import {styles} from "../style/Registration";
import {BASE_URL} from "../config";

export default class RegisterTwo extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            profileName: '',
            errorProfileName: false,
            errorProfileNameMessage: '',
            email: '',
            errorEmail: false,
            errorEmailMessage: '',
            error: false,
            loading: false
        }

        this.profileNameRef = React.createRef();
        this.emailRef = React.createRef();
        this.onNextPress = this.onNextPress.bind(this);
        this.checkWithBackend = this.checkWithBackend.bind(this);

    }

    checkWithBackend() {
    }

    onNextPress() {
        const {profileName,email} = this.state;
        this.setState({errorProfileName: false, errorProfileNameMessage: '', errorEmail: false, errorEmailMessage: '',error: false});
        let error = false;

        if(profileName.trim().length < 1) {
            this.setState({errorProfileName: true, errorProfileNameMessage: 'Please enter a username'});
            return;
        }

        if(profileName.trim().length < 1) {
            this.setState({errorEmail: true, errorEmailMessage: 'Please enter an email address'})
            return;
        }

        if(profileName.trim().length > 255 || profileName.trim() < 2) {
            this.setState({errorProfileName: true, errorProfileNameMessage: 'Username has to be between 2 and 20 characters'});
            error = true;
        }

        const expressionProfileName = /^[a-z0-9]+$/i;
        if(!expressionProfileName.test(String(profileName))) {
            this.setState({errorProfileName: true, errorProfileNameMessage: 'Username can only have numbers and letters'})
            error = true;
        }

        const expressionEmail = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        if(!expressionEmail.test(String(email).toLowerCase())) {
            this.setState({errorEmail: true, errorEmailMessage: 'Not a valid email address'})
            error = true;
        }

        if(error) {
            return;
        }

        this.setState({loading: true});
        fetch(BASE_URL+'/verify/user',{
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: "POST",
            body: JSON.stringify({profileName,email,secret:'app'})
        })
            .then(response => response.json())
            .then(data => {
                if(data.profileName) {
                    this.setState({errorProfileName: true, errorProfileNameMessage: 'Username already taken',error: true});
                }
                if(data.email) {
                    this.setState({errorEmail: true, errorEmailMessage: 'Email already taken',error: true});
                }
            })
            .finally(() => {
                this.setState({loading: false});
                if(!this.state.error) {
                    const name = this.props.route.params.name;
                    const account = {profileName,email};
                    this.props.navigation.navigate('RegisterThree',{name,account})
                }
            })
    }
    render() {
        console.log(this.props.route.params);
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
                                ref={this.profileNameRef}
                                mode={'outlined'}
                                label='Username'
                                error={this.state.errorProfileName}
                                value={this.state.profileName}
                                selectionColor={'red'}
                                underlineColor={'red'}
                                theme={{ fonts: {font: 'font'}, colors: { primary: 'red',underlineColor:'transparent',}}}
                                onSubmitEditing={() =>  this.emailRef.current.focus()}
                                autoCapitalize={'none'}
                                returnKeyType={'next'}
                                blurOnSubmit={false}
                                style={{fontSize: 20}}
                                onChangeText={profileName => this.setState({ profileName })}
                            />
                            <HelperText
                                type="error"
                                visible={this.state.errorProfileName}
                            >
                                {this.state.errorProfileNameMessage}
                            </HelperText>

                            <TextInput
                                ref={this.emailRef}
                                mode={'outlined'}
                                label='Email'
                                error={this.state.errorEmail}
                                value={this.state.email}
                                selectionColor={'red'}
                                underlineColor={'red'}
                                theme={{ fonts: {font: 'font'}, colors: { primary: 'red',underlineColor:'transparent',}}}
                                autoCompleteType={'email'}
                                keyboardType={'email-address'}
                                onSubmitEditing={this.onNextPress}
                                autoCapitalize={'none'}
                                returnKeyType={'next'}
                                blurOnSubmit={false}
                                style={{fontSize: 20}}
                                onChangeText={email => this.setState({ email })}
                            />
                            <HelperText
                                type="error"
                                visible={this.state.errorEmail}
                            >
                                {this.state.errorEmailMessage}
                            </HelperText>

                            <TouchableOpacity
                                style={styles.btn}
                                activeOpacity={0.76}
                                onPress={this.onNextPress}
                            >
                                {
                                    this.state.loading
                                        ?
                                        <ActivityIndicator size="small" color="#fff" />
                                        :
                                        <Text style={styles.btnText}>Next</Text>
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