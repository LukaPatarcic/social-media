import {fetchJson} from "./index";

export const sendPost = (text) => {
    return fetchJson('/post',{
        method: 'POST',
        body: JSON.stringify({text})
    },true)
};

export const getPosts = (offset,onlyMe) => {
    return fetchJson('/post?offset='+offset+'&onlyMe='+onlyMe,{},true)
};

export const postLike = (id,method) => {
    return fetchJson('/like/post',{
        method: method,
        body: JSON.stringify({id})
    },true)
};

export const postComment = (comment,id) => {
    return fetchJson('/comment',{
        method: 'POST',
        body: JSON.stringify({text:comment,post:id})
    },true);
}
