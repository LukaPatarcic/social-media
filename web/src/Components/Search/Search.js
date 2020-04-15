import React, {Component} from 'react';
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
import {ClipLoader} from "react-spinners";
import FriendItem from "./FriendItem";


export default class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {
            q: '',
            modal: false,
            loading: false,
            error: '',
            searchQuery: []
        }

        this.handleChange = this.handleChange.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }


    handleChange(e) {
        this.setState({[e.target.name]: e.target.value}, () => {
            this.handleChangeDebounce(this.state.q);
        });
    }

    render() {
        const {searchQuery, loading, error} = this.state;
        return (
            <MDBContainer>
                <MDBIcon onClick={this.toggle} fas={'true'} icon="search" className={'text-white mr-2'}/>
                <MDBModal className={'text-dark'} size={'lg'} isOpen={this.state.modal} toggle={this.toggle}>
                    <MDBModalHeader toggle={this.toggle}>Search for friends</MDBModalHeader>
                    <MDBModalBody className={'text-center'}>
                        <span className={'text-left'}>
                            <MDBInput
                                label="Search for friends"
                                icon="search"
                                value={this.state.q}
                                onChange={this.handleChange}
                                name={'q'}
                            />
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