import React from 'react';
import ReactDOM from 'react-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import './css/style.css'
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Login from "./Components/Login/Login"
import WS from "./Components/WebSocketConnection";
import Homepage from "./Components/Homepage";
import Logout from "./Components/Login/Logout";
import Register from "./Components/Register";


const routing = (
    <Router>
        <Switch>
            <Route path="/ws" component={WS} />
            <Route path="/login" component={Login}/>
            <Route path="/register" component={Register}/>
            <Route path="/logout" component={Logout}/>
            <Route path="/" component={Homepage} />
        </Switch>
    </Router>
);

ReactDOM.render(routing, document.getElementById('root'));