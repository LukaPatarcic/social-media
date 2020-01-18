import {Button, StyleSheet, ToastAndroid, View} from "react-native";
import {Text} from "native-base";
import React from "react";

export default class SendFriendRequest extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }


    sendFriendRequest() {
        this.setState({loading: true});
        fetch('https://api.allshak.lukaku.tech/friend/request',{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN': this.props.token
            },
            method: "POST",
            body: JSON.stringify({id: this.props.friend.id})
        })
            .then((response => response.json()))
            .then((data => {
                this.setState({loading: false});
                this.props.getFriends();
                if(data.error) {
                    this.setState({error: true})
                }
            }))
            .catch(err => {
                this.setState({error: true,loading: false});
            })
    }

    render() {
        const {friend} = this.props;
        const {loading,error} = this.state;
        return (
            <View style={styles.card}>
                <Text  style={{fontFamily: 'font', marginBottom: 10}}>{friend.firstName} {friend.lastName} ({friend.profileName})</Text>
                <Button
                    id={friend.id}
                    disabled={friend.requested ? true : (friend.following ? true : false)}
                    onPress={this.sendFriendRequest.bind(this)}
                    color={'#f00'}
                    title={loading ? "Loading...":(friend.requested ? 'Requested' : (friend.following ? 'Following' : 'Follow'))}
                />
                {error && ToastAndroid.show('Failed to follow friend...', ToastAndroid.SHORT)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 70,
        alignItems: 'center',
        justifyContent: 'flex-start',
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
