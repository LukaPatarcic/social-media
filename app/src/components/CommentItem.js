import {ActivityIndicator, Image, Text, ToastAndroid, View} from "react-native";
import TimeAgo from "react-native-timeago";
import {Divider, IconButton, Paragraph, Portal, Dialog} from "react-native-paper";
import React from "react";
import AsyncStorage from "@react-native-community/async-storage";
import {BASE_URL} from "../config";
import SubCommentItem from "./SubCommentItem";
import {formatImage} from "../helpers/functions";

export default class CommentItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: props.comment,
            loading:false,
            hasMore: props.comment.subCommentCount > 0,
            offset: 0,
            id: null,
            visible: false
        };

        this.handleLike = this.handleLike.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.getSubComments = this.getSubComments.bind(this);
    }

    componentDidMount() {
        AsyncStorage.getItem('id',(err,val) => {
            this.setState({id: val})
        })
    }

    handleDelete(shouldDelete = false) {
        const {id,comment} = this.state;
        if(id == comment.userId) {
            this.setState({visible: true})
            if(shouldDelete) {
                AsyncStorage.getItem('access-token',(err,val) => {
                    fetch(BASE_URL+'/comment/'+comment.id,{
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + val
                        },
                        method: 'DELETE'
                    })
                        .then(response => response.json())
                        .then(data => {
                            this.setState({visible: false})
                            this.props.removeComment(comment.id);
                        })
                        .catch(err => {
                            console.log(err);
                            ToastAndroid.show("Oops something went wrong...",ToastAndroid.SHORT);
                        })
                })

            }
        }
    }

    handleLike() {
        const {liked,id} = this.state.comment;
        AsyncStorage.getItem('access-token', (err, val) => {
            fetch(BASE_URL + '/comment/like', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + val
                },
                method: liked ? 'DELETE' : 'POST',
                body: JSON.stringify({id})
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        let comment = {...this.state.comment};
                        comment.liked = !this.state.comment.liked;
                        comment.likes = this.state.comment.liked ? this.state.comment.likes-1 : this.state.comment.likes+1;
                        this.setState({comment: comment});
                        this.props.updateComment(comment,this.props.index);
                    }
                })
        })
    }

    getSubComments() {
        const {comment,offset,hasMore} = this.state;

        if(!hasMore)
            return;

        this.setState({loading: true});
        AsyncStorage.getItem('access-token', (err, val) => {
            fetch(BASE_URL + '/subcomment/'+comment.id+'?offset='+offset, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + val
                },
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => {
                    this.setState((prevState) => ({
                        loading: false,
                        comment: {...prevState.comment,subComments: [...prevState.comment.subComments,...data]},
                        offset: prevState.offset+3,
                        hasMore: data.length === 3
                    }),() => {
                        this.props.updateComment(this.state.comment,this.props.index);
                    })

                })
        })
    }

    render() {
        const {comment,loading,hasMore,visible} = this.state;

        return (
            <View style={{marginBottom: 10}}>
                <Portal>
                    <Dialog visible={visible} onDismiss={() => this.setState({visible: false})}>
                        <Dialog.Content>
                            <Paragraph onPress={() => this.handleDelete(true)}>Delete</Paragraph>
                        </Dialog.Content>
                    </Dialog>
                </Portal>
                <View style={{flex: 1,flexDirection:'row',marginBottom: 10,justifyContent:'space-between'}}>
                    <View style={{flexDirection:'row',alignItems: 'flex-start',justifyContent: 'flex-start'}}>
                        <View>
                            <View>
                                <Image style = {{height: 40, width: 40, margin: 5, borderRadius: 20,overflow: 'hidden'}} source={{uri: formatImage(comment.profilePicture,comment.firstName,comment.lastName)}} />
                            </View>
                        </View>
                        <View>
                            <View>
                                <Text onLongPress={() => this.handleDelete()} style={{color: '#000',fontFamily: 'font',fontSize: 16,fontWeight: 'bolder'}}>{comment.profileName} <Text style={{color: '#414141'}}>{comment.text}</Text></Text>
                                <View style={{margin: 0,padding:0}}>
                                    <Text style={{color: '#808080',fontFamily: 'font',fontSize: 12}}>
                                        <TimeAgo time={comment.createdAt} />
                                        <Text>{comment.likes > 0 ? '       '+comment.likes+'  Likes' : null}</Text>
                                        <Text onPress={() => this.props.setReplyTo({id:comment.id,profileName:comment.profileName})}>      Reply</Text></Text>
                                </View>
                                {comment.subComments.map((comment,index) => <SubCommentItem removeSubComment={this.props.removeSubComment} comment={comment} key={index} />)
                                }
                                {loading ? <ActivityIndicator color={'red'} size={'small'} /> : hasMore ? <Text style={{fontFamily: 'font',color: '#a3a3a3'}} onPress={this.getSubComments}>+ show more replies...</Text> : null}
                            </View>
                        </View>
                    </View>
                    <View>
                        <IconButton
                            icon={comment.liked ? 'heart' : 'heart-outline'}
                            color={'red'}
                            size={27}
                            onPress={this.handleLike}
                        />
                    </View>
                </View>
                <Divider style={{backgroundColor: '#808080'}}/>
            </View>
        );
    }
}