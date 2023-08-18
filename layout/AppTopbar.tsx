/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import {classNames} from 'primereact/utils';
import React, {forwardRef, useContext, useImperativeHandle, useRef} from 'react';
import {AppTopbarRef} from '../types/types';
import {LayoutContext} from './context/layoutcontext';
import {Button} from "primereact/button";
import {useTranslation} from "react-i18next";
import {AuthService} from "../service/AuthService";
import {useRouter} from "next/router";
import Language from "./Language";

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {

    const {t} = useTranslation();
    const router = useRouter();
    const {layoutConfig, layoutState, onMenuToggle, showProfileSidebar} = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    const logout = () => {
        AuthService.logout().then(() => {
            sessionStorage.removeItem('access_token');
            sessionStorage.removeItem('refresh_token');
            router.push('/login')
        })
    };

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                <img src={`/layout/images/antegrup_logo_${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.png`}
                     width="250px" height="60px" alt="logo"/>
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button"
                    onClick={onMenuToggle}>
                <i className="pi pi-bars"/>
            </button>

            <button ref={topbarmenubuttonRef} type="button"
                    className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v"/>
            </button>

            <div ref={topbarmenuRef}
                 className={classNames('layout-topbar-menu', {'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible})}>
                <div className="p-mr-3">
                    <Language/>
                </div>

                <button type="button" className="p-link layout-topbar-button">
                    <i className="pi pi-calendar"></i>
                    <span>Calendar</span>
                </button>
                <button type="button" className="p-link layout-topbar-button">
                    <i className="pi pi-user"></i>
                    <span>Profile</span>
                </button>
                <Button rounded text severity="danger" onClick={() => logout()}
                        tooltip={t("common.logout")} tooltipOptions={{position: "bottom"}}>
                    <i className="pi pi-sign-out"></i>
                </Button>
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
