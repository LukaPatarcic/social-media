import { Image, StyleSheet, ToastAndroid, View} from "react-native";
import React from "react";
import {Card, IconButton, Avatar, Button} from "react-native-paper";
import {BASE_URL} from "../config";

export default class SendFriendRequest extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }

        this.sendFriendRequest = this.sendFriendRequest.bind(this);
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
                this.props.getFriends();
                if(data.error) {
                    ToastAndroid.show('Failed to follow friend...', ToastAndroid.SHORT);
                }
            }))
            .catch(err => {
                this.setState({loading: false});
                ToastAndroid.show('Failed to follow friend...', ToastAndroid.SHORT);
            })
    }

    render() {
        const {friend} = this.props;
        const {loading} = this.state;
        return (
            <Card style={{marginVertical: 5,backgroundColor:'#fff'}}>
                <Card.Title
                    title={friend.firstName+' '+friend.lastName}
                    subtitle={friend.profileName}
                    left={(props) => <Avatar.Image {...props} source={{uri: 'https://eu.ui-avatars.com/api/?rounded=true&background=f44336&color=ffffff&size=128&name='+friend.firstName+'+'+friend.lastName}} />}
                    right={(props) => <Button onPress={this.sendFriendRequest} {...props} mode={'outlined'} color={'red'} style={{fontSize:10}} uppercase={false} disabled={friend.requested || friend.following}>{loading ? "Loading...":(friend.requested ? 'Requested' : (friend.following ? 'Following' : 'Follow'))}</Button>}
                />
            </Card>
        );
    }
}

// <View style={styles.card}>
//     {/*<UserProfile friend={friend} token={this.props.token} />*/}
//     <Image style = {{height: 40, width: 40, margin: 5 }} source={{uri: 'https://eu.ui-avatars.com/api/?rounded=true&background=f44336&color=ffffff&size=128&name='+friend.firstName+'+'+friend.lastName}} />
//     <Text style={{fontFamily: 'font',fontSize: 18}} onLongPress={() => ToastAndroid.show(friend.profileName,ToastAndroid.SHORT)}>{friend.firstName+' '+friend.lastName}</Text>
//     {/*<Button*/}
//     {/*    id={friend.id}*/}
//     {/*    disabled={friend.requested ? true : (friend.following ? true : false)}*/}
//     {/*    onPress={this.sendFriendRequest.bind(this)}*/}
//     {/*    color={'#f00'}*/}
//     {/*    title={loading ? "Loading...":(friend.requested ? 'Requested' : (friend.following ? 'Following' : 'Follow'))}*/}
//     {/*/>*/}
//     {/**/}
// </View>
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        shadowOffset:{  width: 10,  height: 10,  },
        shadowColor: 'black',
        shadowOpacity: 1.0,
    },
    card: {
        backgroundColor: '#fff',
        margin: 20,
        marginVertical: 10,
        padding: 20
    }
});
