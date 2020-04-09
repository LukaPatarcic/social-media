import React from "react";
import {IconButton} from "react-native-paper";
import AsyncStorage from "@react-native-community/async-storage";
import {BASE_URL} from "../config";

export default class LikeButton extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            heartClicked: false,
        }

    }

    componentDidMount() {
        this.setState({heartClicked: !this.props.liked})
    }

    handleLike() {
        AsyncStorage.getItem('access-token', (err, val) => {
            if (!val) {
                this.props.history.push('/login');
            } else {
                fetch(BASE_URL+'/like/post',{
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+ val
                    },
                    method: this.state.heartClicked ? 'POST' : 'DELETE',
                    body: JSON.stringify({id: this.props.postId})
                })
                    .then((response => response.json()))
                    .then((data => {
                        if(!data.error) {
                            this.props.handleLikes(this.state.heartClicked);
                            this.setState((prevState) => ({heartClicked: !prevState.heartClicked}))
                        }
                    }))
            }
        })
    }


    render() {
        const {heartClicked} = this.state;

        return (
            <IconButton
                icon={heartClicked ? 'heart-outline' : 'heart'}
                color={'red'}
                size={30}
                onPress={this.handleLike.bind(this)}
            />
        );
    }
}

// <MDBTooltip>
//     <MDBBtn color={'white'} block={true} style={{boxShadow: 'none'}} onClick={this.handleLike.bind(this)}>
//         <MDBIcon className={'text-danger'} far={heartClicked} icon={'heart'} size={'2x'}/><br/>
//     </MDBBtn>
//     <div>{heartClicked ? 'Like':'Liked'}</div>
// </MDBTooltip>