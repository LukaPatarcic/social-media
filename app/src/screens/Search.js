import React from 'react';
import {
    View,
    StyleSheet,
    ImageBackground,
    ScrollView,
    ActivityIndicator,
    FlatList,
    ToastAndroid,
    InteractionManager,
} from 'react-native';
import { Text } from 'native-base';
import { Searchbar } from 'react-native-paper';
import AsyncStorage from "@react-native-community/async-storage";
import SendFriendRequest from "../components/SendFriendRequest";
import {BASE_URL} from "../config";
import Icon from "react-native-vector-icons/FontAwesome5";
import {debounce} from 'lodash';

export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            q: '',
            loading: false,
            loadingButton: false,
            error: '',
            token: null,
            searchQuery: []
        };

        this.getFriends = debounce(this.getFriends,400);
        this.sendFriendRequestChangeState = this.sendFriendRequestChangeState.bind(this);
        this.searchBar = React.createRef(null);
    }

    componentDidMount() {
        AsyncStorage.getItem('access-token', (err, val) => {
            this.setState({token: val})
        });

        InteractionManager.runAfterInteractions(() => {
            this.searchBar.current.focus()
        });
    }

    getFriends() {
        const {q,token} = this.state;
        const controller = new AbortController();
        const signal = controller.signal;
        if(q.length < 1) {
            this.setState({searchQuery: []})
            return;
        }
        this.setState({loading:true});

        fetch(BASE_URL+'/search?search='+q,{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            },
            signal: signal,
            method: "GET",
        })
            .then((response =>response.json()))
            .then((data => {
                this.setState({searchQuery: data,loading: false});

                if(data) {
                    this.setState({error: ''});
                } else {
                    this.setState({error: 'No Results...'});
                }


            }))
            .catch(err => {
                this.setState({error: 'Oops... Something went wrong!',loading: false});
                ToastAndroid.show('Oops... Something went wrong!', ToastAndroid.SHORT);
            })
    }

    sendFriendRequestChangeState(id) {
        this.setState((prevState) => {
            prevState.searchQuery.filter((friend,index) => {
                if(friend.id == id) {
                    friend.requested = true;
                    return friend;
                }

                return friend;
            })
            return {searchQuery: prevState.searchQuery}
        })
    }

    updateSearch(q) {
        this.setState({ q },() => this.getFriends());
    };

    render() {
        const {q,searchQuery,loading,token} = this.state;
        const {message,navigation} = this.props
        return (
            <ImageBackground
                style={{width: '100%', height: '100%'}}
                source={require('../../assets/images/background-01.png')}
            >
                <View style={{backgroundColor: '#fff'}}>
                    <Searchbar
                        ref={this.searchBar}
                        inputStyle={{fontFamily: 'font'}}
                        placeholder="Search"
                        onChangeText={this.updateSearch.bind(this)}
                        value={q}
                        icon={() => <Icon name={'search'} color={'red'} size={25} />}
                        onIconPress={this.getFriends.bind(this)}
                    />
                </View>
                    {loading ?
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',position: 'absolute', width: '100%', height: '100%'}}>
                            <ActivityIndicator size={60} color={'red'} />
                        </View>
                        :
                        <FlatList
                            data={searchQuery}
                            ListEmptyComponent={q.length > 0 ?
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',marginTop: 100}}>
                                    <Text style={{fontFamily: 'font',fontSize: 20,color: '#fff'}}>No people found...</Text>
                                </View>
                                : null
                            }
                            renderItem={({item,index}) => (
                                <SendFriendRequest
                                    friend={item}
                                    key={index}
                                    getFriends={this.getFriends.bind(this)}
                                    token={token}
                                    message={message}
                                    sendFriendRequestChangeState={this.sendFriendRequestChangeState}
                                    navigation={navigation}
                                />
                            )}
                        />
                    }
            </ImageBackground>
        );
    }
}

Search.defaultProps = {
    message: false
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
    card: {
        backgroundColor: '#fff',
        margin: 20,
        marginVertical: 10,
        padding: 20
    }
});
