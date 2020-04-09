import {Image, Text, View} from "react-native";
import TimeAgo from "react-native-timeago";
import {Divider, IconButton} from "react-native-paper";
import React from "react";
import CommentLike from "./CommentLike";

export default class CommentItem extends React.Component {
    constructor(props) {
        super(props);
        const {liked,likes} = this.props;
        this.state = {
            liked: liked,
            likes: likes
        };

        this.addLike = this.addLike.bind(this);
        this.removeLike = this.removeLike.bind(this);
    }

    addLike() {
        this.setState((prevState) => ({likes: prevState.likes+1}))
    }

    removeLike() {
        this.setState((prevState) => ({likes: prevState.likes-1}))
    }

    render() {
        const {comment} = this.props;
        const {likes} = this.state;
        return (
            <View style={{marginBottom: 10}}>
                <View style={{flex: 1,flexDirection:'row',marginBottom: 10,justifyContent:'space-between'}}>
                    <View style={{flexDirection:'row',alignItems: 'flex-start',justifyContent: 'flex-start'}}>
                        <View>
                            <View>
                                <Image style = {{height: 40, width: 40, margin: 5 }} source={{uri: 'https://eu.ui-avatars.com/api/?rounded=true&background=f44336&color=ffffff&size=128&name='+comment.firstName+'+'+comment.lastName}} />
                            </View>
                        </View>
                        <View>
                            <View>
                                <Text style={{color: '#000',fontFamily: 'font',fontSize: 16,fontWeight: 'bolder'}}>{comment.firstName+' '+comment.lastName} <Text style={{color: '#414141'}}>{comment.text}</Text></Text>
                                <View style={{margin: 0,padding:0}}>
                                    <Text style={{color: '#808080',fontFamily: 'font',fontSize: 12}}>
                                        <TimeAgo time={comment.createdAt} />
                                        <Text>{likes > 0 ? '       '+likes+'  Likes' : null}</Text>
                                        <Text>      Reply</Text></Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View>
                       <CommentLike id={comment.id} liked={comment.liked} addLike={this.addLike} removeLike={this.removeLike} />
                    </View>
                </View>
                <Divider style={{backgroundColor: '#808080'}}/>
            </View>
        );
    }
}