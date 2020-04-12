import cookie from "react-cookies";

export const setBackground = () => {
    document.querySelector('body').style.backgroundImage = 'url(../images/background.svg)';
    document.querySelector('body').style.backgroundSize = 'cover';
    document.querySelector('body').style.backgroundRepeat = 'no-repeat';
    document.querySelector('body').style.backgroundColor = '#091318';
}

export const setProfilePicture=  (firstName,lastName) => {
    return 'https://eu.ui-avatars.com/api/?rounded=true&background=f44336&color=ffffff&size=48&name=' + firstName +' '+lastName
}