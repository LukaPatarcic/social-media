import React from "react";
import PropTypes from "prop-types";
import AboutListItem from "../Home/AboutListItem";
import {BASE_URL} from "../../Config";
import cookie from "react-cookies";

export default class CommentList extends React.Component{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {post} = this.props;
        fetch(BASE_URL+'/comment/'+post,{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + cookie.load('access-token')
            }
        })
            .then(response => response.json())
            .then(data => {
                // console.log(data);
            })
    }

    render() {
        return (
            <>
                </>
        );
    }
}

// CommentList.propTypes = {
//     post: PropTypes.number.isRequired
// };