import React from 'react';
import openSocket from 'socket.io-client';
import {WS_URL} from "../config";
import {AsyncStorage} from "react-native";
export const WebsocketContext = React.createContext({ io: null });

export class WebsocketProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            io: {}
        }
    }


    componentDidMount() {
        AsyncStorage.getItem("id")
            .then(id => {
                this.setState({
                    id: id
                },() => {
                    this.setState({
                        io: openSocket(WS_URL,{query: `id=${this.state.id}`})
                    },() => {
                        console.log(this.state.io.connected);
                    })
                })
            })

    }

    onMessage(message) {
        this.state.io.emit("message",message);
    }


    render() {
        return (
            <WebsocketContext.Provider value={{io: this.state.io}}>
                {this.props.children}
            </WebsocketContext.Provider>
        );
    }
}