import React from "react";
import {Avatar, Card, IconButton, Paragraph, Text} from "react-native-paper";
import { ToastAndroid, View} from "react-native";
import TimeAgo from 'react-native-timeago';
import LikeButton from "./LikeButton";
import SharePost from "./SharePost";

export default class PostItem extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            likes: this.props.post.likes,
            comments: this.props.post.commentCount
        }

        this.handleLikes = this.handleLikes.bind(this);
        this.handleComments = this.handleComments.bind(this);
    }

    handleLikes(e) {
        this.setState((prevState) => ({likes: e ? prevState.likes+1 : prevState.likes-1}))
    }

    handleComments() {
        this.setState((prevState) => ({comments: prevState.comments + 1}))
    }

    render() {
        const {post} = this.props;
        const {likes,comments} = this.state;
        return (
            <Card style={{marginBottom: 20,marginHorizontal: 10,fontFamily: 'font'}}>
                <Card.Title subtitleStyle={{fontFamily: 'font'}} titleStyle={{fontFamily: 'font'}}  title={post.profileName} subtitle={<TimeAgo onLongPress={() => ToastAndroid.show(post.createdAt,ToastAndroid.SHORT)} time={post.createdAt}/>} left={(props) => <Avatar.Image size={50} source={{uri: 'https://eu.ui-avatars.com/api/?rounded=true&background=f44336&color=ffffff&size=128&name='+post.firstName+'+'+post.lastName}}/>} />
                <Card.Content>
                    <Paragraph  style={{fontFamily: 'font', fontSize: 18}}>
                        {post.text}
                    </Paragraph>
                    <View style={{flex:1,justifyContent: 'space-between', flexDirection: 'row', marginTop: 15}}>
                        <View>
                            <Text style={{fontFamily: 'font'}}>Likes {likes}</Text>
                        </View>
                        <View>
                            <Text style={{fontFamily: 'font'}}>Comments {comments}</Text>
                        </View>
                    </View>
                </Card.Content>
                <Card.Actions>
                    <LikeButton
                        liked={post.liked}
                        postId={post.id}
                        handleLikes={this.handleLikes.bind(this)}
                    />
                    <IconButton
                        icon="comment"
                        color={'grey'}
                        size={30}
                        onPress={() => {this.props.navigation.navigate('Comments',{id: this.props.post.id,handleComments: this.handleComments,commentCount: comments});}}
                    />
                    <SharePost
                        id={post.id}
                    />
                </Card.Actions>
            </Card>
        );
    }
}