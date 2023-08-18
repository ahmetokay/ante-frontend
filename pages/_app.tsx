import type {AppProps} from 'next/app';
import type {Page} from '../types/types';
import React, {useEffect} from 'react';
import {LayoutProvider} from '../layout/context/layoutcontext';
import Layout from '../layout/layout';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import './i18next';
import {useTranslation} from "react-i18next";
import {AuthProvider} from "../layout/context/authcontext";
import {useRouter} from "next/router";
import {addLocale, locale} from 'primereact/api';

type Props = AppProps & {
    Component: Page;
};

export default function MyApp({Component, pageProps}: Props) {

    const {i18n} = useTranslation();
    const router = useRouter();

    useEffect(() => {
        addLocale('tr', {
            startsWith: "Başlangıç",
            contains: "Barındırır",
            notContains: "İçinde Barındırmaz",
            endsWith: "Bitiş",
            equals: "Eşittir",
            notEquals: "Eşit Değildir",
            noFilter: "Filtresiz",
            lt: "Daha az",
            lte: "Daha az veya Eşit",
            gt: "Daha Fazla",
            gte: "Daha fazla veya Eşit",
            dateIs: "Tarih",
            dateIsNot: "Tarih değildir",
            dateBefore: "Tarihten önce",
            dateAfter: "Tarihten sonra",
            custom: "Özel",
            clear: "Temiz",
            apply: "Uygula",
            matchAll: "Tümüyle eşleşir",
            matchAny: "Herhangi birine eşleşir",
            addRule: "Kural Ekle",
            removeRule: "Kuralı Sil",
            accept: "Tamam",
            reject: "İptal",
            choose: "Seç",
            upload: "Yükle",
            cancel: "Vazgeç",
            dayNames: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"],
            dayNamesShort: ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"],
            dayNamesMin: ["Pz", "Pt", "Sa", "Ça", "Pe", "Cu", "Ct"],
            monthNames: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
            monthNamesShort: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"],
            today: "Bugün",
            weekHeader: "Hf",
            firstDayOfWeek: 0,
            dateFormat: "dd/mm/yy",
            weak: "Zayıf",
            medium: "Orta",
            strong: "Güçlü",
            passwordPrompt: "Şifre Giriniz",
            emptyFilterMessage: "Kullanılabilir seçenek yok",
            emptyMessage: "Sonuç bulunamadı",
            aria: {
                trueLabel: "Doğru",
                falseLabel: "Yanlış",
                nullLabel: "Seçilmedi",
                pageLabel: "Sayfa",
                firstPageLabel: "İlk Sayfa",
                lastPageLabel: "Son Sayfa",
                nextPageLabel: "Sonraki Sayfa",
                previousPageLabel: "Önceki Sayfa"
            }
        })
        locale('tr');

        i18n.changeLanguage('tr');

        var token = sessionStorage.getItem("access_token");
        if (!token) {
            router.push('/login')
        }
    }, [])

    if (Component.getLayout) {
        return (
            <AuthProvider>
                <LayoutProvider>
                    {Component.getLayout(<Component {...pageProps} />)}
                </LayoutProvider>
            </AuthProvider>
        );
    } else {
        return (
            <AuthProvider>
                <LayoutProvider>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </LayoutProvider>
            </AuthProvider>
        );
    }
}