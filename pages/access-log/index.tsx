import React, {useRef, useState} from 'react';
import {Column} from 'primereact/column';
import {useTranslation} from "react-i18next";
import {DateUtils} from "../../public/utils/dateUtils";
import ListComponent from "../../layout/ListComponent";
import Export from "../../layout/Export";
import {AccessLogService} from "../../service/AccessLogService";
import {InputTextarea} from "primereact/inputtextarea";

const AccessLogTable = () => {

    const {i18n, t} = useTranslation();

    const [pageState, setPageState] = useState({
        filters: [],
        pageable: {
            page: 0,
            size: 10,
            sortField: 'date',
            sortOrder: 'DESC'
        }
    });
    const [filters, setFilters] = useState({
        userId: {value: null},
        date: {value: null},
        servletPath: {value: null},
        method: {value: null},
        request: {value: null},
        response: {value: null},
    });

    const listComponentRef = useRef<typeof ListComponent>(ListComponent);

    const tableHeader = () => {
        return (
            <div className="flex justify-content-between">
                <div></div>
                <Export url='/access-log/export' fileName={t('menu.accessLog')} pageState={pageState}/>
            </div>
        );
    };

    const requestColumnTemplate = (row: AccessLog.AccessLogModel) => {
        return (
            <>
                <InputTextarea style={{width: "100%"}} contentEditable={false} rows={5} cols={30} value={row.request} />
            </>
        );
    };

    const responseColumnTemplate = (row: AccessLog.AccessLogModel) => {
        return (
            <>
                <InputTextarea style={{width: "100%"}} contentEditable={false} rows={5} cols={30} value={row.response} />
            </>
        );
    };

    return (
        <div>
            <ListComponent ref={listComponentRef}
                           title={t("menu.accessLog")}
                           fetchDataMethod={AccessLogService.getAccessLogList}
                           header={tableHeader}
                           columns={
                               [
                                   <Column field="userId" header={t("pages.accessLog.userId")} style={{width: '5%'}}
                                           dataType="numeric" showFilterMenu={false} showClearButton={false} filter
                                           sortable/>,
                                   <Column field="date" header={t("pages.accessLog.date")}
                                           body={DateUtils.formatDate}
                                           dataType="date" showClearButton={false} sortable/>,
                                   <Column field="servletPath" header={t("pages.accessLog.servletPath")}
                                           dataType="text" showClearButton={false} sortable/>,
                                   <Column field="method" header={t("pages.accessLog.method")}
                                           dataType="text" showClearButton={false} sortable/>,
                                   <Column field="duration" header={t("pages.accessLog.duration")}
                                           dataType="numeric" showClearButton={false} sortable/>,
                                   <Column field="request" header={t("pages.accessLog.request")}
                                           body={requestColumnTemplate}
                                           dataType="text" showClearButton={false} sortable/>,
                                   <Column field="response" header={t("pages.accessLog.response")}
                                           body={responseColumnTemplate}
                                           dataType="text" showClearButton={false} sortable/>,
                               ]
                           }
                           pageState={pageState}
                           setPageState={setPageState}
                           filters={filters}
                           setFilters={setFilters}
            />
        </div>
    );
};

export default AccessLogTable;