import Cookies from 'js-cookie';

export const setTokenCookie = (token: string, expiresMinutes: number) => {
    Cookies.set('token', token, { expires: expiresMinutes / (24 * 60) });
};

export const getTokenCookie = () => {
    return Cookies.get('token');
};

export const removeTokenCookie = () => {
    Cookies.remove('token');
};
