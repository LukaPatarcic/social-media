import React from 'react';
import {
    View,
    StyleSheet,
    ImageBackground,
    ScrollView,
    ActivityIndicator, FlatList, Text,
} from 'react-native';
import AsyncStorage from "@react-native-community/async-storage";
import PostItem from "../components/PostItem";
import AddPost from "../components/AddPost";
import {BASE_URL} from "../config";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            loading: true,
            loadingMore: false,
            offset: 0,
            hasMore: true,
            refreshing: false
        }
    }

    getPosts(more = false) {
        const {offset,refreshing,loadingMore,hasMore,token} = this.state;
        if(loadingMore || !hasMore)
            return;
        if(more) {
            this.setState({loadingMore: true})
        }

        fetch(BASE_URL+'/post?offset='+offset,{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            },
            method: "GET"
        })
            .then((response => response.json()))
            .then((data => {
                if(refreshing) {
                    this.setState({posts: []});
                    this.setState({posts: data})
                } else {
                    this.setState((prevState) => ({ posts: [...prevState.posts,...data]}))
                }
                this.setState((prevState) => ({
                    loading: false,
                    loadingMore: false,
                    offset: prevState.offset + 10,
                    hasMore: !!data.length,
                    refreshing: false
                }));
            }))
            .catch(err => {
                this.setState({error: true,loading: false});
            })
    }

    handleRefresh() {
        this.setState({refreshing: true,offset: 0, hasMore: true}, () => {
            this.getPosts()
        });
    }

    componentDidMount() {
        AsyncStorage.getItem('access-token', (err, val) => {
            this.setState({token: val},() => {
                this.getPosts();
            })
        })
    }

    render() {
        const {posts,loading,refreshing,hasMore,loadingMore} = this.state;
        return (
            <ImageBackground
                style={{width: '100%', height: '100%'}}
                source={require('../../assets/images/background-01.png')}
            >
                {loading
                    ?
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',position: 'absolute', width: '100%', height: '100%'}}>
                        <ActivityIndicator size={70} color="#f00" />
                    </View>
                    :
                    <FlatList
                        refreshing={refreshing}
                        onRefresh={() => this.handleRefresh()}
                        data={posts}
                        ListEmptyComponent={
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',marginTop: 100}}>
                                <Text style={{fontFamily: 'font',fontSize: 20}}>No posts found...</Text>
                            </View>
                        }
                        onEndReachedThreshold={0.5}
                        style={{marginTop: 5}}
                        ListFooterComponent={hasMore ?
                            loadingMore ? <ActivityIndicator size={60} color={'red'} /> : null
                            :
                            <Text style={{textAlign: 'center',fontFamily: 'font',fontSize: 16,color: '#fff'}}>No more posts...</Text>}
                        onEndReached={() => this.getPosts(true)}
                        keyExtractor={(contact, index) => String(index)}
                        renderItem={({item}) => (
                            <PostItem navigation={this.props.navigation} post={item} />
                        )} />
                }
                <AddPost />
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