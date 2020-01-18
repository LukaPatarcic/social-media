import React from "react";
import {Avatar, Card, Paragraph, Title} from "react-native-paper";
import {Button} from "react-native";
import TimeAgo from 'react-native-timeago';

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
            <Card style={{marginBottom: 30}}>
                <Card.Title title={post.firstName + " " + post.lastName} left={(props) => <Avatar.Image size={50} source={{uri: 'https://eu.ui-avatars.com/api/?rounded=true&background=f44336&color=ffffff&size=128&name='+post.firstName+'+'+post.lastName}}/>} />
                <Card.Content>
                    <Title><TimeAgo time={post.createdAt}/></Title>
                    <Paragraph  style={{fontFamily: 'font'}}>
                        {post.text}
                    </Paragraph>
                </Card.Content>
                <Card.Actions>
                    <Button title={'asd'} />
                    <Button title={'asd'} />
                    <Button title={'asd'} />
                </Card.Actions>
            </Card>
        );
    }
}