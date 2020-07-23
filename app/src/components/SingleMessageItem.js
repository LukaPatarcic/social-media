import React,{Component} from "react";
import {Image, Text, ToastAndroid, View} from "react-native";
import {formatImage} from "../helpers/functions";
import TimeAgo from 'react-native-timeago';

export default class SingleMessageItem extends Component{

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return JSON.stringify(nextProps) !== JSON.stringify(this.props)
    }

    render() {
        const {message} = this.props;
        return (
            <View style={Object.assign({marginBottom: 10,flex: 1,},message.isMe ? {flexDirection: 'row'} : {flexDirection: 'row-reverse'})}>
                <View style={message.isMe ? {flexDirection: 'row',width: '13%'} : {flexDirection: 'row-reverse',width: '13%'}}>
                    <Image source={{uri: formatImage(message.profilePicture,message.firstName,message.lastName)}} style={{width: 45,height: 45,borderRadius: 50}} />
                </View>
                <View style={Object.assign({display: 'flex',width: '80%'},message.isMe ? {alignItems: 'flex-start',marginLeft: 10}:{alignItems: 'flex-end',marginRight: 10})}>
                    <View style={{backgroundColor: 'white',padding: 10,borderRadius: 10}}>
                        <Text
                            onLongPress={
                                () => ToastAndroid.show(
                                    new Date(message.createdAt).toLocaleDateString() + " " + new Date(message.createdAt).toLocaleTimeString(),ToastAndroid.SHORT)}
                            style={{fontFamily: 'font',fontSize: 16,flex: 1,flexWrap: 'wrap'}}>{message.message}</Text>
                        <View>
                            <TimeAgo style={{fontFamily: 'font',fontSize: 10}} time={message.createdAt} />
                        </View>
                    </View>
                    <View>
                    </View>
                </View>
            </View>
        );
    }
}