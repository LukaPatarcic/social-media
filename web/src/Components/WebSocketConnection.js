import * as React from "react";
import 'autobahn'

export default class WebSocketConnection extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            socketState: "",
            socketErorState: ""
        };
        // this.send = this.send.bind(this);
    }

    componentDidMount() {
        var autobahn = require('autobahn');

        var websocket = new autobahn.Connection({url: 'ws://127.0.0.1:8080', type: 'websocket'});
        websocket.onopen = function (session) {
        };
        websocket.open();
    }


    render(){
        return(
            <div>
                {/*<button onClick={this.send}>Send</button>*/}
                <div>Socket Success State: {this.setState.socketState}</div>
                <div>Socket Error State: {this.setState.socketErorState}</div>
            </div>
            )

    }
}