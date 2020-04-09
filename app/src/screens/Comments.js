import {ActivityIndicator, StyleSheet, ScrollView, View} from "react-native";
import React from "react";
import PTRViewAndroid from "react-native-pull-to-refresh/lib/PullToRefreshView.android";
import AsyncStorage from "@react-native-community/async-storage";
import {BASE_URL} from "../config";
import { IconButton, TextInput} from "react-native-paper";
import CommentItem from "../components/CommentItem";
import CommentInput from "../components/CommentInput";

export default class Comments extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            loading: true,
        };

        this.getComments = this.getComments.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.getComments = this.getComments.bind(this);
    }

    componentDidMount() {
        this.getComments();
    }

    getComments() {
        const {id} = this.props.route.params;
        AsyncStorage.getItem('access-token', (err, val) => {
            fetch(BASE_URL+'/comment/'+id,{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ val
                }
            })
                .then((response => response.json()))
                .then((data => {
                    this.setState({comments: data,loading: false})
                }))
        })
    }

    handleScroll(e) {
        console.log(e);
    }


    render() {
        const {id,handleComments} = this.props.route.params;
        const {comments,loading} = this.state;

        return loading ?
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',position: 'absolute', width: '100%', height: '100%'}}>
                <ActivityIndicator size={60} color={'red'} />
            </View>
            :
                <View style={{height: '100%',paddingTop: 10}}>
                    <PTRViewAndroid onRefresh={() => this.getComments(true)}>
                        <ScrollView scrollEventThrottle={200} style={{marginBottom: 65}}>
                            {comments.map((comment,index) => (
                                <CommentItem id={id} comment={comment} key={index} />
                            ))}
                        </ScrollView>
                    </PTRViewAndroid>
                    <CommentInput handleComments={handleComments} id={id} getComments={this.getComments} />
                </View>
    }

}
