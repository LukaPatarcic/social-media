import React from "react";
import {IconButton} from "react-native-paper";
import {BASE_URL} from "../config";
import AsyncStorage from "@react-native-community/async-storage";

export default class CommentLike extends React.Component {

    constructor(props) {
        super(props);
        const {liked} = this.props;
        this.state = {
            liked: liked
        }

        this.handleLike = this.handleLike.bind(this);
    }

    handleLike() {
        const {liked} = this.state;
        AsyncStorage.getItem('access-token', (err, val) => {
            fetch(BASE_URL + '/comment/like', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + val
                },
                method: liked ? 'DELETE' : 'POST',
                body: JSON.stringify({id: this.props.id})
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        this.setState({liked: !this.state.liked}, () => {
                            this.state.liked ?
                                this.props.addLike()
                                :
                                this.props.removeLike()
                        })

                    }
                })
        })
    }

    render() {
        const {liked} = this.state;
        return (
            <IconButton
                icon={liked ? 'heart' : 'heart-outline'}
                color={'red'}
                size={27}
                onPress={this.handleLike}
            />
        )
    }
}