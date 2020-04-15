import React,{Component} from "react";
import Search from "./Search";
import {debounce} from "throttle-debounce";
import {BASE_URL} from "../../Config";
import cookie from "react-cookies";

export default class SearchContainer extends Component{
    constructor(props) {
        super(props);
        this.state = {
            searchQuery: [],
            loading: false,
            error: ''
        }

        this.toggle = this.toggle.bind(this);
        this.handleChangeDebounce = debounce(200,this.search);
    }

    search = qq => {
        this.getFriends()
    }

    getFriends(loading = false) {
        const {q} = this.state;

        if(loading) {
            this.setState({loading:true});
        }
        if(q === '') {
            this.setState({error: 'No Results...',loading:false});
            return;
        }

        let url = new URL(BASE_URL+'/search');
        let params = {search:q};
        url.search = new URLSearchParams(params).toString();

        fetch(url,{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + cookie.load('access-token')
            },
            signal: signal,
            method: "GET",
        })
            .then((response => response.json()))
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
            })
    }

    render() {
        return (
            <Search />
        );
    }
}