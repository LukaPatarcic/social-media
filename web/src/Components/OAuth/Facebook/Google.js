import cookie from "react-cookies";

const googleData = () => {
    let url = new URL('https://www.googleapis.com/oauth2/v1/userinfo');
    let params = {'access_token': cookie.load('google-access-token')};
    url.search = new URLSearchParams(params).toString();
    fetch(url)
        .then(response => response.json())
        .then(data => {
            this.setState({googleData: data})
        })
        .catch(err => {
        });

};
export {googleData}
