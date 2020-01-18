import React from 'react';
import {View, StyleSheet, ImageBackground, ScrollView, Button, ActivityIndicator,} from 'react-native';
import { Text } from 'native-base';
import { Searchbar } from 'react-native-paper';
import AsyncStorage from "@react-native-community/async-storage";
import SendFriendRequest from "../components/SendFriendRequest";

export default class Profile extends React.Component {
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
    }

    componentDidMount() {
        AsyncStorage.getItem('access-token', (err, val) => {
            if (!val) {
                // this.props.history.push('/login');
            } else {
                this.setState({token: val})
            }
        });
    }

    getFriends() {
        console.log('here');
        const {q,token} = this.state;
        const controller = new AbortController();
        const signal = controller.signal;
        this.setState({loading:true});

        fetch('https://api.allshak.lukaku.tech/search?search='+q,{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN': token
            },
            signal: signal,
            method: "GET",
        })
            .then((response =>response.json()))
            .then((data => {
                console.log(data);
                this.setState({searchQuery: data,loading: false});

                if(data) {
                    this.setState({error: ''});
                } else {
                    this.setState({error: 'No Results...'});
                }


            }))
            .catch(err => {
                console.log(err);
                this.setState({error: 'Oops... Something went wrong!',loading: false});
            })
    }

    updateSearch(q) {
        this.setState({ q },() => this.getFriends());
    };

    render() {
        const {q,searchQuery,loading,loadingButton,token} = this.state;
        return (
            <ImageBackground
                style={{width: '100%', height: '100%',zIndex: -1,resizeMode: 'cover'}}
                source={{uri: 'https://allshak.lukaku.tech/images/background.png'}}>
                <View>
                    <Searchbar
                        inputStyle={{fontFamily: 'font'}}
                        placeholder="Search"
                        onChangeText={this.updateSearch.bind(this)}
                        value={q}
                        onIconPress={this.getFriends.bind(this)}
                    />
                </View>
                <ScrollView>
                {q
                    ?
                    <View>
                        <View style={styles.card}>
                            <View>
                                {loading ?
                                    <ActivityIndicator size="small" color="#f00" /> :
                                    <Text  style={{fontFamily: 'font'}}>Search results:</Text>}
                            </View>
                        </View>
                        {searchQuery.length
                            ?
                            searchQuery.map((friend,index) => (
                            <SendFriendRequest friend={friend} key={index} getFriends={this.getFriends.bind(this)} token={token} />))
                            :
                            <Text>No results...</Text>
                        }
                    </View>
                    :
                    <Text>""</Text>
                }
                </ScrollView>
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
    card: {
        backgroundColor: '#fff',
        margin: 20,
        marginVertical: 10,
        padding: 20
    }
});
