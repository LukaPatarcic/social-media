import React from 'react';
import {View, StyleSheet, ImageBackground, ScrollView, Text,} from 'react-native';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import AsyncStorage from "@react-native-community/async-storage";
import PostItem from "../components/PostItem";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        super(props);
        this.state = {
            posts: [],
            loading: false
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('access-token', (err, val) => {
            if (!val) {
                this.props.history.push('/login');
            } else {
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
        return (
            <ImageBackground
                style={{width: '100%', height: '100%',zIndex: -1,resizeMode: 'cover'}}
                source={{uri: 'https://allshak.lukaku.tech/images/background.png'}}>
                <ScrollView style={{paddingHorizontal: 20, paddingTop: 20}}>
                    {this.state.posts.map((post,index) =>
                        <PostItem post={post} key={index} />
                    )}
                </ScrollView>
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
    }
});