import cookie from "react-cookies";

const facebookData = () => {
    fetch('https://api.allshak.lukaku.tech/connect/facebook/get/user',{
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-AUTH-TOKEN': cookie.load('access-token'),
            'facebook-access-token': cookie.load('facebook-access-token')
        }

    })
        .then(response => {
            if(response.status > 400 && response.status < 500) {
                throw Error('Invalid credentials please log in again');
            }
            return response.json()
        })
        .then(data => {
            this.setState({facebookData: data})
        })
        .catch(err => {
            cookie.remove('facebook-access-token');
        });
}

export {facebookData};