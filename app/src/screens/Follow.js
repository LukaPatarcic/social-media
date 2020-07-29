import {ActivityIndicator, View, Text, FlatList, ToastAndroid, ScrollView, TouchableOpacity} from "react-native";
import React from "react";
import AsyncStorage from "@react-native-community/async-storage";
import {BASE_URL} from "../config";
import {Card, IconButton, Avatar, Portal, Dialog, Button, Divider, Paragraph} from "react-native-paper";
import {formatImage} from "../helpers/functions";
import Icon from "react-native-vector-icons/FontAwesome5";

export default class Comments extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            follows: [],
            loading: true,
            loadingMore: false,
            offset: 0,
            hasMore: true,
            refreshing: false,
            dialogue: false
        };

        this.getFollows = this.getFollows.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.flatListRef = React.createRef();
    }

    componentDidMount() {
        this.getFollows();
    }

    getFollows(more = false) {
        const {followers} = this.props.route.params;
        const {offset,refreshing,loadingMore,hasMore} = this.state;

        if(loadingMore || !hasMore)
            return;

        if(more) {
            this.setState({loadingMore: true})
        }

        AsyncStorage.getItem('access-token', (err, val) => {
            const url = BASE_URL+`/${followers ? 'followers': 'following'}?offset=`+offset
            fetch(url,{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ val
                }
            })
                .then((response => response.json()))
                .then((data => {
                    this.setState((prevState) => ({
                        loading: false,
                        loadingMore: false,
                        follows: [...prevState.follows,...data],
                        offset: prevState.offset + 10,
                        hasMore: data.length > 10 ? !!data.length : false
                    }));
                }))
                .catch(err => {
                    this.setState({loading: false,loadingMore: false});
                    ToastAndroid.show('Something went wrong...',ToastAndroid.SHORT);
                })
        })
    }

    handleRefresh() {
        this.setState({refreshing: true,offset: 0, hasMore: true}, () => {
            this.getFollows()
        });
    }

    render() {
        const {following} = this.props.route.params;
        const {follows,loading,loadingMore,hasMore,refreshing,dialogue} = this.state;

        return loading ?
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',position: 'absolute', width: '100%', height: '100%'}}>
                <ActivityIndicator size={60} color={'red'} />
            </View>
            :
            <View style={{height: '100%',paddingTop: 10}}>
                <FlatList
                    ref={(ref) => {this.flatListRef = ref}}
                    refreshing={refreshing}
                    onRefresh={this.getFollows}
                    data={follows}
                    ListEmptyComponent={
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',marginTop: 100}}>
                            <Text style={{fontFamily: 'font',fontSize: 20}}>{following ? 'You are not following anyone' : 'No followers found...'}</Text>
                        </View>
                    }
                    style={{marginBottom: 60}}
                    onEndReachedThreshold={0.3}
                    keyExtractor={(contact, index) => String(index)}
                    ListFooterComponent={hasMore ?
                        loadingMore ? <ActivityIndicator size={60} color={'red'} /> : null
                        :
                        <Text style={{textAlign: 'center',fontFamily: 'font',fontSize: 16}}>No more results...</Text>}
                    onEndReached={() => this.getFollows(true)}
                    renderItem={({item,index}) => (
                        <Card onLongPress={() => console.log('longpress')} style={{marginVertical: 30,fontFamily: 'font'}} key={index}>
                            <Card.Title
                                title={item.firstName + " " + item.lastName}
                                subtitle={item.profileName}
                                left={() => (
                                    <Avatar.Image size={40} source={{uri: formatImage(item.profilePicture,item.firstName,item.lastName)}} />
                                )}
                                right={(props) => (
                                    following ?
                                        <IconButton {...props} icon="dots-vertical" onPress={() => this.setState({dialogue: true})} />
                                        :
                                        null
                                )}
                            />
                    </Card>
                    )} />
                <Portal>
                    <Dialog visible={dialogue} onDismiss={() => this.setState({dialogue: false})}>
                        {/*<Dialog.Actions>*/}
                        {/*    <View>*/}
                        {/*        <Text>Unfollow <Icon name={'trash'} /></Text>*/}
                        {/*        <Divider />*/}
                        {/*        <Text>Report</Text>*/}
                        {/*    </View>*/}
                        {/*</Dialog.Actions>*/}
                        <Dialog.Content>
                            <Paragraph>Unfollow</Paragraph>
                        </Dialog.Content>
                    </Dialog>
                </Portal>
            </View>
    }

}
