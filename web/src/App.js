import React from 'react';
import Routing from "./Router/Routing";
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
                <Routing/>
            </AuthContextProvider>
        )
    }
}
