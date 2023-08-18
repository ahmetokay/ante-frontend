import {Dropdown} from 'primereact/dropdown';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {locale} from 'primereact/api';

function Language() {

    const {t, i18n} = useTranslation();
    const activeLang = {name: "Türkçe", code: "tr"};
    const [language, setLanguage] = useState(activeLang);
    const languageList = [{name: "Türkçe", code: "tr"}, {name: 'English', code: 'en'}];

    function languageChange(item) {
        setLanguage(item.value);
        i18n.changeLanguage(item.value.code);
        locale(item.value.code)
    }

    const languageTemplate = (option) => {
        return (
            <div className="p-formgroup-inline">
                <div className="p-field">
                    <span className={`flag ${option.code === 'tr' ? 'flag-tr' : 'flag-uk'}`}/>
                </div>
                <div className="p-field">
                    <div className="p-mt-1 p-text-bold">{option.name}</div>
                </div>
            </div>
        );
    }

    const selectedLanguageTemplate = (option) => {
        if (option) {
            return (
                <span className={`flag ${option.code === 'tr' ? 'flag-tr' : 'flag-uk'}`}/>
            );
        }
    }

    return (
        <span className="language">
            <Dropdown value={language}
                      options={languageList}
                      onChange={languageChange}
                      itemTemplate={languageTemplate}
                      valueTemplate={selectedLanguageTemplate}
                      optionLabel="name"/>
        </span>
    );
}

export default Language;