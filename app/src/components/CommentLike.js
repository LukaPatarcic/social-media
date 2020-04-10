// import React from "react";
// import {IconButton} from "react-native-paper";
// import {BASE_URL} from "../config";
// import AsyncStorage from "@react-native-community/async-storage";
//
// export default class CommentLike extends React.Component {
//
//     constructor(props) {
//         super(props);
//         this.state = {
//             liked: !!props.liked
//         };
//
//         this.handleLike = this.handleLike.bind(this);
//     }
//
//     static getDerivedStateFromProps(nextProps, prevState) {
//
//         if(!!nextProps.liked !== !!prevState.liked) {
//             console.log('comment Like state updated')
//             return {
//                 liked: !!nextProps.liked
//             }
//         }
//         return null;
//     }
//
//
//
//     render() {
//         const {liked} = this.props;
//         return (
//
//         )
//     }
// }