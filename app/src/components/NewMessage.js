import React,{Component} from "react";
import Search from "../screens/Search";

export default class NewMessage extends Component{
    render() {
        return (
            <Search navigation={this.props.navigation} message={true} />
        );
    }
}