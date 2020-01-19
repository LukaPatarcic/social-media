import React from 'react';
import {
    View,
    StyleSheet,
    ImageBackground,
    Alert,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Modal,
} from 'react-native';
import { Text } from 'native-base';
import AsyncStorage from "@react-native-community/async-storage";
import FacebookLogin from "../components/FacebookLogin";
import {Avatar, Card, IconButton, Paragraph} from 'react-native-paper';
import {Button} from "react-native-elements";
import { Redirect } from "react-router-native";
import RNRestart from 'react-native-restart';
import PostItem from "../components/PostItem";
import TimeAgo from "react-native-timeago";
import LikeButton from "../components/LikeButton";
import AddPost from "../components/AddPost";
import PTRViewAndroid from "react-native-pull-to-refresh/lib/PullToRefreshView.android";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: {
                user: {},
                posts: [],
                following: [],
                followers: []
            },
            token: null,
            redirect: false,
            loading: false,
            visible: false
        }
    }

    getUserData() {
        fetch('https://api.allshak.lukaku.tech/search/user/' + this.props.friend.profileName,{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN': this.props.token
            },
            method: "GET"
        })
            .then((response => response.json()))
            .then((data => {
                this.setState({userData: data,loading: false});
            }))
            .catch(err => {
                this.setState({error: true,loading: false});
            })
    }

    _showModal = () => {
        this.setState({ visible: true,loading: true });
        this.getUserData();
    }
    _hideModal = () => this.setState({ visible: false });

    render() {
        const {user,posts,followers,following} = this.state.userData;
        const {loading,visible} = this.state;
        const {friend} = this.props;

        return (
            <>
            <Modal
                animationType="slide"
                transparent={false}
                visible={visible}
                onRequestClose={this._hideModal}
            >
                <ImageBackground
                    style={{width: '100%', height: '100%',zIndex: -1,resizeMode: 'cover'}}
                    source={{uri: 'https://allshak.lukaku.tech/images/background.png'}}>
                    {loading ?
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',position: 'absolute', width: '100%', height: '100%'}}>
                            <ActivityIndicator color={'red'} size={100} />
                        </View>
                        :
                        <PTRViewAndroid onRefresh={() => this.getUserData(this.state.token)}>
                            <ScrollView>
                                <Card style={{marginVertical: 30,fontFamily: 'font'}}>
                                    <Card.Title subtitleStyle={{fontFamily: 'font'}} titleStyle={{fontFamily: 'font'}}  title={user.profileName} subtitle={user.firstName + " " + user.lastName} left={(props) =><Avatar.Image size={50} source={{uri: 'https://i.pinimg.com/originals/53/3c/18/533c18ff0df87fbbdf58b11e0048a199.jpg'}}/>} />
                                    <Card.Content>
                                    </Card.Content>
                                </Card>
                                <Card style={{marginVertical: 30,fontFamily: 'font'}}>
                                    <Card.Title titleStyle={{fontFamily: 'font'}}  title={'Followers (' + user.followerCount +')'} />
                                    <Card.Content>
                                        {followers.map((follower,index) =>
                                            <View key={index} style={{flex: 1, justifyContent: 'flex-start', flexDirection: 'row',marginBottom: 5}}>
                                                <View>
                                                    <Avatar.Image size={30} source={{uri: 'https://eu.ui-avatars.com/api/?rounded=true&background=f44336&color=ffffff&size=128&name='+follower.firstName+'+'+follower.lastName}}/>
                                                </View>
                                                <View style={{marginTop: 7, marginLeft: 3}}>
                                                    <Text style={{fontFamily: 'font',fontSize: 14}}>{follower.firstName + " " + follower.lastName} ({follower.profileName})</Text>
                                                </View>
                                            </View>
                                        )}
                                    </Card.Content>
                                </Card>

                                <Card style={{marginBottom: 30,fontFamily: 'font'}}>
                                    <Card.Title titleStyle={{fontFamily: 'font'}}  title={'Following (' + user.followingCount +')'} />
                                    <Card.Content>
                                        {following.map((follower,index) =>
                                            <View key={index} style={{flex: 1, justifyContent: 'flex-start', flexDirection: 'row', marginBottom: 5}}>
                                                <View>
                                                    <Avatar.Image size={30} source={{uri: 'https://eu.ui-avatars.com/api/?rounded=true&background=f44336&color=ffffff&size=128&name='+follower.firstName+'+'+follower.lastName}}/>
                                                </View>
                                                <View style={{marginTop: 7, marginLeft: 3}}>
                                                    <Text style={{fontFamily: 'font',fontSize: 14}}>{follower.firstName + " " + follower.lastName} ({follower.profileName})</Text>
                                                </View>
                                            </View>
                                        )}
                                    </Card.Content>
                                </Card>
                                <View>
                                    <Card style={{marginBottom: 30}}>
                                        <Card.Title titleStyle={{fontFamily: 'font'}} title={'Posts'}/>
                                    </Card>
                                    {posts.map((post,index) => (
                                        <PostItem post={post} key={index} />
                                    ))}
                                </View>
                            </ScrollView>
                        </PTRViewAndroid>
                    }
                </ImageBackground>
            </Modal>
            <Text  style={{fontFamily: 'font', marginBottom: 10}} onPress={this._showModal.bind(this)}> {friend.lastName} ({friend.profileName})</Text>
        </>
        );
    }
}
