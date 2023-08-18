/* eslint-disable @next/next/no-img-element */

import {useRouter} from 'next/router';
import React, {useContext, useEffect, useRef, useState} from 'react';
import AppConfig from '../../layout/AppConfig';
import {Button} from 'primereact/button';
import {Password} from 'primereact/password';
import {LayoutContext} from '../../layout/context/layoutcontext';
import {InputText} from 'primereact/inputtext';
import {classNames} from 'primereact/utils';
import {Page} from '../../types/types';
import {AuthService} from "../../service/AuthService";
import {Toast} from "primereact/toast";
import {useTranslation} from "react-i18next";
import {AuthContext} from "../../layout/context/authcontext";
import {UserService} from "../../service/UserService";
import Head from "next/head";


const LoginPage: Page = () => {

    const {t} = useTranslation();
    const toast = useRef<Toast>(null);

    const [email, setEmail] = useState('ahmetokay14@gmail.com');
    const [password, setPassword] = useState('123');
    const {layoutConfig} = useContext(LayoutContext);
    const { setUser } = useContext(AuthContext);

    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden');

    useEffect(() => {
        const queryParameters = new URLSearchParams(window.location.search)
        const redirected = queryParameters.get("redirected")

        if (redirected != undefined && redirected == 'true') {
            toast.current?.show({
                severity: 'warn',
                summary: t('common.warning'),
                detail: t('common.logoutMessage'),
                life: 3000
            });
        }
    }, []);

    const login = () => {

        AuthService.login(email, password)
            .then((data) => {
                if (data.access_token) {
                    sessionStorage.setItem('access_token', data.access_token);
                    sessionStorage.setItem('refresh_token', data.refresh_token);
                    router.push('/')

                    UserService.getCurrentUser().then((user) => setUser(user));
                }
            });
    };

    return (
        <div className={containerClassName}>
            <Toast ref={toast}/>
            <div className="flex flex-column align-items-center justify-content-center">
                <div style={{
                    borderRadius: '56px',
                    padding: '0.3rem',
                    background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{borderRadius: '53px'}}>
                        <div>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                {t("pages.login.email")}
                            </label>
                            <InputText id="email1" value={email} onChange={(e) => setEmail(e.target.value)}
                                       placeholder={t("pages.login.email")} className="w-full md:w-30rem mb-5"
                                       keyfilter="email" style={{padding: '1rem'}}/>

                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                {t("pages.login.password")}
                            </label>
                            <Password inputId="password1" value={password} onChange={(e) => setPassword(e.target.value)}
                                      placeholder={t("pages.login.password")} toggleMask className="w-full mb-5"
                                      inputClassName="w-full p-3 md:w-30rem"></Password>

                            {/*<div className="flex align-items-center justify-content-between mb-5 gap-5">*/}
                            {/*    <div className="flex align-items-center">*/}
                            {/*        <Checkbox inputId="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2"></Checkbox>*/}
                            {/*        <label htmlFor="rememberme1">Remember me</label>*/}
                            {/*    </div>*/}
                            {/*    <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>*/}
                            {/*        Forgot password?*/}
                            {/*    </a>*/}
                            {/*</div>*/}
                            <Button label={t("pages.login.signin")} className="w-full p-3 text-xl"
                                    onClick={login}></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

LoginPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            <Head>
                <title>Ante Grup Bilişim</title>
                <meta charSet="UTF-8"/>
                <meta name="description"
                      content="The ultimate collection of design-agnostic, flexible and accessible React UI Components."/>
                <meta name="robots" content="index, follow"/>
                <meta name="viewport" content="initial-scale=1, width=device-width"/>
                <meta property="og:type" content="website"></meta>
                <meta property="og:title" content="Ante Grup Bilişim"></meta>
                <meta property="og:url" content="https://www.primefaces.org/sakai-react"></meta>
                <meta property="og:description"
                      content="The ultimate collection of design-agnostic, flexible and accessible React UI Components."/>
                <meta property="og:image" content="https://www.primefaces.org/static/social/sakai-nextjs.png"></meta>
                <meta property="og:ttl" content="604800"></meta>
                <link rel="icon" href={`/favicon.png`} type="image/x-icon"></link>
            </Head>
            {page}
            <AppConfig simple/>
        </React.Fragment>
    );
};
export default LoginPage;
