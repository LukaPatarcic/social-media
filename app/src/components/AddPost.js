import {
    ActivityIndicator,
    ImageBackground,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    View
} from "react-native";
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
                        ToastAndroid.show('Post sent to timeline',ToastAndroid.SHORT);
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
        const {visible,text,loading} = this.state;
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
                                    onChangeText={(text) => {
                                        if(text.length >= 180) {
                                            ToastAndroid.show('Maximum amount of characters is 180', ToastAndroid.SHORT)
                                        } else {
                                            this.setState({ text })
                                        }
                                    }}
                                />
                            </View>
                            <View style={{marginTop: 30, flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
                                <View style={{width: 300,marginLeft: 10, flex:1, justifyContent:'flex-start',flexDirection:'row'}}>
                                    <View style={{width:90, height:90}}>
                                        <Button
                                            // title={'Images'}
                                            title={<Icon name={'image'} color={'white'} size={25} />}
                                            buttonStyle={{backgroundColor: 'red'}}
                                            onPress={() => ToastAndroid.show('Photos',ToastAndroid.SHORT)}
                                        />
                                    </View>
                                    <View style={{width:90,height:100,marginLeft: 20}}>
                                        <Button
                                            title={<Icon name={'camera'} color={'white'} size={25} />}
                                            // title={'Camera'}
                                            buttonStyle={{backgroundColor: 'red'}}
                                            onPress={() => ToastAndroid.show('Camera',ToastAndroid.SHORT)}
                                        />
                                    </View>
                                </View>
                                <View style={{width: 100}}>
                                    <TouchableOpacity
                                        onPress={this.sendPost.bind(this)}
                                        activeOpacity={0.8}
                                        disabled={(!!(text.length > 180 || text.length < 1))}
                                        style={{
                                            borderWidth:1,
                                            alignItems:'center',
                                            justifyContent:'center',
                                            width:55,
                                            height:55,
                                            backgroundColor:'grey',
                                            borderRadius:50,
                                        }}
                                    >
                                        {loading
                                            ?
                                            <ActivityIndicator size={"small"} color={'white'} />
                                            :
                                            (!!(text.length > 180 || text.length < 1)) ?
                                                <Icon name={'times'} color={'white'} size={25} />
                                                :
                                                <Icon name={'plus'} color={'white'} size={25}/>
                                        }
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
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