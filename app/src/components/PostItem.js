import React from "react";
import {Avatar, Card, Dialog, IconButton, Paragraph, Portal, Text} from "react-native-paper";
import {ToastAndroid, View, StyleSheet} from "react-native";
import TimeAgo from 'react-native-timeago';
import LikeButton from "./LikeButton";
import SharePost from "./SharePost";
import {formatImage} from "../helpers/functions";
import ImageCarousel from "./ImageCarousel";

export default class PostItem extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            likes: this.props.post.likes,
            comments: this.props.post.commentCount,
            dialogue: false
        }

        this.handleLikes = this.handleLikes.bind(this);
        this.handleComments = this.handleComments.bind(this);
        this.redirectToUser = this.redirectToUser.bind(this);
    }

    handleLikes(e) {
        this.setState((prevState) => ({likes: e ? prevState.likes+1 : prevState.likes-1}))
    }

    handleComments() {
        this.setState((prevState) => ({comments: prevState.comments + 1}))
    }

    redirectToUser() {
        this.props.navigation.push('Profile',{profileName: this.props.post.profileName});
        this.props.navigation.navigate('Profile');
    }

    render() {
        const {post,id} = this.props;
        const {likes,comments,dialogue} = this.state;
        return (
            <Card style={{marginBottom: 20,marginHorizontal: 10,fontFamily: 'font'}}>
                <Portal>
                    <Dialog visible={dialogue} onDismiss={() => this.setState({dialogue: false})}>
                        <Dialog.Content>
                            <Paragraph onPress={() => {
                                this.props.onDeletePost(post.id)
                                this.setState({dialogue: false})
                            }}>Delete</Paragraph>
                        </Dialog.Content>
                    </Dialog>
                </Portal>
                <Card.Title
                    subtitleStyle={{fontFamily: 'font'}}
                    titleStyle={{fontFamily: 'font'}}
                    title={<Text onPress={this.redirectToUser}>{post.profileName}</Text>}
                    subtitle={<TimeAgo onLongPress={() => ToastAndroid.show(post.createdAt,ToastAndroid.SHORT)} time={post.createdAt}/>}
                    left={(props) => <Avatar.Image size={50} source={{uri: formatImage(post.profilePicture,post.firstName,post.lastName)}}/>}
                    right={(props) => id == post.userId ? <IconButton {...props} icon="dots-vertical" onPress={() => this.setState({dialogue: true})} /> : null}
                />
                <Card.Content>
                    <Paragraph  style={{fontFamily: 'font', fontSize: 18}}>
                        {post.text}
                    </Paragraph>
                    <ImageCarousel images={post.images} profileName={post.profileName} />
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

const styles = StyleSheet.create({
    container: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        borderWidth: 2,
        borderColor: '#CCC',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
