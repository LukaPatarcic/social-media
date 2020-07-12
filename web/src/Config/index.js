export const BASE_URL = 'https://api.allshack.lukaku.tech';
export const COOKIE_TTL = 31536000;
export const POST_IMAGE = (username,image) => {
    return BASE_URL + '/assets/images/posts/' + username.toLowerCase() + '/' + image
}

/**
 * ROUTES
 */
export const REGISTER_URL = '/register';
export const LOGIN_URL = '/login';
