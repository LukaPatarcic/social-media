export const formatImage = (image,firstName,lastName) => {
    return image ? image : 'https://eu.ui-avatars.com/api/?rounded=true&background=f44336&color=ffffff&size=128&name='+firstName+'+'+lastName;
}