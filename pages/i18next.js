import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import backend from "i18next-xhr-backend";
import {initReactI18next} from 'react-i18next';
import translationEN from '../public/locales/en/translation.json'
import translationTR from '../public/locales/tr/translation.json'

const resources = {
    en: {
        translation: translationEN,
    },
    tr: {
        translation: translationTR,
    }
}

i18n
    .use(backend)
    .use(detector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: ['en', 'tr'],
        debug: false,
        detection: {
            order: ['queryString', 'cookie'],
            cache: ['cookie']
        },
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;