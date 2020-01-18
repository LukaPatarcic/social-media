import React, { Component } from 'react';
import {
    MDBContainer,
    MDBBtn,
    MDBModal,
    MDBModalBody,
    MDBModalHeader,
    MDBModalFooter,
    MDBIcon,
    MDBInput, MDBRow, MDBTooltip
} from 'mdbreact';
import cookie from 'react-cookies'
import {ClipLoader} from "react-spinners";
import FriendItem from "./FriendItem";

export default class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            q: '',
            searchQuery: [],
            loading: false,
            error: ''
        }

        this.toggle = this.toggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    getFriends(loading = false) {
        const {q} = this.state;
        const controller = new AbortController();
        const signal = controller.signal;
        if(loading) {
            this.setState({loading:true});
        }
        if(q === '') {
            this.setState({error: 'No Results...',loading:false});
            return;
        }

        let url = new URL('https://api.allshak.lukaku.tech/search');
        let params = {search:q};
        url.search = new URLSearchParams(params).toString();

        fetch(url,{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN': cookie.load('access-token')
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
                console.log(err);
                this.setState({error: 'Oops... Something went wrong!',loading: false});
            })
    }

    handleChange(e) {
        this.setState({ [e.target.name] : e.target.value },() => {
            this.getFriends(true);
        });
    }

    render() {
        const {searchQuery,loading,error} = this.state;
        return (
            <MDBContainer>
                <MDBIcon onClick={this.toggle} fas={'true'} icon="search" className={'text-white mr-2'} />
                <MDBModal className={'text-dark'} size={'lg'} isOpen={this.state.modal} toggle={this.toggle}>
                    <MDBModalHeader toggle={this.toggle}>Search for friends</MDBModalHeader>
                    <MDBModalBody className={'text-center'}>
                        <span className={'text-left'}>
                            <MDBInput
                                label="Search for friends"
                                icon="search"
                                name={'q'}
                                onChange={(e) => this.handleChange(e)}
                                value={this.state.q} />
                        </span>
                        {loading
                            ?
                            <ClipLoader
                                sizeUnit={"px"}
                                size={20}
                                color={'#f00'}
                                loading={loading}
                            />
                            :
                            (error
                                    ?
                                    error
                                    :
                                    (searchQuery.length ?
                                            searchQuery.map((value, index) =>
                                                <FriendItem
                                                    key={index}
                                                    friend={value}
                                                    change={this.state.change}
                                                    toggle={this.toggle.bind(this)}
                                                    getFriends={this.getFriends.bind(this)}
                                                />

                                            )
                                            :
                                            <p>No results...</p>
                                    )

                            )
                        }
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color="red" onClick={this.toggle}>Close</MDBBtn>
                    </MDBModalFooter>
                </MDBModal>
            </MDBContainer>
        );
    }
}