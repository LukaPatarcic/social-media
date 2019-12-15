import React from 'react';
import ReactDOM from 'react-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import './css/style.css'
import App from "./App";
import WS from "./Components/WebSocketConnection";
import Login from "./Screens/Login";
import Register from "./Screens/Register";
import Logout from "./Components/Logout";
import Main from "./Router/Main";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

// const routes = (
//
// );

ReactDOM.render(<App/>, document.getElementById('root'));