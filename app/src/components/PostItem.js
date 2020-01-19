import React from "react";
import {Avatar, Card, IconButton, Paragraph, Text, Divider} from "react-native-paper";
import {Button, View} from "react-native";
import TimeAgo from 'react-native-timeago';
import LikeButton from "./LikeButton";

export default class PostItem extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            likes: this.props.post.likes
        }
    }

    handleLikes(e) {
        this.setState((prevState) => ({likes: e ? prevState.likes+1 : prevState.likes-1}))
    }

    render() {
        const {post,size} = this.props;
        const {likes} = this.state;
        return (
            <Card style={{marginBottom: 30,fontFamily: 'font'}}>
                <Card.Title subtitleStyle={{fontFamily: 'font'}} titleStyle={{fontFamily: 'font'}}  title={post.firstName + " " + post.lastName} subtitle={<TimeAgo time={post.createdAt}/>} left={(props) => <Avatar.Image size={50} source={{uri: 'https://eu.ui-avatars.com/api/?rounded=true&background=f44336&color=ffffff&size=128&name='+post.firstName+'+'+post.lastName}}/>} />
                <Card.Content>
                    <Paragraph  style={{fontFamily: 'font', fontSize: 18}}>
                        {post.text}
                    </Paragraph>
                    <View style={{flex:1,justifyContent: 'space-between', flexDirection: 'row', marginTop: 15}}>
                        <View>
                            <Text style={{fontFamily: 'font'}}>Liked by {likes} people</Text>
                        </View>
                        <View>
                            <Text style={{fontFamily: 'font'}}>Comments 0</Text>
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
                        size={20}
                        onPress={() => console.log('Pressed')}
                    />
                    <IconButton
                        icon="share"
                        color={'grey'}
                        size={20}
                        onPress={() => console.log('Pressed')}
                    />
                </Card.Actions>
            </Card>
        );
    }
}