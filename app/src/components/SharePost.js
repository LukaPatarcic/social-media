import {Card, IconButton} from "react-native-paper";
import React from "react";
import {Share} from "react-native";
import {WEB_URL} from "../config";

export default class SharePost extends React.Component {
    constructor(props) {
        super(props);

        this.handleShare = this.handleShare.bind(this);
    }

    handleShare() {
        const {id} = this.props;
        Share.share({
            message:WEB_URL+'/post/'+id,
        }).then((e) => console.log(e))
    }
    render() {
        return (
            <IconButton
                icon="share"
                color={'grey'}
                size={30}
                onPress={this.handleShare}
            />
        );
    }
}