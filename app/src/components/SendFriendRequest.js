import {Image, StyleSheet, Text, ToastAndroid, View} from "react-native";
import React from "react";
import {Card, IconButton, Avatar, Button} from "react-native-paper";
import {BASE_URL} from "../config";
import {formatImage} from "../helpers/functions";

export default class SendFriendRequest extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }

        this.sendFriendRequest = this.sendFriendRequest.bind(this);
        this.redirectToUser = this.redirectToUser.bind(this);
    }


    sendFriendRequest() {
        const {friend,token} = this.props;
        this.setState({loading: true});
        fetch(BASE_URL+'/friend/request',{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            },
            method: "POST",
            body: JSON.stringify({id: friend.id})
        })
            .then((response => response.json()))
            .then((data => {
                this.setState({loading: false});
                this.props.sendFriendRequestChangeState(friend.id);
                if(data.error) {
                    ToastAndroid.show('Failed to follow friend...', ToastAndroid.SHORT);
                }
            }))
            .catch(err => {
                this.setState({loading: false});
                ToastAndroid.show('Failed to follow friend...', ToastAndroid.SHORT);
            })
    }

    redirectToUser() {
        this.props.navigation.push("Profile",{profileName: this.props.friend.profileName,id: this.props.friend.id})
        this.props.navigation.navigate('Profile')
    }

    render() {
        const {friend} = this.props;
        const {loading} = this.state;
        return (
            <Card onPress={this.props.message ? () => this.props.navigation.navigate('MessagesWithUser',{user:friend}) : () => this.redirectToUser()} style={{marginVertical: 5,backgroundColor:'#fff'}}>
                <Card.Title
                    title={
                        this.props.message ?
                            friend.firstName + " " + friend.lastName
                            :
                            <Text onPress={() => {
                                this.props.navigation.push("Profile", {profileName: friend.profileName})
                                this.props.navigation.navigate("Profile")
                            }}>{friend.firstName + " " + friend.lastName}</Text>
                    }
                    subtitle={friend.profileName}
                    left={(props) => <Avatar.Image onPress={this.redirectToUser} {...props} source={{uri: formatImage(friend.profilePicture,friend.firstName,friend.lastName)}} />}
                    right={(props) => this.props.message
                        ?
                        null
                    :
                        <Button
                            onPress={this.sendFriendRequest}
                            {...props}
                            mode={'outlined'}
                            color={'red'}
                            style={{fontSize:10}}
                            uppercase={false}
                            disabled={friend.requested || friend.following}
                        >
                            {loading ?
                                "Loading...":(friend.requested ? 'Requested'
                                    :
                                (friend.following ? 'Following' : 'Follow'))
                            }
                        </Button>
                    }
                />

            </Card>
        );
    }
}
