import {Image, Text, View} from "react-native";
import TimeAgo from "react-native-timeago";
import React from "react";
import {formatImage} from "../helpers/functions";

export default class SubCommentItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: props.comment,
        };
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.comment!==prevState.comment){
            return { comment: nextProps.comment};
        }
        else return null;
    }

    render() {
        const {comment} = this.state;
        return (
            <View style={{marginLeft: 15}}>
                <View style={{flexDirection:'row',alignItems: 'flex-start',justifyContent: 'flex-start'}}>
                    <View>
                        <View>
                            <Image style = {{height: 40, width: 40, margin: 5, borderRadius: 20,overflow: 'hidden' }} source={{uri: formatImage(comment.profilePicture,comment.firstName,comment.lastName)}} />
                        </View>
                    </View>
                    <View>
                        <View>
                            <Text style={{color: '#000',fontFamily: 'font',fontSize: 16,fontWeight: 'bolder'}}>{comment.firstName+' '+comment.lastName} <Text style={{color: '#414141'}}>{comment.text}</Text></Text>
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