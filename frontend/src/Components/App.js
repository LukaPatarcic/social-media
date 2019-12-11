import React from 'react';
import './App.css';

export default class App extends React.Component{

    constructor(props) {
        super(props);

    }

    handleClick() {
        fetch('http://localhost:8000/connect/facebook')
            .then(response => response.text())
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.log(error);
            })
    }


    render() {
        return (
            <div>
                <button onClick={this.handleClick}>Login with facebook</button>
            </div>
        );
    }
}
