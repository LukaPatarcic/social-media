import {ActivityIndicator, StyleSheet, Text, ToastAndroid, View} from "react-native";
import {IconButton, TextInput} from "react-native-paper";
import React from "react";
import AsyncStorage from "@react-native-community/async-storage";
import {BASE_URL} from "../config";
import Icon from "react-native-vector-icons/FontAwesome";

export default class CommentInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            text: '',
            loading:false,
            replyTo: props.replyTo
        }
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.replyTo!==prevState.replyTo){
            return { replyTo: nextProps.replyTo};
        }
        else return null;
    }


    handleSubmit() {
        const {text,replyTo} = this.state;
        const {id} = this.props;

        if(text.trim() < 1) {
            ToastAndroid.show('Please enter a message',ToastAndroid.SHORT);
            return;
        }

        if(text.trim() > 255) {
            ToastAndroid.show('Message is too long',ToastAndroid.SHORT);
            return;
        }

        this.setState({loading: true});
        let url = replyTo === null ?'/comment' : '/subcomment';
        let json = replyTo === null ? {text, post: id} : {text, comment: replyTo.id};
        AsyncStorage.getItem('access-token', (err, val) => {
            fetch(BASE_URL + url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + val
                },
                method: "POST",
                body: JSON.stringify(json)
            })
                .then((response => response.json()))
                .then((data => {
                    this.setState({text: '', loading: false});
                    if(replyTo === null) {
                        this.props.setNewComment(data.comment);
                        this.props.scrollTopTop();
                    } else {
                        this.props.setReplyToToNull();
                        this.props.setNewSubComment(data.comment,replyTo.id);

                    }
                }))
                .catch(err => {
                    this.setState({error: 'Oops... Something went wrong!', loading: false});
                    ToastAndroid.show('Oops... Something went wrong!',ToastAndroid.SHORT);
                });
        })
    }

    render() {
        const {loading,replyTo} = this.state;
        return (
            <>
                {replyTo &&
                <View style={styles.replyTo}>
                    <View style={{alignItems: 'flex-start',flexDirection: 'row',flex:1,marginLeft:10}}>
                        <Icon color={'red'} name={'times'} size={20} onPress={() => this.props.setReplyToToNull()} />
                        <Text style={{fontSize:16, fontFamily: 'font',marginLeft:10}}>Replying to {replyTo.profileName}</Text>
                    </View>
                </View>
                }
            <View style={styles.bottomView}>
                <View style={{width: '85%'}}>
                    <TextInput
                        label='Enter comment...'
                        value={this.state.text}
                        underlineColor={'#c4c4c4'}
                        theme={{ fonts: {font: 'font'}, colors: { primary: 'red',underlineColor:'transparent',}}}
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
            </>
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
    replyTo: {
        width: '100%',
        flex: 1,
        height: 54,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 0,
        position: 'absolute',
        marginBottom:53,
        borderBottomColor:'red',
        borderBottomWidth: 1,
        backgroundColor: '#d8d8d8'
    }
});