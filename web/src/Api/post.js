import {fetchJson} from "./index";

export const sendPost = (text,images) => {
    return fetchJson('/post',{
        method: 'POST',
        body: JSON.stringify({text,images})
    },true)
};

export const getPosts = (offset,profile) => {
    const id = profile ? `&profile=${profile}` : ''
    return fetchJson(`/post?offset=${offset}`+id,{},true)
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

export const getPostLikes = (id,offset) => {
    console.log(id,offset)
    return fetchJson(`/like/post?id=${id}offset=${offset}`,{
        method: 'GET'
    },true)
}
