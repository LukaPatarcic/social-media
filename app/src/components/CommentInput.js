import {ActivityIndicator, StyleSheet, ToastAndroid, View} from "react-native";
import {IconButton, TextInput} from "react-native-paper";
import React from "react";
import AsyncStorage from "@react-native-community/async-storage";
import {BASE_URL} from "../config";

export default class CommentInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            text: '',
            loading:false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit() {
        const {text} = this.state;
        const {id} = this.props;
        this.props.handleComments();

        if(text.trim() < 1) {
            ToastAndroid.show('Please enter a message',ToastAndroid.SHORT);
            return;
        }

        if(text.trim() > 255) {
            ToastAndroid.show('Message is too long',ToastAndroid.SHORT);
            return;
        }

        this.setState({loading: true});
        AsyncStorage.getItem('access-token', (err, val) => {
            fetch(BASE_URL + '/comment', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + val
                },
                method: "POST",
                body: JSON.stringify({text, post: id})
            })
                .then((response => response.json()))
                .then((data => {
                    this.setState({text: '', loading: false});
                    this.props.getComments()
                }))
                .catch(err => {
                    this.setState({error: 'Oops... Something went wrong!', loading: false});
                });
        })
    }



    render() {
        const {loading} = this.state;
        return (
            <View style={styles.bottomView}>
                <View style={{width: '85%'}}>
                    <TextInput
                        label='Enter comment...'
                        value={this.state.text}
                        selectionColor={'red'}
                        underlineColor={'#c4c4c4'}
                        theme={{ fonts: {font: 'font'}, colors: { primary: 'red',underlineColor:'transparent',}}}
                        autoCompleteType={'email'}
                        keyboardType={'email-address'}
                        onSubmitEditing={this.handleSubmit}
                        returnKeyType={'send'}
                        blurOnSubmit={false}
                        style={{fontSize: 16,backgroundColor: '#c4c4c4',height: 54}}
                        onChangeText={text => this.setState({ text })}
                    />
                </View>
                <View style={{width: '15%'}}>
                    {loading ?
                        <ActivityIndicator color={'#f00'} size={25} />
                        :
                        <IconButton
                            icon="send"
                            color={'red'}
                            size={30}
                            onPress={this.handleSubmit}
                        />
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    bottomView: {
        width: '100%',
        flex: 1,
        height: 54,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#c4c4c4',
        position: 'absolute',
        marginBottom: 0,
        bottom: 0,
    },
    textStyle: {
        color: '#fff',
        fontSize: 18,
    },
});