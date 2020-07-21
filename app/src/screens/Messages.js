import React,{Component} from "react";
import {ActivityIndicator, FlatList, ImageBackground, Text, View} from "react-native";
import {BASE_URL} from "../config";
import PostItem from "../components/PostItem";
import MessageUserItem from "../components/MessageUserItem";
import {FAB} from "react-native-paper";

export default class Messages extends Component{
    static defaultProps = {
        message: false
    }
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            loading: true,
            refreshing: false
        }

        this.getData = this.getData.bind(this);
    }

    getData() {
        fetch(BASE_URL+'/message/users')
            .then(response => response.json())
            .then(response => {
                this.setState({
                    users: response,
                    loading: false
                })
            })
            .catch(err => {
                this.setState({
                    loading: false
                })
            })
    }

    componentDidMount() {
       this.getData()
    }

    render() {
        const {users,loading,refreshing} = this.state;
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
                    <View style={{display: 'flex',flexDirection: 'column',height: '100%'}}>
                        <FlatList
                            refreshing={refreshing}
                            onRefresh={() => this.getData()}
                            data={users}
                            style={{marginTop: 10}}
                            ListEmptyComponent={
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100}}>
                                    <Text style={{fontFamily: 'font', fontSize: 20}}>No people found...</Text>
                                </View>
                            }
                            keyExtractor={(contact, index) => String(index)}
                            renderItem={({item}) => (
                                <MessageUserItem navigation={this.props.navigation} user={item}/>
                            )}/>
                        <FAB
                            style={{
                                position: 'absolute',
                                backgroundColor: 'grey',
                                margin: 16,
                                right: 0,
                                bottom: 0,
                            }}
                            icon="pencil"
                            color={'white'}
                            onPress={() => this.props.navigation.navigate('NewMessage')}
                        />
                    </View>
                }
            </ImageBackground>
        );
    }
}