/* eslint-disable @next/next/no-img-element */

import React from 'react';
import AppMenuitem from './AppMenuitem';
import {MenuProvider} from './context/menucontext';
import {AppMenuItem} from '../types/types';
import {useTranslation} from "react-i18next";
import {PrivilegeConstant} from "../service/privilegeConstant";

const AppMenu = () => {

    const {t} = useTranslation();

    const model: AppMenuItem[] = [
        {
            label: '',
            items: [
                {
                    label: t('menu.dashboard'),
                    icon: 'pi pi-fw pi-home',
                    to: '/'
                },
                {
                    label: t('menu.userManagement'),
                    icon: 'pi pi-fw pi-user',
                    to: '/user-management',
                    privilege: PrivilegeConstant.USER_MANAGEMENT.LIST
                },
                {
                    label: t('menu.roleManagement'),
                    icon: 'pi pi-fw pi-eye',
                    to: '/role-management',
                    privilege: PrivilegeConstant.ROLE_MANAGEMENT.LIST
                },
                {
                    label: t('menu.accessLog'),
                    icon: 'pi pi-fw pi-list',
                    to: '/access-log',
                    privilege: PrivilegeConstant.ACCESS_LOG.LIST
                }
            ]
        },
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label}/> :
                        <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
