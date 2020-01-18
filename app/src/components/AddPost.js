import {ImageBackground, Modal, StyleSheet, Text, TextInput, ToastAndroid, View} from "react-native";
import {Button} from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import {FAB} from "react-native-paper";
import React from "react";
import AsyncStorage from "@react-native-community/async-storage";

export default class AddPost extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            loading: false,
            disabled: false,
            visible: false,
            token: null,
            text: ''
        }
    }

    sendPost() {
        console.log('here')
        AsyncStorage.getItem('access-token', (err, val) => {
            if(!val) {
              this.props.history.push('/login');
            }  else {
                this.setState({loading: true})
                fetch('https://api.allshak.lukaku.tech/post',{
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-AUTH-TOKEN': val
                    },
                    method: "POST",
                    body: JSON.stringify({text: this.state.text})
                })
                    .then((response => response.json()))
                    .then((data => {
                        this.setState({loading: false, text: ''});
                    }))
                    .catch(err => {
                        this.setState({error: true,loading: false});
                    })
            }
        })
    }

    _showModal = () => this.setState({ visible: true });
    _hideModal = () => this.setState({ visible: false });

    render() {
        const {visible} = this.state;
        return (
            <>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={visible}
                    onRequestClose={this._hideModal}
                >
                    <ImageBackground
                        style={{width: '100%', height: '100%',zIndex: -1,resizeMode: 'cover'}}
                        source={{uri: 'https://allshak.lukaku.tech/images/background.png'}}>
                        <View>
                            <View style={{marginTop: 30}}>
                                <Text style={{color: 'white',fontSize: 24,fontFamily: 'font'}}>What's on your mind..</Text>
                                <TextInput
                                    mode={'flat'}
                                    placeholder={'Write something here...'}
                                    multiline={true}
                                    numberOfLines={8}
                                    value={this.state.text}
                                    autoCapitalize={'sentences'}
                                    placeholderTextColor={'white'}
                                    spellCheck={true}
                                    maxLength={180}
                                    style={{fontSize: 20, fontFamily: 'font',color: 'white',borderBottomColor:'red',borderBottomWidth: 2}}
                                    onChangeText={text => this.setState({ text })}
                                />
                            </View>
                            <View style={{marginTop: 30, flex: 1, justifyContent: 'flex-start', flexDirection: 'row'}}>
                                <View style={{width:90,height:100}}>
                                    <Button
                                        title={'Images'}
                                        // title={<Icon name={'image'} color={'white'} size={35} />}
                                        buttonStyle={{backgroundColor: 'red'}}
                                        onPress={() => ToastAndroid.show('Photos',ToastAndroid.SHORT)}
                                    />
                                </View>
                                <View style={{width:90,height:100,marginLeft: 20}}>
                                    <Button
                                        // title={<Icon name={'camera'} color={'white'} size={35} />}
                                        title={'Camera'}
                                        buttonStyle={{backgroundColor: 'red'}}
                                        onPress={() => ToastAndroid.show('Camera',ToastAndroid.SHORT)}
                                    />
                                </View>
                            </View>
                        </View>
                        <FAB
                            style={Object.assign({},styles.fab,styles.fabAdd)}
                            icon="plus"
                            color={'white'}
                            onPress={() => this.sendPost.bind(this)}
                        />
                    </ImageBackground>
                </Modal>
                <FAB
                    style={styles.fab}
                    icon="pencil"
                    color={'white'}
                    onPress={this._showModal}
                />
            </>
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