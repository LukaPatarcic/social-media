import React,{Component} from "react";
import {ClipLoader} from "react-spinners";
import PropTypes from 'prop-types';
import PostItem from "./PostItem";

export default class PostList extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {posts,hasMore,loading,onHandlePostLike} = this.props;
        return (
            <>
                {posts.map((post,index) => (
                   <PostItem
                       post={post}
                       key={index}
                       onHandlePostLike={onHandlePostLike}
                   />
                ))}
                {hasMore ?
                    (loading &&
                        <div className={'text-center mt-3'}><ClipLoader sizeUnit={"px"} size={100} color={'#f00'} loading={loading}/></div>)
                    :
                    <p className={'text-center text-white'}>No more posts</p>}
            </>
        );
    }
}

PostList.propTypes = {
    posts: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    hasMore: PropTypes.bool.isRequired,
    onHandlePostLike: PropTypes.func.isRequired,
}