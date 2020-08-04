import React,{Component} from "react";
import {ActivityIndicator, AsyncStorage, FlatList, ImageBackground, Text, ToastAndroid, View} from "react-native";
import {BASE_URL} from "../config";
import SingleMessageItem from "./SingleMessageItem";
import {IconButton, TextInput} from "react-native-paper";
import {WebsocketContext} from "../context/WebsocketProvider";

export default class MessagesWithUser extends Component{
    static contextType = WebsocketContext;

    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            loading: true,
            refreshing: false,
            sendingMessage: false,
            token: null,
            message: '',
            offset: 0,
            hasMore: true,
            loadingMore: false
        }

        this.sendMessage = this.sendMessage.bind(this);
    }
    componentDidMount() {
        this.getData();
        AsyncStorage.getItem("access-token")
            .then(token => {
                this.setState({token})
            })
        const ws = this.context;

        ws.io.on("message", (message) => {
            this.setState({
                messages: [message,...this.state.messages],
                sendingMessage: false,
            })
        })
    }

    sendMessage() {
        if(this.state.message.trim() == "") {
            ToastAndroid.show("Please enter a message",ToastAndroid.SHORT);
            return;
        }
        if(this.state.message.trim() > 255) {
            ToastAndroid.show('Message too long',ToastAndroid.SHORT)
            return;
        }
        this.setState({sendingMessage: true});
        const ws = this.context;
        const message = {
            "toUser": this.props.route.params.user.id,
            "message": this.state.message
        }
        ws.io.send(message, {"token": this.state.token})
        this.setState({
            message: ''
        })
    }

    getData(more = false) {
        const id = this.props.route.params.user.id;
        const {offset} = this.state;
        if(more) {
            this.setState({loadingMore: true})
        }
        fetch(BASE_URL+`/message?id=${id}&offset=${offset}`)
            .then(response => response.json())
            .then(data => {
                this.setState((prevState) => ({
                    messages: [...prevState.messages,...data],
                    loading: false,
                    loadingMore: false,
                    hasMore: !!data.length,
                    offset: prevState.offset + 20
                }))
            })
            .catch(err => {
                ToastAndroid.show('Oops... Something went wrong!',ToastAndroid.SHORT);
            })
    }

    render() {
        const {messages,loading,sendingMessage,hasMore,loadingMore} = this.state;
        return (
            <ImageBackground
                style={{width: '100%', height: '100%'}}
                source={require('../../assets/images/background-01.png')}
            >
                {loading
                    ?
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        width: '100%',
                        height: '100%'
                    }}>
                        <ActivityIndicator size={70} color="#f00"/>
                    </View>
                    :
                        <>
                        <FlatList
                            inverted={true}
                            data={messages}
                            contentContainerStyle={{display: 'flex'}}
                            style={{marginBottom: 60,padding: 15,paddingTop: 0}}
                            ListEmptyComponent={
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100}}>
                                    <Text style={{fontFamily: 'font', fontSize: 20}}>No messages...</Text>
                                </View>
                            }
                            ListFooterComponent={hasMore ?
                                loadingMore ? <ActivityIndicator size={60} color={'red'} /> : null
                                :
                                <Text style={{textAlign: 'center',fontFamily: 'font',fontSize: 16,color: '#fff'}}>No more messages...</Text>}
                            keyExtractor={(contact, index) => String(index)}
                            renderItem={({item}) => (
                                <SingleMessageItem navigation={this.props.navigation} message={item}/>
                            )}
                            onEndReached={() => this.getData(true)}
                        />
                            <View style={{
                                width: '100%',
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'absolute',
                                bottom: 0,
                                backgroundColor: '#c3c3c3'

                                }}>
                                <View style={{width: '85%'}}>
                                    <TextInput
                                        label='Enter message...'
                                        value={this.state.message}
                                        underlineColor={'#c4c4c4'}
                                        theme={{ fonts: {font: 'font'}, colors: { primary: 'red',underlineColor:'transparent',}}}
                                        onSubmitEditing={this.sendMessage}
                                        returnKeyType={'send'}
                                        blurOnSubmit={false}
                                        style={{fontSize: 16,backgroundColor: '#c4c4c4',height: 54}}
                                        onChangeText={message => this.setState({ message })}
                                    />
                                </View>
                                <View style={{width: '15%'}}>
                                    {sendingMessage ?
                                        <ActivityIndicator color={'red'} size={20} />
                                    :
                                        <IconButton
                                            icon="send"
                                            color={'red'}
                                            size={30}
                                            onPress={this.sendMessage}
                                        />
                                    }

                                </View>
                            </View>
                        </>
            }
            </ImageBackground>
        );
    }
}