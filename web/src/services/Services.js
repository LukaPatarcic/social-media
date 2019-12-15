export const setBackground = () => {
    document.querySelector('body').style.backgroundImage = 'url(../images/background.svg)';
    document.querySelector('body').style.backgroundSize = 'cover';
    document.querySelector('body').style.backgroundRepeat = 'no-repeat';
    document.querySelector('body').style.backgroundColor = '#091318';
}

export const auth = (token) => {
    var isAuth = false;
    fetch('https://api.allshak.lukaku.tech/auth',{
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-AUTH-TOKEN': token ? token : ''
        },
    })
        .then(response => {
            if(response.status === 403 || response.status === 500) {
                return null;
            }
         return response.json();
        })
        .then(data => {
            if(data.success) {
                isAuth = true;
            }
        })
    console.log(isAuth)
    return isAuth;
}