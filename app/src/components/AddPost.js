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
import {Card, TextInput} from "react-native-paper";
import ImagePicker from 'react-native-image-picker';
import RNFS from "react-native-fs";
import ImageOverlay from "react-native-image-overlay";

export default class AddPost extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            loadingPhotos: false,
            errorPhotos: false,
            disabled: false,
            visible: false,
            text: '',
            photos: [],
            photosForUpload: []
        };

        this.sendPost = this.sendPost.bind(this);
    }

    sendPost() {
        const {text,photosForUpload,photos} = this.state;
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
                body: JSON.stringify({text,images: photosForUpload})
            })
                .then((response => response.json()))
                .then((data => {
                    this.setState({loading: false, text: ''});
                    ToastAndroid.show('Post sent to timeline',ToastAndroid.SHORT);
                    this.setState({
                        photos: photos.map(photo => {
                            photo.selected = false;
                            return photo;
                        })
                    });
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
                this.getPhotos();
            } else {
                ToastAndroid.show("Camera permission denied",ToastAndroid.SHORT);
            }
        } catch (err) {
            ToastAndroid.show("An error occurred while retrieving photos",ToastAndroid.SHORT);
        }
    }

    getPhotos() {
        this.setState({loadingPhotos: true});
        CameraRoll.getPhotos({
            first: 10,
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
                this.setState({errorPhotos: true});
                ToastAndroid.show('Something went wrong while loading images...',ToastAndroid.SHORT);
            })
            .finally(() => {
                this.setState({loadingPhotos: false})
            })
    }
    async componentDidMount() {
        await this.permission();
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

        const {text,loading,photos,loadingPhotos,errorPhotos} = this.state;
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
                    <Card style={{padding: 1,marginTop: 5,marginHorizontal: 5}}>
                        <Card.Content style={{padding: 1}}>
                            <TextInput
                                autoFocus={true}
                                mode={''}
                                label={'Write something here...'}
                                theme={{ colors: { primary: 'red',underlineColor:'transparent'}}}
                                value={text}
                                blurOnSubmit={false}
                                multiline={true}
                                numberOfLines={5}
                                autoCapitalize={'sentences'}
                                placeholderTextColor={'white'}
                                spellCheck={true}
                                maxLength={180}
                                onSubmitEditing={this.sendPost}
                                style={{fontSize: 20, fontFamily: 'font',color: 'white',borderBottomColor:'red'}}
                                onChangeText={(text) => {
                                    if(text.length >= 180) {
                                        ToastAndroid.show('Maximum amount of characters is 180', ToastAndroid.SHORT)
                                    } else {
                                        this.setState({ text })
                                    }
                                }}
                            />
                        </Card.Content>
                    </Card>

                    <View style={{marginVertical: 5}}>
                        {loadingPhotos ?
                            <View>
                                <ActivityIndicator color={'red'} size={50}/>
                            </View>
                            :
                            <FlatList
                                data={photos}
                                keyboardDismissMode={'none'}
                                keyboardShouldPersistTaps={'always'}
                                style={{marginTop: 10}}
                                keyExtractor={(contact, index) => String(index)}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                ListHeaderComponent={() => (
                                    <View
                                        style={{
                                            width: 100,
                                            height: 100,
                                            backgroundColor: '#fff',
                                            flex: 1,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 5
                                        }}

                                    >
                                        <Icon
                                            onPress={() => ImagePicker.launchCamera(options, (response) => {
                                                if (response.didCancel) {
                                                    //nothing
                                                } else if (response.error) {
                                                    ToastAndroid.show("Something went wrong while taking a picture...", ToastAndroid.SHORT);
                                                } else if (response.customButton) {
                                                    //nothing
                                                } else {
                                                    this.setState((prevState) => ({
                                                        photos: [{
                                                            id: prevState.photos.length,
                                                            selected: true,
                                                            image: response.data
                                                        }, ...prevState.photos],
                                                        photosForUpload: [response.data,...prevState.photosForUpload]
                                                    }))
                                                }
                                            })}
                                            name={'camera'}
                                            size={30}
                                            color={'red'}
                                        />
                                    </View>
                                )}
                                ListFooterComponent={() => (
                                    <View style={{
                                        width: 100,
                                        height: 100,
                                        backgroundColor: '#fff',
                                        flex: 1,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 5
                                    }}>
                                        <Icon
                                            name={'images'}
                                            size={30}
                                            color={'red'}
                                            onPress={() => {
                                                ImagePicker.launchImageLibrary(options, (response) => {
                                                    if (response.didCancel) {
                                                        //nothing
                                                    } else if (response.error) {
                                                        ToastAndroid.show("Something went wrong while selecting your image...", ToastAndroid.SHORT);
                                                    } else if (response.customButton) {
                                                        //nothing
                                                    } else {
                                                        this.setState((prevState) => ({
                                                            photos: [{
                                                                selected: true,
                                                                image: response.data,
                                                                id: prevState.photos.length
                                                            }, ...prevState.photos],
                                                            photosForUpload: [response.data,...prevState.photosForUpload]
                                                        }))
                                                    }
                                                });
                                            }}
                                        />
                                    </View>
                                )}
                                renderItem={({item, index}) => (
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPress={() => {
                                            this.setState((prevState) => {
                                                var photos = [];
                                                prevState.photos.filter((photo) => {
                                                    if (photo.id === item.id) {
                                                        if (!photo.selected) {
                                                            photos = [...prevState.photosForUpload, photo.image];
                                                        } else {
                                                            photos = prevState.photosForUpload.filter((image) => image !== photo.image)
                                                        }
                                                        photo.selected = !photo.selected;
                                                    }
                                                    return photo;
                                                })
                                                return {
                                                    photos: prevState.photos,
                                                    photosForUpload: photos
                                                }
                                            })
                                        }}
                                    >
                                        <ImageOverlay
                                            onPress={() => console.log('pressed')}
                                            containerStyle={{
                                                width: 100,
                                                height: 100,
                                                marginHorizontal: 5,
                                                borderRadius: 5
                                            }}
                                            source={{uri: 'data:image/jpeg;base64,' + item.image}}
                                            style={{width: 100, height: 100}}
                                            overlayColor={item.selected ? 'red' : null}
                                            overlayAlpha={0.5}
                                            contentPosition="center"
                                            title={item.selected ?
                                                <Icon name={'check'} color={'white'} size={30}/> : null}
                                        >
                                        </ImageOverlay>
                                    </TouchableOpacity>
                                )}
                            />
                        }
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