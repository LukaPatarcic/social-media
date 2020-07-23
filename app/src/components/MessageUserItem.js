import React,{Component} from "react";
import {Avatar, Card} from "react-native-paper";
import TimeAgo from "react-native-timeago";
import {formatImage} from "../helpers/functions";

export default class MessageUserItem extends Component{
    render() {
        const {user,navigation} = this.props;
        console.log(user.createdAt);
        return (
            <Card onPress={() => navigation.navigate('MessagesWithUser',{user})}  style={{marginBottom: 20,marginHorizontal: 10,fontFamily: 'font'}}>
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
                                {uri: formatImage(user.profilePicture,user.firstName,user.lastName)}}/>} />
            </Card>
        );
    }
}