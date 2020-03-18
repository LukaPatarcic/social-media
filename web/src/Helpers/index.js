import cookie from "react-cookies";

export const setBackground = () => {
    document.querySelector('body').style.backgroundImage = 'url(../images/background.svg)';
    document.querySelector('body').style.backgroundSize = 'cover';
    document.querySelector('body').style.backgroundRepeat = 'no-repeat';
    document.querySelector('body').style.backgroundColor = '#091318';
}

export function auth(token) {
    fetch('https://api.allshak.lukaku.tech/auth',{
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-AUTH-TOKEN': token ? token : ''
        },
    })
        .then(response => {
            if(response.status === 403 || response.status === 500) {
                cookie.remove('access-token');
                return '/';
            }
         return response.json();
        })
        .then(data => {
            if(!data.success) {
                cookie.remove('access-token');
                return '/';
            }
        })
        .catch(err => {
            cookie.remove('access-token');
        })
}

export function debounce(fn, delay) {
    var timer = null;
    return function() {
        var context = this,
            args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function() {
            fn.apply(context, args);
        }, delay);
    };
}