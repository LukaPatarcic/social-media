import {
    ActivityIndicator, FlatList, Image,
    ImageBackground, PermissionsAndroid,
    StyleSheet,
    Text,
    ToastAndroid,
    View
} from "react-native";
import React from "react";
import AsyncStorage from "@react-native-community/async-storage";
import {BASE_URL} from "../config";
import CameraRoll from "@react-native-community/cameraroll";
import Icon from 'react-native-vector-icons/FontAwesome5'
import {TextInput} from "react-native-paper";
import ImagePicker from 'react-native-image-picker';

export default class AddPost extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            disabled: false,
            visible: false,
            text: '',
            photos: []
        };

        this.sendPost = this.sendPost.bind(this);
    }

    sendPost() {
        const {text} = this.state;
        if(text.trim() < 1) {
            ToastAndroid.show('Please enter a message', ToastAndroid.SHORT);
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
                    this.setState({error: true,loading: false});
                })
        })
    }

    async permission() {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the camera");
            } else {
                console.log("Camera permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    }

    getPhotos() {
        CameraRoll.getPhotos({
            first: 15,
            assetType: 'Photos',
        })
            .then(r => {
                this.setState({photos: r.edges});
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
            title: 'Select Avatar',
            customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
            storageOptions: {
                skipBackup: true,
                path: 'images',
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
                        <Icon onPress={() => this.sendPost()} name={'send'} size={30} color={'#fff'} style={{marginRight: 10}}/>
                    </View>
                    <View style={{marginTop:20}}>
                        <TextInput
                            autoFocus={true}
                            mode={'outlined'}
                            label={'Write something here...'}
                            theme={{ colors: { primary: 'red',underlineColor:'transparent'}}}
                            value={this.state.text}
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
                                    <Text style={{fontFamily: 'font',fontSize: 20}}>Grant permission to see your photos...</Text>
                                </View>
                            }
                            style={{marginTop: 10}}
                            // style={{marginTop: 5}}
                            // ListFooterComponent={hasMore ?
                            //     loadingMore ? <ActivityIndicator size={60} color={'red'} /> : null
                            //     :
                            //     <Text style={{textAlign: 'center',fontFamily: 'font',fontSize: 16,color: '#fff'}}>No more posts...</Text>}
                            // onEndReached={() => this.getPosts(true)}
                            keyExtractor={(contact, index) => String(index)}
                            horizontal={true}
                            renderItem={({item,index}) => {
                                if(index === 0) {
                                    return (
                                        <View
                                            style={{width:100,height:100,backgroundColor: '#fff',flex:1,alignItems:'center',justifyContent: 'center',borderRadius: 5}}

                                        >
                                            <Icon onPress={() => ImagePicker.launchCamera(options, (response) => {
                                                console.log(response);
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
                                                        // Same code as in above section!
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
                                    <Image style={{width:100,height:100,marginHorizontal: 5,borderRadius: 5}} source={{uri: item.node.image.uri}} />
                                )
                            }}
                        />
                    </View>
                    <View style={{marginTop: 30, flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
                        <View style={{width: 300,marginLeft: 10, flex:1, justifyContent:'flex-start',flexDirection:'row'}}>
                            <View style={{width:90, height:90}}>
                                {/*<Button*/}
                                {/*    // title={'Images'}*/}
                                {/*    title={<Icon name={'image'} color={'white'} size={25} />}*/}
                                {/*    buttonStyle={{backgroundColor: 'red'}}*/}
                                {/*    onPress={() => ToastAndroid.show('Photos',ToastAndroid.SHORT)}*/}
                                {/*/>*/}
                            </View>
                            <View style={{width:90,height:100,marginLeft: 20}}>
                                {/*<Button*/}
                                {/*    title={<Icon name={'camera'} color={'white'} size={25} />}*/}
                                {/*    // title={'Camera'}*/}
                                {/*    buttonStyle={{backgroundColor: 'red'}}*/}
                                {/*    onPress={() => ToastAndroid.show('Camera',ToastAndroid.SHORT)}*/}
                                {/*/>*/}
                            </View>
                        </View>
                        <View style={{width: 100}}>
                        </View>
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
});