import {
    ActivityIndicator, FlatList, Image,
    ImageBackground, PermissionsAndroid,
    StyleSheet,
    Text,
    ToastAndroid, TouchableOpacity, TouchableWithoutFeedback,
    View
} from "react-native";
import React from "react";
import AsyncStorage from "@react-native-community/async-storage";
import {BASE_URL} from "../config";
import CameraRoll from "@react-native-community/cameraroll";
import Icon from 'react-native-vector-icons/FontAwesome5'
import {TextInput} from "react-native-paper";
import ImagePicker from 'react-native-image-picker';
import RNFS from "react-native-fs";
import { v4 as uuidv4 } from 'uuid';
import ImageOverlay from "react-native-image-overlay";

export default class AddPost extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            disabled: false,
            visible: false,
            text: '',
            photos: [],
            photosForUpload: []
        };

        this.sendPost = this.sendPost.bind(this);
    }

    sendPost() {
        const {text} = this.state;
        if(text.trim() < 1) {
            ToastAndroid.show('Please enter a message', ToastAndroid.SHORT);
            return;
        }
        if(text.trim() > 255) {
            ToastAndroid.show('Message too long', ToastAndroid.SHORT);
            return;
        }
        AsyncStorage.getItem('access-token', (err, val) => {
            this.setState({loading: true});
            fetch(BASE_URL+'/post',{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ val
                },
                method: "POST",
                body: JSON.stringify({text})
            })
                .then((response => response.json()))
                .then((data => {
                    this.setState({loading: false, text: ''});
                    ToastAndroid.show('Post sent to timeline',ToastAndroid.SHORT);
                }))
                .catch(err => {
                    ToastAndroid.show('Oops something went wrong while posting to your timeline',ToastAndroid.SHORT);
                    this.setState({error: true,loading: false});
                })
        })
    }

    async permission() {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            } else {
                ToastAndroid.show("Camera permission denied",ToastAndroid.SHORT);
            }
        } catch (err) {
            ToastAndroid.show("An error occurred while retrieving photos",ToastAndroid.SHORT);
        }
    }

    getPhotos() {
        CameraRoll.getPhotos({
            first: 15,
            assetType: 'Photos',
        })
            .then(response => {
                let imagesArray = [];
                response.edges.map((image,index) => {
                    RNFS.readFile(image.node.image.uri, 'base64')
                        .then(res =>{
                            imagesArray.push({selected: false,image:res,id: index})
                        })
                        .catch(err => {})
                });
                this.setState({photos: imagesArray});
            })
            .catch((err) => {
                ToastAndroid.show('Something went wrong while loading images...',ToastAndroid.SHORT);
            });
    }
    async componentDidMount() {
        await this.permission();
        this.getPhotos()
    }

    render() {
        const options = {
            title: null,
            mediaType: 'photo',
            quality: 0.8,
            storageOptions: {
                skipBackup: false,
                path: null,
            },
        };

        const {text,loading,photos} = this.state;
        return (
            <ImageBackground
                style={{width: '100%', height: '100%'}}
                source={require('../../assets/images/background-01.png')}
            >
                <View style={{flex:1}}>
                    <View style={{justifyContent: 'space-between',flexDirection:'row',marginTop:10}}>
                        <Icon name={'times'} style={{marginLeft: 10}} size={25} color={'#fff'}  onPress={ () => this.props.navigation.navigate('Feed') } />
                        {loading ?
                            <ActivityIndicator color={'red'} size={40} style={{marginRight: 10}} />
                            :
                            <Icon onPress={() => this.sendPost()} name={'paper-plane'} size={30} color={'#fff'} style={{marginRight: 10}}/>
                        }
                    </View>
                    <View style={{marginTop:20}}>
                        <TextInput
                            autoFocus={true}
                            mode={'outlined'}
                            label={'Write something here...'}
                            theme={{ colors: { primary: 'red',underlineColor:'transparent'}}}
                            value={text}
                            blurOnSubmit={false}
                            multiline={true}
                            numberOfLines={7}
                            autoCapitalize={'sentences'}
                            placeholderTextColor={'white'}
                            spellCheck={true}
                            maxLength={180}
                            onSubmitEditing={this.sendPost}
                            style={{fontSize: 20, fontFamily: 'font',color: 'white',borderBottomColor:'red',borderBottomWidth: 2}}
                            onChangeText={(text) => {
                                if(text.length >= 180) {
                                    ToastAndroid.show('Maximum amount of characters is 180', ToastAndroid.SHORT)
                                } else {
                                    this.setState({ text })
                                }
                            }}
                        />
                    </View>
                    <View>
                        <FlatList
                            data={photos}
                            ListEmptyComponent={
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',marginTop: 100}}>
                                    <Text style={{fontFamily: 'font',fontSize: 20,color:'white',textAlign: 'center'}}>Grant permission to see your photos...</Text>
                                </View>
                            }
                            keyboardDismissMode={'none'}
                            keyboardShouldPersistTaps={'always'}
                            style={{marginTop: 10}}
                            keyExtractor={(contact, index) => String(index)}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({item,index}) => {
                                if(index === 0) {
                                    return (
                                        <View
                                            style={{width:100,height:100,backgroundColor: '#fff',flex:1,alignItems:'center',justifyContent: 'center',borderRadius: 5}}

                                        >
                                            <Icon
                                                onPress={() => ImagePicker.launchCamera(options, (response) => {
                                                    this.setState((prevState) => ({
                                                        photos: [{selected:true,image: response.data},...prevState.photos]
                                                    }))
                                                })}
                                                name={'camera'}
                                                size={30}
                                                color={'red'}
                                            />
                                        </View>
                                    )

                                }

                                if(index === photos.length-1) {
                                    return (
                                        <View style={{width:100,height:100,backgroundColor: '#fff',flex:1,alignItems:'center',justifyContent: 'center',borderRadius: 5}}>
                                            <Icon
                                                onPress={() => {
                                                    ImagePicker.launchImageLibrary(options, (response) => {
                                                        this.setState((prevState) => ({
                                                            photos: [{selected:true,image: response.data,id: prevState.photos.length},...prevState.photos]
                                                        }))
                                                    });
                                                }}
                                                name={'images'}
                                                size={30}
                                                color={'red'}
                                            />
                                        </View>
                                    )
                                }

                                return (
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPress={() => {this.setState((prevState) => {
                                            var photos = [];
                                            prevState.photos.filter((photo) => {
                                                if(photo.id === item.id) {
                                                    if(!photo.selected) {
                                                        photos = [...prevState.photosForUpload,photo.image];
                                                    } else {
                                                        photos = prevState.photosForUpload.filter((image) => image !== photo.image)
                                                    }
                                                    photo.selected = !photo.selected;
                                                }
                                                return photo;
                                            })
                                            console.log(photos.length);
                                            return {
                                                photos: prevState.photos,
                                                photosForUpload: photos
                                            }
                                        })}}
                                    >
                                        <ImageOverlay
                                            onPress={() => console.log('pressed')}
                                            containerStyle={{width: 100,height:100,marginHorizontal: 5,borderRadius: 5}}
                                            source={{uri: 'data:image/jpeg;base64,'+item.image}}
                                            style={{width:100,height:100}}
                                            overlayColor={item.selected ? 'red' : null}
                                            overlayAlpha={0.5}
                                            contentPosition="center"
                                            title={item.selected ? <Icon name={'check'} color={'white'} size={30} /> : null}
                                        >
                                        </ImageOverlay>
                                    </TouchableOpacity>
                                )
                            }}
                        />
                    </View>
                </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 70,
        alignItems: 'center',
        justifyContent: 'flex-start',
        shadowOffset:{  width: 10,  height: 10,  },
        shadowColor: 'black',
        shadowOpacity: 1.0,
    },
    fab: {
        position: 'absolute',
        backgroundColor: 'grey',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    fabAdd: {
        backgroundColor: 'red',
    }
})