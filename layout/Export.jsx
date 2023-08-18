import React from "react";

import {useTranslation} from "react-i18next";
import {Button} from "primereact/button";
import {ExportService} from "../service/ExportService";
import {SplitButton} from "primereact/splitbutton";

function Export(props) {

    const {t, i18n} = useTranslation();
    const items = [
        {
            label: t('button.excel'),
            command: (e) => {
                download(props.url, i18n.language, 'EXCEL', props.fileName + '.xlsx', props.pageState)
            }
        },
        {
            label: t('button.word'),
            command: (e) => {
                download(props.url, i18n.language, 'WORD', props.fileName + '.docx', props.pageState)
            }
        }
    ]
    const downloadFile = (event) => {
        download(props.url, i18n.language, 'PDF', props.fileName + '.pdf', props.pageState)
    }

    const download = (url, language, exportType, fileName, pageState) => {

        ExportService.export(url, pageState, language, exportType).then(blob => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
        }).catch((error) => {
            console.log('error ' + error);
        });
    }

    return (
        <SplitButton label={t('button.export')} icon="pi pi-download" onClick={downloadFile} model={items}></SplitButton>
    );
}

export default Export