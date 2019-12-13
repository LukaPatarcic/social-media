import React from 'react';
import Router from '../config/router';
import AsyncStorage from "@react-native-community/async-storage";

export default class User extends React.Component{
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        AsyncStorage.getItem('access-token')
            .then(data => {
                if(null == data) {
                    this.props.history.push('/login')
                } else {
                    this.props.history.push('/user')
                }
            })
            .catch(err => {
                AsyncStorage.removeItem('access-token');
                this.props.history.push('/login')
            })
            .done();
    }


    render() {
        return (
            <Router />
        );
    }
}