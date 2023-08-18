import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import {DataTable} from 'primereact/datatable';
import {Toast} from "primereact/toast";

import {useTranslation} from "react-i18next";

interface HistoryComponentProps {
    id: number,
    columns: any[],
    fetchDataMethod: any,
}

const HistoryComponent = forwardRef(({id, columns, fetchDataMethod}: HistoryComponentProps, ref) => {

    useImperativeHandle(
        ref,
        () => ({
            refreshPage() {
                getData();
            },
        }),
    )

    const {t} = useTranslation();

    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        setLoading(true);

        fetchDataMethod(id).then((dd) => {
            if (dd) {
                setData(dd.data);
                setTotalRecords(dd.totalElements);
            }
        }).finally(() => setLoading(false));
    }

    return (
        <DataTable
            value={data}
            size="small"
            totalRecords={totalRecords}
            paginator
            rows={10}
            rowsPerPageOptions={[10, 50, 100]}
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            currentPageReportTemplate={t('common.paginationTemplate')}
            className="p-datatable-gridlines"
            stripedRows
            dataKey="id"
            scrollable
            loading={loading}
        >
            {columns}
        </DataTable>
    );
});

export default HistoryComponent;