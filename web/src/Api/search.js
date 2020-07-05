import {fetchJson} from "./index";

export const getFriends = (url) => {
    return fetchJson(url,{
        method: 'GET'
    },true)
};

export const sendFriendRequest = (data) => {
    return fetchJson('/friend/request',{
        method: 'POST',
        body: JSON.stringify(data)
    },true)
};