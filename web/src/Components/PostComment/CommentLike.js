import {MDBBadge, MDBBtn, MDBCol, MDBIcon} from "mdbreact";
import React from "react";
import {BASE_URL} from "../../Config";
import cookie from "react-cookies";

export default class CommentLike extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            liked: this.props.liked
        }
        this.handleLike = this.handleLike.bind(this)
    }

    // handleLike() {
    //     const {liked} = this.state;
    //     fetch(BASE_URL+'/comment/like',{
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //             'Authorization': 'Bearer ' +  cookie.load('access-token')
    //         },
    //         method: liked ? 'DELETE' : 'POST',
    //         body: JSON.stringify({id: this.props.id})
    //     })
    //         .then(response => response.json())
    //         .then(data => {
    //             if(data.success) {
    //                 this.setState({liked: !this.state.liked},() => {
    //                     this.state.liked ?
    //                         this.props.addLike()
    //                         :
    //                         this.props.removeLike()
    //                 })
    //
    //             }
    //         })
    // }

    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.liked !== this.props.liked) {
            this.setState({
                liked: nextProps.liked
            })
        }
    }

    render() {
        const {liked} = this.state;
        return (
            <a className={'text-danger mr-3'} style={{fontSize: 14,fontWeight: 400}} onClick={this.handleLike}>
                {!!liked ? 'Unlike' : 'Like'}
            </a>

        )
    }
}