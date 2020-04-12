import {fetchJson} from "./index";

export const sendPost = (text) => {
    return fetchJson('/post',{
        method: 'POST',
        body: JSON.stringify({text})
    },true)
};

export const getPosts = (offset) => {
    return fetchJson('/post?offset='+offset,{},true)
};

export const postLike = (id,method) => {
    return fetchJson('/like/post',{
        method: method,
        body: JSON.stringify({id})
    },true)
}
