import {ActivityIndicator, View, Text, FlatList, ToastAndroid} from "react-native";
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
            updateSubComment: false,
            offset: 0,
            hasMore: true,
            refreshing: false,
            replyTo: null
        };
        this.getComments = this.getComments.bind(this);
        this.setNewComment = this.setNewComment.bind(this);
        this.updateComment = this.updateComment.bind(this);
        this.setNewSubComment = this.setNewSubComment.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.scrollTopTop = this.scrollTopTop.bind(this);
        this.setReplyTo = this.setReplyTo.bind(this);
        this.setReplyToToNull = this.setReplyToToNull.bind(this);
        this.removeComment = this.removeComment.bind(this);
        this.removeSubComment = this.removeSubComment.bind(this);
        this.flatListRef = React.createRef();
    }

    componentDidMount() {
        this.getComments();
    }

    removeComment(id) {
        this.setState((prevState) => (
            {comments: prevState.comments.filter(comment => comment.id !== id)}
        ))
    }

    scrollTopTop() {
        this.flatListRef.scrollToIndex({animated: true, index: 0});
    }

    setReplyTo(replyTo) {
        this.setState({replyTo})
    }

    setReplyToToNull() {
        this.setState({replyTo: null})
    }

    setNewComment(comment) {
        const {comments} = this.state;
        this.setState({comments: []});
        this.setState({comments: [comment, ...comments]});
    }

    setNewSubComment(comment,id) {
        let comments = this.state.comments;
        for(let i in comments) {
            if(comments[i].id === id) {
                let singleComment = comments[i];
                let array = singleComment.subComments;
                singleComment.subComments = [comment,...array];
                singleComment.subCommentCount = singleComment.subCommentCount+1;
                comments[i] = singleComment;
            }
        }
        this.setState({comments});
    }


    updateComment(comment,index) {
        let comments = this.state.comments;
        comments[index] = comment;
        this.setState({comments: comments})
    }

    removeSubComment(id) {
        this.setState((prevState) => {
            const newComments = prevState.comments.filter(comment => {
                comment.subComments = comment.subComments.filter(subComment => subComment.id !== id)
                return comment;
            });
            return {comments: newComments};
        });
    }

    getComments(more = false) {
        const {id,commentCount} = this.props.route.params;
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
                        this.setState({comments: []});
                        this.setState({comments: data})
                    } else {
                        this.setState((prevState) => ({ comments: [...prevState.comments,...data]}))
                    }
                    this.setState((prevState) => ({
                        loading: false,
                        loadingMore: false,
                        offset: prevState.offset + 10,
                        hasMore: commentCount > 10 ? !!data.length : false,
                        refreshing: false
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
            this.getComments()
        });
    }

    render() {
        const {id,handleComments} = this.props.route.params;
        const {comments,loading,loadingMore,hasMore,refreshing,replyTo} = this.state;

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
                            keyExtractor={(contact, index) => String(index)}
                            ListFooterComponent={hasMore ?
                                loadingMore ? <ActivityIndicator size={60} color={'red'} /> : null
                                    :
                                <Text style={{textAlign: 'center',fontFamily: 'font',fontSize: 16}}>No more comments...</Text>}
                            onEndReached={() => this.getComments(true)}
                            renderItem={({index,item}) => (
                                <CommentItem
                                    id={id}
                                    key={index}
                                    index={index}
                                    comment={item}
                                    removeSubComment={this.removeSubComment}
                                    removeComment={this.removeComment}
                                    updateComment={this.updateComment}
                                    setReplyTo={this.setReplyTo}
                                />
                        )} />
                    <CommentInput
                        id={id}
                        replyTo={replyTo}
                        scrollToTop={this.scrollToTop}
                        handleComments={handleComments}
                        setNewComment={this.setNewComment}
                        setNewSubComment={this.setNewSubComment}
                        setReplyToToNull={this.setReplyToToNull}
                        updateComment={this.updateComment}
                        scrollTopTop={this.scrollTopTop}
                    />
                </View>
    }

}
