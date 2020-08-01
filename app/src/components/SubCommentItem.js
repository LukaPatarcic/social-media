import {Image, Text, ToastAndroid, View} from "react-native";
import TimeAgo from "react-native-timeago";
import React from "react";
import {formatImage} from "../helpers/functions";
import {Dialog, Paragraph, Portal} from "react-native-paper";
import AsyncStorage from "@react-native-community/async-storage";
import {BASE_URL} from "../config";

export default class SubCommentItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: props.comment,
            visible: false
        };

        this.handleDelete = this.handleDelete.bind(this);
    }

    handleDelete(shouldDelete = false) {
        const {comment} = this.state;
        AsyncStorage.getItem('id', (err,val) => {
            if(val == comment.userId) {
                this.setState({visible: true})
                if(shouldDelete) {
                    AsyncStorage.getItem('access-token',(err,val) => {
                        fetch(BASE_URL+'/subcomment/'+comment.id,{
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
                                this.props.removeSubComment(comment.id);
                            })
                            .catch(err => {
                                console.log(err);
                                ToastAndroid.show("Oops something went wrong...",ToastAndroid.SHORT);
                            })
                    })

                }
            }
        })
    }


    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.comment!==prevState.comment){
            return { comment: nextProps.comment};
        }
        else return null;
    }

    render() {
        const {comment,visible} = this.state;
        return (
            <View style={{marginLeft: 15}}>
                <Portal>
                    <Dialog visible={visible} onDismiss={() => this.setState({visible: false})}>
                        <Dialog.Content>
                            <Paragraph onPress={() => this.handleDelete(true)}>Delete</Paragraph>
                        </Dialog.Content>
                    </Dialog>
                </Portal>
                <View style={{flexDirection:'row',alignItems: 'flex-start',justifyContent: 'flex-start'}}>
                    <View>
                        <View>
                            <Image style = {{height: 40, width: 40, margin: 5, borderRadius: 20,overflow: 'hidden' }} source={{uri: formatImage(comment.profilePicture,comment.firstName,comment.lastName)}} />
                        </View>
                    </View>
                    <View>
                        <View>
                            <Text style={{color: '#000',fontFamily: 'font',fontSize: 16,fontWeight: 'bolder'}}>{comment.firstName+' '+comment.lastName} <Text onLongPress={() => this.handleDelete(false)} style={{color: '#414141'}}>{comment.text}</Text></Text>
                            <View style={{margin: 0,padding:0}}>
                                <Text style={{color: '#808080',fontFamily: 'font',fontSize: 12}}>
                                    <TimeAgo time={comment.createdAt} />
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}