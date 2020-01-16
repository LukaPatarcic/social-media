import React, { Component } from 'react';
import {
    MDBContainer,
    MDBBtn,
    MDBModal,
    MDBModalBody,
    MDBModalHeader,
    MDBModalFooter,
    MDBIcon,
    MDBInput
} from 'mdbreact';
import cookie from 'react-cookies'
import {ClipLoader} from "react-spinners";

export default class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            searchQuery: [],
            loading: false,
            error: ''
        }

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    handleChange(e) {
        let value = e.target.value;
        this.setState({loading:true});
        if(value === '') {
            this.setState({error: 'No Results...',loading:false});
            return;
        }
        let url = new URL('https://api.allshak.lukaku.tech/search');
        let params = {search:value};
        url.search = new URLSearchParams(params).toString();

        fetch(url,{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN': cookie.load('access-token')
            },
            method: "GET"
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

    sendFriendRequest() {

    }

    render() {
        const {searchQuery,loading,error} = this.state;
        return (
            <MDBContainer>
                <MDBIcon onClick={this.toggle} fas={'true'} icon="search" className={'text-white mr-2'} />
                <MDBModal className={'text-dark'} isOpen={this.state.modal} toggle={this.toggle}>
                    <MDBModalHeader toggle={this.toggle}>Search for friends</MDBModalHeader>
                    <MDBModalBody className={'text-center'}>
                        <MDBInput className={'text-justify'} label="Search for friends" icon="search" onChange={(e) => {this.handleChange(e)}} />
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
                                    searchQuery.map((value, index) =>
                                        <div className={'d-flex justify-content-end'}  key={index}>
                                            <p className={'text-left'}>
                                                {value.firstName} {value.lastName} ({value.profileName}) <span><MDBBtn color={'grey'} size={'sm'} outline={'true'} onClick={this.sendFriendRequest()}>Add Friend</MDBBtn></span></p>
                                            <hr/>
                                        </div>
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