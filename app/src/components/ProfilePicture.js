import React,{Component} from "react";
import PhotoUpload from "react-native-photo-upload";
import ImageResizer from "react-native-image-resizer";
import RNFS from "react-native-fs";
import {BASE_URL} from "../config";
import {ActivityIndicator, ToastAndroid} from "react-native";
import {Avatar} from "react-native-paper";
import {formatImage} from "../helpers/functions";

export default class ProfilePicture extends Component{

    constructor(props) {
        super(props);
        this.state = {
            newProfilePicture: '',
            loadingNewProfilePicture: false,
        }
    }


    render() {
        const {newProfilePicture,loadingNewProfilePicture} = this.state;
        const {user,token,isMe} = this.props;
        return (
            <>
            {isMe
                ?
                <PhotoUpload
                    // onStart={() => this.setState({loadingNewProfilePicture: true})}
                    onCancel={() => this.setState({loadingNewProfilePicture: false})}
                    onPhotoSelect={() => this.setState({loadingNewProfilePicture: true})}
                    onResizedImageUri={(image) => {
                        console.log(ImageResizer.createResizedImage(image.uri, 100, 100, 'JPEG', 70)
                            .then(response => {
                                RNFS.readFile(response.path, 'base64')
                                    .then(res =>{
                                        fetch(BASE_URL+'/user/edit/picture',{
                                            headers: {
                                                'Accept': 'application/json',
                                                'Content-Type': 'application/json',
                                                'Authorization': 'Bearer '+token
                                            },
                                            method: "PATCH",
                                            body: JSON.stringify({image: res})
                                        })
                                            .then(response => response.json())
                                            .then(data => {
                                                if(data.error) {
                                                    ToastAndroid.show("Oops... Something went wrong while processing your image",ToastAndroid.SHORT);
                                                    this.setState({loadingNewProfilePicture: false})
                                                } else {
                                                    ToastAndroid.show("Profile picture changed",ToastAndroid.SHORT);
                                                    this.setState({newProfilePicture: res,loadingNewProfilePicture: false})
                                                }
                                            })
                                            .catch(err => {
                                                ToastAndroid.show("Oops... Something went wrong while processing your image",ToastAndroid.SHORT);
                                                this.setState({loadingNewProfilePicture: false})
                                            })
                                    });
                            })
                            .catch(err => {
                                ToastAndroid.show("Oops... Something went wrong while processing your image",ToastAndroid.SHORT);
                            }));
                    }}
                    onError={() => {
                        ToastAndroid.show("Oops... Something went wrong while processing your image",ToastAndroid.SHORT);
                    }}
                >
                    {loadingNewProfilePicture ?
                        <ActivityIndicator color={'red'} size={30} />
                        :
                        <Avatar.Image
                            size={50}
                            source={{uri: newProfilePicture ? `data:image/jpeg;base64,${newProfilePicture}` : formatImage(user.profilePicture,user.firstName,user.lastName)}}/>
                    }
                </PhotoUpload>
                :
                (loadingNewProfilePicture ?
                        <ActivityIndicator color={'red'} size={30} />
                        :
                        <Avatar.Image
                            size={50}
                            source={{uri: newProfilePicture ? `data:image/jpeg;base64,${newProfilePicture}` : formatImage(user.profilePicture,user.firstName,user.lastName)}}/>
                )
            }
            </>
        );
    }
}