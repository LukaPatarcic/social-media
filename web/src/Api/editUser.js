import {fetchJson} from "./index";

export const editUser = (data) => {
    return fetchJson('/user/edit',{
        method: 'PATCH',
        body: JSON.stringify(data)
    },true)
}