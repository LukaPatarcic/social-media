import React from 'react';
import {
    View,
    StyleSheet,
    ImageBackground,
    ScrollView,
    Button,
    ActivityIndicator,
    TouchableOpacity,
    ToastAndroid
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Text } from 'native-base';
import PTRViewAndroid from "react-native-pull-to-refresh/lib/PullToRefreshView.android";
import TimeAgo from "react-native-timeago";
import {Avatar, Card, IconButton} from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome5";
import {formatImage} from "../helpers/functions";
import {BASE_URL} from "../config";

export default class Notifications extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications: [],
            loading: false
        }
    }

    getNotifications(loading = true) {
        AsyncStorage.getItem('access-token', (err, val) => {
            if (!val) {
                // this.props.history.push('/login');
            } else {
                if(loading) {
                    this.setState({loading: true});
                }
                fetch(BASE_URL+'/friend/request', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+val
                    },
                    method: "GET",
                })
                    .then((response => response.json()))
                    .then((data => {
                        console.log(data);
                        this.setState({notifications: data, loading: false});
                        // this.props.getFriends();
                        if (data.error) {
                            this.setState({error: true})
                        }
                    }))
                    .catch(err => {
                        this.setState({error: true, loading: false});
                    })
            }

            // this.props.getNotifications();
            // this.props.jumpTo('notifications');
        })
    }
    componentDidMount() {
        this.getNotifications();
    }

    acceptFollow(id) {
        AsyncStorage.getItem('access-token', (err, val) => {
            if (!val) {
                // this.props.history.push('/login');
            } else {
                fetch(BASE_URL + '/friend/request',{
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+val
                    },
                    method: "PATCH",
                    body: JSON.stringify({id})
                })
                    .then((response => response.json()))
                    .then((data => {
                        this.setState({loading: false});
                        if(data.error) {
                            this.setState({error: true})
                        }
                        ToastAndroid.show("You accepted the request",ToastAndroid.SHORT);

                    }))
                    .catch(err => {
                        this.setState({error: true,loading: false});
                    })
                this.getNotifications(false);
            }
        })

    }

    declineFollow(id) {
        AsyncStorage.getItem('access-token', (err, val) => {
            if (!val) {
                // this.props.history.push('/login');
            } else {
                fetch(BASE_URL + '/friend/request',{
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization ': 'Bearer ' + val
                    },
                    method: "DELETE",
                    body: JSON.stringify({id})
                })
                    .then((response => response.json()))
                    .then((data => {
                        this.setState({loading: false});
                        if(data.error) {
                            this.setState({error: true})
                        }
                    }))
                    .catch(err => {
                        this.setState({error: true,loading: false});
                    })
                this.getNotifications(false);
            }
        })
    }

    render() {
        const {notifications,loading} = this.state;
        return (
            <ImageBackground
                style={{width: '100%', height: '100%'}}
                source={require('../../assets/images/background-01.png')}
            >
                {loading
                    ?

                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',position: 'absolute', width: '100%', height: '100%'}}>
                        <ActivityIndicator size={70} color="#f00" />
                    </View>
                    :
                    notifications.length
                        ?
                        <ScrollView>
                            <PTRViewAndroid onRefresh={this.getNotifications.bind(this)}>
                                <View style={{marginBottom: 20}}>
                                    <Card>
                                        <Card.Title
                                            subtitleStyle={{fontFamily: 'font'}}
                                            titleStyle={{fontFamily: 'font'}}
                                            title={'Notifications (' + notifications.length + ')'}
                                        />
                                    </Card>
                                </View>
                                {notifications.map((notification,index) =>
                                    <Card key={index} style={{marginBottom: 20}}>
                                        <Card.Content>
                                            <View style={{flex:1, alignContent: 'flex-start',flexDirection: 'row'}}>
                                                <View>
                                                    <Avatar.Image
                                                        size={50}
                                                        source={{
                                                            uri: formatImage(notification.profilePicture,notification.firstName,notification.lastName)
                                                        }}
                                                    />
                                                </View>
                                                <View style={{marginLeft: 10, alignContent: 'center',justifyContent: 'center'}}>
                                                    <View>
                                                        <Text style={{fontFamily: 'font', fontSize: 16}}>{notification.firstName + " " + notification.lastName + ' sent you a follow request'}</Text>
                                                    </View>
                                                    <View>
                                                        <Text style={{fontFamily: 'font', fontSize: 12, color: 'grey'}}><TimeAgo time={notification.createdAt}/></Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{flex:1, flexDirection: 'row', alignContent: 'center'}}>
                                                <View>
                                                    <TouchableOpacity
                                                        onPress={() => this.acceptFollow(notification.id)}
                                                        id={notification.id}
                                                        activeOpacity={0.8}
                                                        style={{
                                                            alignItems:'center',
                                                            justifyContent:'center',
                                                            width:55,
                                                            height:55,
                                                            backgroundColor:'white',
                                                            borderRadius:50,
                                                        }}
                                                    >
                                                        <Icon name={'check'} size={25} color={'red'} />
                                                    </TouchableOpacity>
                                                </View>
                                                <View>
                                                    <TouchableOpacity
                                                        onPress={() => this.declineFollow(notification.id)}
                                                        id={notification.id}
                                                        activeOpacity={0.8}
                                                        style={{
                                                            alignItems:'center',
                                                            justifyContent:'center',
                                                            width:55,
                                                            height:55,
                                                            backgroundColor:'white',
                                                            borderRadius:50,
                                                        }}
                                                    >
                                                        <Icon name={'times'} size={25} color={'grey'} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                )}
                            </PTRViewAndroid>
                        </ScrollView>
                        :
                        <PTRViewAndroid onRefresh={this.getNotifications.bind(this)}>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100}}>
                            <Text style={{fontFamily: 'font', fontSize: 24, padding: 20, textAlign: 'center', color: '#fff'}}>No notifications...</Text>
                            <Icon color={'white'} size={80} name={'sad-tear'} />
                        </View>
                        </PTRViewAndroid>
                }
            </ImageBackground>
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
