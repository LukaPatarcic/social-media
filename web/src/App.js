import React from 'react';
import Main from "./Router/Main";
import './App.css';
import {BASE_URL} from "./Config";
import AuthContextProvider from "./Contexts/AuthContext";

export default class App extends React.Component{

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <AuthContextProvider>
                <Main/>
            </AuthContextProvider>
        )
    }
}
