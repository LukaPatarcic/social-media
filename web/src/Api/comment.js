import {fetchJson} from "./index";

export const getComments = (id,offset) => {
    return fetchJson('/comment/'+id+'?offset='+offset,{},true)
};

export const commentLike = (id,method) => {
    return fetchJson('/comment/like',{
        method: method,
        body: JSON.stringify({id})
    },true)
}

export const commentReply = (comment,text) => {
    return fetchJson('/subcomment',{
        method: 'POST',
        body: JSON.stringify({comment,text})
    },true)
}

export const getSubComments = (id,offset) => {
    return fetchJson('/subcomment/'+id+'?offset='+offset,{},true)
}
