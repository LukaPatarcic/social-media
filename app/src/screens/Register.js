import React from 'react';
import {
    ActivityIndicator,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {Card, HelperText, TextInput, Title} from "react-native-paper";
import {styles} from "../style/Registration";

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            errorFirstName: false,
            errorFirstNameMessage: '',
            lastName: '',
            errorLastName: false,
            errorLastNameMessage: '',
        }

        this.firstNameRef = React.createRef();
        this.lastNameRef = React.createRef();
        this.onNextPress = this.onNextPress.bind(this)

    }

    onNextPress() {
        const {firstName,lastName} = this.state;
        this.setState({errorFirstName: false, errorFirstNameMessage: '', errorLastName: false, errorLastNameMessage: '', error: ''});
        let error = false;
        if(firstName.trim().length < 1) {
            this.setState({errorFirstName: true, errorFirstNameMessage: 'Please enter your first name'})
            error = true;
        }

        if(firstName.trim().length > 50) {
            this.setState({errorFirstName: true, errorFirstNameMessage: 'First name cannot be longer than 50 characters'})
            error = true;
        }

        if(lastName.trim().length < 1) {
            this.setState({errorLastName: true, errorLastNameMessage: 'Please enter your last name'})
            error = true;
        }

        if(lastName.trim().length > 50) {
            this.setState({errorLastName: true, errorLastNameMessage: 'Last name cannot be longer than 50 characters'})
            error = true;
        }

        if(error)
            return;

        this.props.navigation.navigate('RegisterTwo', {name: {firstName,lastName}})
    }

    render() {

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
                                ref={this.firstNameRef}
                                mode={'outlined'}
                                label='First Name'
                                error={this.state.errorFirstName}
                                value={this.state.firstName}
                                selectionColor={'red'}
                                underlineColor={'red'}
                                theme={{ fonts: {font: 'font'}, colors: { primary: 'red',underlineColor:'transparent',}}}
                                onSubmitEditing={() =>  this.lastNameRef.current.focus()}
                                returnKeyType={'next'}
                                blurOnSubmit={false}
                                style={{fontSize: 20}}
                                onChangeText={firstName => this.setState({ firstName })}
                            />
                            <HelperText
                                type="error"
                                visible={this.state.errorFirstName}
                            >
                                {this.state.errorFirstNameMessage}
                            </HelperText>

                            <TextInput
                                ref={this.lastNameRef}
                                mode={'outlined'}
                                label='Last Name'
                                error={this.state.errorLastName}
                                value={this.state.lastName}
                                selectionColor={'red'}
                                underlineColor={'red'}
                                theme={{ fonts: {font: 'font'}, colors: { primary: 'red',underlineColor:'transparent',}}}
                                onSubmitEditing={this.onNextPress}
                                returnKeyType={'next'}
                                blurOnSubmit={false}
                                style={{fontSize: 20}}
                                onChangeText={lastName => this.setState({ lastName })}
                            />
                            <HelperText
                                type="error"
                                visible={this.state.errorLastName}
                            >
                                {this.state.errorLastNameMessage}
                            </HelperText>

                            <TouchableOpacity
                                style={styles.btn}
                                activeOpacity={0.76}
                                onPress={this.onNextPress}
                            >
                                <Text style={styles.btnText}>Next</Text>
                            </TouchableOpacity>
                            <Text style={{marginTop: 20,fontFamily: "font",textAlign: 'center'}}>Already have an account? <Text style={{color:'red',fontFamily: "font"}} onPress={() => this.props.navigation.navigate('Login')}>Login now!</Text></Text>
                        </Card.Content>
                    </Card>
                </View>
            </ImageBackground>
        );
    }
}

