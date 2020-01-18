import React from 'react';
import {
    View,
    StyleSheet,
    ImageBackground,
    ScrollView,
    Modal,
    TextInput, Text, ToastAndroid, ActivityIndicator,
} from 'react-native';
import {FAB} from 'react-native-paper';
import AsyncStorage from "@react-native-community/async-storage";
import PostItem from "../components/PostItem";
import {Button} from "react-native-elements";
import Icon from 'react-native-vector-icons/FontAwesome';
import AddPost from "../components/AddPost";

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

    componentDidMount() {
        AsyncStorage.getItem('access-token', (err, val) => {
            if (!val) {
                this.props.history.push('/login');
            } else {
                this.setState({token: val,loading:true})
                fetch('https://api.allshak.lukaku.tech/post',{
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-AUTH-TOKEN': val
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
            }
        });
    }

    render() {
        const {posts,loading} = this.state;
        return (
            <ImageBackground
                style={{width: '100%', height: '100%',zIndex: -1,resizeMode: 'cover'}}
                source={{uri: 'https://allshak.lukaku.tech/images/background.png'}}>
                <ScrollView style={{paddingHorizontal: 20, paddingTop: 20}}>
                    {loading
                        ?
                        <ActivityIndicator size="large" color="#f00" />
                        :
                        this.state.posts.map((post,index) =>
                            <PostItem post={post} key={index} />
                        )}
                </ScrollView>
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