import React,{Component} from "react";
import {ActivityIndicator, FlatList, ImageBackground, Text, View} from "react-native";
import {BASE_URL} from "../config";
import SingleMessageItem from "./SingleMessageItem";
import {IconButton, TextInput} from "react-native-paper";

export default class MessagesWithUser extends Component{
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            loading: true,
            refreshing: false
        }
    }
    componentDidMount() {
        this.getData();
    }

    getData() {
        const id = this.props.route.params.user.id;
        fetch(BASE_URL+'/message?id='+id)
            .then(response => response.json())
            .then(data => {
                this.setState({messages: data,loading: false})
            })
            .catch(err => {
                console.log(err);
            })
    }

    render() {
        const {messages,loading} = this.state;
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
                            keyExtractor={(contact, index) => String(index)}
                            renderItem={({item}) => (
                                <SingleMessageItem navigation={this.props.navigation} message={item}/>
                            )}/>
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
                                        value={this.state.text}
                                        underlineColor={'#c4c4c4'}
                                        theme={{ fonts: {font: 'font'}, colors: { primary: 'red',underlineColor:'transparent',}}}
                                        onSubmitEditing={this.handleSubmit}
                                        returnKeyType={'send'}
                                        blurOnSubmit={false}
                                        style={{fontSize: 16,backgroundColor: '#c4c4c4',height: 54}}
                                        onChangeText={text => this.setState({ text })}
                                    />
                                </View>
                                <View style={{width: '15%'}}>
                                    {loading ?
                                        <ActivityIndicator color={'#f00'} size={25} />
                                        :
                                        <IconButton
                                            icon="send"
                                            color={'red'}
                                            size={30}
                                            onPress={this.handleSubmit}
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