/* eslint-disable @next/next/no-img-element */

import React from 'react';
import {ProgressSpinner} from 'primereact/progressspinner';

const AppLoading = () => {
    return (
        <div style={{position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)"}}>
            <ProgressSpinner strokeWidth="4"/>
        </div>
    );
};

export default AppLoading;