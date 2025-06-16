import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            auth: {
                adminLogin: 'Administrator Login',
                userLogin: 'User Login',
                loginError: 'Please enter email and password.',
                twoFactorShow: 'Enter 2FA Code',
                twoFactorHide: 'Hide 2FA',
                twoFactorEnter: 'Enter 2FA Code',
                forgotPassword: 'Forgot Password?'
            },
            common: {
                email: 'Enter email address',
                password: 'Enter password',
                login: 'Login'
            }
        }
    },
    pl: {
        translation: {
            auth: {
                adminLogin: 'Logowanie Administratora',
                userLogin: 'Logowanie Użytkownika',
                loginError: 'Podaj adres e-mail oraz hasło.',
                twoFactorShow: 'Wprowadź kod 2FA',
                twoFactorHide: 'Ukryj 2FA',
                twoFactorEnter: 'Wprowadź kod 2FA',
                forgotPassword: 'Zapomniałeś hasła?'
            },
            common: {
                email: 'Wprowadź adres e-mail',
                password: 'Wprowadź hasło',
                login: 'Zaloguj'
            }
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'pl', 
        fallbackLng: 'pl',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
