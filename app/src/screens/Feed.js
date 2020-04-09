import React from 'react';
import {
    View,
    StyleSheet,
    ImageBackground,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import AsyncStorage from "@react-native-community/async-storage";
import PostItem from "../components/PostItem";
import AddPost from "../components/AddPost";
import PTRViewAndroid from "react-native-pull-to-refresh/lib/PullToRefreshView.android";
import {BASE_URL} from "../config";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            loading: false,
            disabled: false,
            visible: false,
            token: null,
            text: ''
        }
    }

    getPosts(refreshing = false) {
        AsyncStorage.getItem('access-token', (err, val) => {
            if(!refreshing) {
                this.setState({loading:true})
            }
            fetch(BASE_URL+'/post',{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ val
                },
                method: "GET"
            })
                .then((response => response.json()))
                .then((data => {
                    this.setState({loading: false, posts: data});
                }))
                .catch(err => {
                    this.setState({error: true,loading: false});
                })
        });
    }

    componentDidMount() {
        this.getPosts();
    }

    render() {
        const {posts,loading} = this.state;
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
                    <PTRViewAndroid onRefresh={() => this.getPosts(true)}>
                        <ScrollView style={{paddingHorizontal: 10, paddingTop: 20}}>
                        {posts.map((post,index) =>
                            <PostItem navigation={this.props.navigation} post={post} key={index} />
                        )}
                        </ScrollView>
                    </PTRViewAndroid>
                }
                <AddPost />
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
    fab: {
        position: 'absolute',
        backgroundColor: 'grey',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    fabAdd: {
        backgroundColor: 'red',
    }
});