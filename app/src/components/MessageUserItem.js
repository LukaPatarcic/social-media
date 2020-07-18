import React,{Component} from "react";
import {Avatar, Card} from "react-native-paper";
import TimeAgo from "react-native-timeago";
import {ToastAndroid} from "react-native";

export default class MessageUserItem extends Component{
    render() {
        const {user} = this.props;
        return (
            <Card style={{marginBottom: 20,marginHorizontal: 10,fontFamily: 'font'}}>
                <Card.Title
                    subtitleStyle={{fontFamily: 'font'}}
                    titleStyle={{fontFamily: 'font'}}
                    title={user.profileName}
                    subtitle={
                        <>
                            {user.message} •{'\u00A0'}
                            <TimeAgo time={user.createdAt}/>
                        </>
                    }
                    left={(props) =>
                        <Avatar.Image
                            size={45}
                            source={
                                {uri: 'https://eu.ui-avatars.com/api/?rounded=true&background=f44336&color=ffffff&size=35&name='+user.firstName+'+'+user.lastName}}/>} />
            </Card>
        );
    }
}