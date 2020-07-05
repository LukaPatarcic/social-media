import React,{Component} from "react";
import Search from "./Search";
import {debounce} from "throttle-debounce";
import {BASE_URL} from "../../Config";
import cookie from "react-cookies";
import toastr from 'toastr'
import './Search.css'
import {getFriends, sendFriendRequest} from "../../Api/search";

export default class SearchContainer extends Component{
    constructor(props) {
        super(props);
        this.state = {
            searchQuery: [],
            loading: false,
            loadingSendFriendRequest: false,
            loadingSendFriendRequestId: null,
            error: '',
            q: ''
        }

        this.handleChangeDebounce = this.handleChangeDebounce.bind(this);
        this.sendFriendRequest = this.sendFriendRequest.bind(this);
        this.getFriends = this.getFriends.bind(this);
    }


    handleChangeDebounce(q) {
        this.setState({
            q
        },() => {
            debounce(200,this.getFriends());
        })

    }

    getFriends(loading = true) {
        const {q} = this.state;

        if(loading) {
            this.setState({loading:true});
        }
        if(q === '') {
            this.setState({error: 'No Results...',loading:false});
            return;
        }

        const url =`/search?search=${q}`

        getFriends(url)
            .then(data => {
                this.setState({searchQuery: data,loading: false});
                if(data) {
                    this.setState({error: ''});
                } else {
                    this.setState({error: 'No Results...'});
                }
            })
            .catch(err => err.response.json().then(err => {
                this.setState({error: 'Oops... Something went wrong!',loading: false});
            }))
    }

    sendFriendRequest(id) {
        this.setState({loadingSendFriendRequest: true,loadingSendFriendRequestId: id});
        sendFriendRequest({id})
            .then(data => {
                this.setState({loading: false});
                this.getFriends(false);
                if(data.error) {
                    this.setState({error: true})
                    toastr.info('Friend request already sent!');
                }
                this.setState({loadingSendFriendRequest: false,loadingSendFriendRequestId: null});
            })
            .catch(err => err.response.json().then(err => {
                this.setState({error: true,loading: false});
                toastr.info('Friend request already sent!');
            }))
    }

    render() {
        return (
            <Search
                {...this.state}
                onHandleChangeDebounce={this.handleChangeDebounce}
                onSendFriendRequest={this.sendFriendRequest}
            />
        );
    }
}