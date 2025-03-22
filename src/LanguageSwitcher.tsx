import { useTranslation } from "react-i18next";
import * as React from "react";

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div style={{ position: "absolute", top: 10, right: 10 }}>
            <button onClick={() => changeLanguage("en")}>EN</button>
            <button onClick={() => changeLanguage("pl")}>PL</button>
        </div>
    );
};

export default LanguageSwitcher;
