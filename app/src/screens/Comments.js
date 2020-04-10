import {ActivityIndicator, View, Text, FlatList} from "react-native";
import React from "react";
import AsyncStorage from "@react-native-community/async-storage";
import {BASE_URL} from "../config";
import CommentItem from "../components/CommentItem";
import CommentInput from "../components/CommentInput";

export default class Comments extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            loading: true,
            loadingMore: false,
            offset: 0,
            hasMore: true,
            refreshing: false
        };

        this.getComments = this.getComments.bind(this);
        this.setNewComment = this.setNewComment.bind(this);
        this.updateComment = this.updateComment.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.scrollTopTop = this.scrollTopTop.bind(this);
        this.flatListRef = React.createRef();
    }

    componentDidMount() {
        this.getComments();
    }

    scrollTopTop() {
        this.flatListRef.scrollToIndex({animated: true, index: 0});
    }

    setNewComment(comment) {
        const {comments} = this.state;
        this.setState({comments: []});
        this.setState({comments: [comment, ...comments]});
    }

    updateComment(comment,index) {
        let comments = this.state.comments;
        comments[index] = comment;
        this.setState({comments: comments})
    }

    getComments(more = false) {
        const {id} = this.props.route.params;
        const {offset,refreshing,loadingMore,hasMore} = this.state;
        if(loadingMore || !hasMore)
            return;
        if(more) {
            this.setState({loadingMore: true})
        }

        AsyncStorage.getItem('access-token', (err, val) => {
            fetch(BASE_URL+'/comment/'+id+'?offset='+offset,{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ val
                }
            })
                .then((response => response.json()))
                .then((data => {
                    if(refreshing) {
                        this.setState({comments: []})
                        this.setState({comments: data})
                    } else {
                        this.setState((prevState) => ({ comments: [...prevState.comments,...data]}))
                    }
                    this.setState((prevState) => ({
                        loading: false,
                        loadingMore: false,
                        offset: prevState.offset + 10,
                        hasMore: !!data.length,
                        refreshing: false
                    }));
                }))
        })
    }

    handleRefresh() {
        this.setState({refreshing: true,offset: 0, hasMore: true}, () => {
            this.getComments()
        });
    }

    render() {
        const {id,handleComments} = this.props.route.params;
        const {comments,loading,loadingMore,hasMore,refreshing} = this.state;

        return loading ?
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',position: 'absolute', width: '100%', height: '100%'}}>
                <ActivityIndicator size={60} color={'red'} />
            </View>
            :
                <View style={{height: '100%',paddingTop: 10}}>
                        <FlatList
                            ref={(ref) => {this.flatListRef = ref}}
                            refreshing={refreshing}
                            onRefresh={() => this.handleRefresh()}
                            data={comments}
                            ListEmptyComponent={
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',marginTop: 100}}>
                                    <Text style={{fontFamily: 'font',fontSize: 20}}>No comments found...</Text>
                                </View>
                            }
                            style={{marginBottom: 60}}
                            onEndReachedThreshold={0.3}
                            ListFooterComponent={hasMore ?
                                loadingMore ? <ActivityIndicator size={60} color={'red'} /> : null
                                    :
                                <Text style={{textAlign: 'center',fontFamily: 'font',fontSize: 16}}>No more comments...</Text>}
                            onEndReached={() => this.getComments(true)}
                            renderItem={({index,item}) => (
                                <CommentItem key={index} index={index} id={id} comment={item} updateComment={this.updateComment} />
                        )} />
                    <CommentInput scrollToTop={this.scrollToTop} handleComments={handleComments} id={id} setNewComment={this.setNewComment} scrollTopTop={this.scrollTopTop} />
                </View>
    }

}
