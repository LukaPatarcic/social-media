import * as React from "react";

export default class Profile extends React.Component{

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        fetch('http://localhost:8000/connect/facebook/get/user')
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
    }

    render() {
        return (
            <div>

            </div>
        );
    }


}