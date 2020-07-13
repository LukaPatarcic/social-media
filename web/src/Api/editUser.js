import {fetchJson} from "./index";

export const editUser = (data) => {
    return fetchJson('/user/edit',{
        method: 'PATCH',
        body: JSON.stringify(data)
    },true)
}

export const editUserPicture = (image) => {
    return fetchJson('/user/edit/picture',{
        method: 'PATCH',
        body: JSON.stringify({image})
    },true)
}