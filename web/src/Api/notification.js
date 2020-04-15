import {fetchJson} from "./index";

export const getFriendRequests = () => {
    return fetchJson('/friend/request',{},true)
};

export const declineFollowRequest = (id) => {
    return fetchJson('/friend/request',{
        method: "PATCH",
        body: JSON.stringify({id})
    },true)
}

export const acceptFollowRequest = (id) => {
    return fetchJson('/friend/request',{
        method: "DELETE",
        body: JSON.stringify({id})
    },true)
}