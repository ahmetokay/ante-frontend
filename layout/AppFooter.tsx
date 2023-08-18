import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="layout-footer">
            <span><b>© {(new Date().getFullYear())}</b> - Ante Grup Bilişim</span>
        </div>
    );
};

export default AppFooter;
