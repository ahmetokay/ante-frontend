/* eslint-disable react-hooks/exhaustive-deps */

import Head from 'next/head';
import {useRouter} from 'next/router';
import {useEventListener, useMountEffect, useUnmountEffect} from 'primereact/hooks';
import {classNames} from 'primereact/utils';
import React, {useContext, useEffect, useRef} from 'react';
import AppFooter from './AppFooter';
import AppSidebar from './AppSidebar';
import AppTopbar from './AppTopbar';
import AppConfig from './AppConfig';
import {LayoutContext} from './context/layoutcontext';
import PrimeReact from 'primereact/api';
import {AppTopbarRef, ChildContainerProps, LayoutState} from '../types/types';
import {Toast, ToastMessage} from "primereact/toast";
import fetchIntercept from 'fetch-intercept';

const Layout = ({children}: ChildContainerProps) => {

    const toast = useRef<Toast>(null);

    const {layoutConfig, layoutState, setLayoutState} = useContext(LayoutContext);
    const topbarRef = useRef<AppTopbarRef>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);

    const router = useRouter();
    const [bindMenuOutsideClickListener, unbindMenuOutsideClickListener] = useEventListener({
        type: 'click',
        listener: (event) => {
            const isOutsideClicked = !(
                sidebarRef.current?.isSameNode(event.target as Node) ||
                sidebarRef.current?.contains(event.target as Node) ||
                topbarRef.current?.menubutton?.isSameNode(event.target as Node) ||
                topbarRef.current?.menubutton?.contains(event.target as Node)
            );

            if (isOutsideClicked) {
                hideMenu();
            }
        }
    });

    const [bindProfileMenuOutsideClickListener, unbindProfileMenuOutsideClickListener] = useEventListener({
        type: 'click',
        listener: (event) => {
            const isOutsideClicked = !(
                topbarRef.current?.topbarmenu?.isSameNode(event.target as Node) ||
                topbarRef.current?.topbarmenu?.contains(event.target as Node) ||
                topbarRef.current?.topbarmenubutton?.isSameNode(event.target as Node) ||
                topbarRef.current?.topbarmenubutton?.contains(event.target as Node)
            );

            if (isOutsideClicked) {
                hideProfileMenu();
            }
        }
    });

    const hideMenu = () => {
        setLayoutState((prevLayoutState: LayoutState) => ({
            ...prevLayoutState,
            overlayMenuActive: false,
            staticMenuMobileActive: false,
            menuHoverActive: false
        }));
        unbindMenuOutsideClickListener();
        unblockBodyScroll();
    };

    const hideProfileMenu = () => {
        setLayoutState((prevLayoutState: LayoutState) => ({...prevLayoutState, profileSidebarVisible: false}));
        unbindProfileMenuOutsideClickListener();
    };

    const blockBodyScroll = (): void => {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    };

    const unblockBodyScroll = (): void => {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    };

    useMountEffect(() => {
        PrimeReact.ripple = true;
    })

    useEffect(() => {
        if (layoutState.overlayMenuActive || layoutState.staticMenuMobileActive) {
            bindMenuOutsideClickListener();
        }

        layoutState.staticMenuMobileActive && blockBodyScroll();
    }, [layoutState.overlayMenuActive, layoutState.staticMenuMobileActive]);

    useEffect(() => {
        if (layoutState.profileSidebarVisible) {
            bindProfileMenuOutsideClickListener();
        }
    }, [layoutState.profileSidebarVisible]);

    useEffect(() => {
        router.events.on('routeChangeComplete', () => {
            hideMenu();
            hideProfileMenu();
        });

        fetchIntercept.register({
            request: function (url, config) {
                return [url, config];
            },
            requestError: function (error) {
                return Promise.reject(error);
            },
            response: function (response) {
                if (response.type == 'cors') {
                    response.clone().text().then((text: string) => {
                        if (response.ok && text.trim() != "") {
                            try {
                                const data = JSON.parse(text);
                                if (data.success != undefined && data.success === false) {
                                    if ([401, 403].includes(data.statusCode)) {
                                        router.push('/login?redirected=true').then((d) => {
                                            sessionStorage.removeItem("access_token");
                                            sessionStorage.removeItem("refresh_token");
                                        });
                                        return Promise.reject();
                                    }

                                    let toastArray: ToastMessage[] = [];
                                    data.messageList.forEach((err: string) => {
                                        let severityObj: ToastMessage = {
                                            severity: 'error',
                                            summary: '',
                                            detail: err,
                                            life: 3000
                                        };
                                        toastArray.push(severityObj);
                                    });
                                    if (toastArray.length > 0) {
                                        toast?.current?.show(toastArray);
                                    }

                                    return Promise.reject();
                                }
                            } catch (e) {
                                return response;
                            }
                        } else {
                            if ([401, 403].includes(response.status)) {
                                router.push('/login?redirected=true').then((d) => {
                                    sessionStorage.removeItem("access_token");
                                    sessionStorage.removeItem("refresh_token");
                                });
                                return Promise.reject();
                            }
                        }
                    });
                }

                return response;
            },
            responseError: function (error) {
                return Promise.reject(error);
            }
        })
    }, []);

    useUnmountEffect(() => {
        unbindMenuOutsideClickListener();
        unbindProfileMenuOutsideClickListener();
    });

    const containerClass = classNames('layout-wrapper', {
        'layout-overlay': layoutConfig.menuMode === 'overlay',
        'layout-static': layoutConfig.menuMode === 'static',
        'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive,
        'layout-mobile-active': layoutState.staticMenuMobileActive,
        'p-input-filled': layoutConfig.inputStyle === 'filled',
        'p-ripple-disabled': !layoutConfig.ripple
    });

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

            <div className={containerClass}>
                <Toast ref={toast}/>
                <AppTopbar ref={topbarRef}/>
                <div ref={sidebarRef} className="layout-sidebar">
                    <AppSidebar/>
                </div>
                <div className="layout-main-container">
                    <div className="layout-main">{children}</div>
                    <AppFooter/>
                </div>
                <AppConfig/>
                <div className="layout-mask"></div>
            </div>
        </React.Fragment>
    );
};

export default Layout;
