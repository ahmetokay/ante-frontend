import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {DataTable} from 'primereact/datatable';
import {Toast} from "primereact/toast";

import {useTranslation} from "react-i18next";

interface ListComponentProps {
    title: string,
    header: any,
    columns: any[],
    fetchDataMethod: any,
    pageState: any,
    setPageState: any,
    filters?: any,
    setFilters?: any,
    selectedRow: any,
    setSelectedRow: any,
}

const ListComponent = forwardRef(({
                                      title,
                                      header,
                                      columns,
                                      fetchDataMethod,
                                      pageState,
                                      setPageState,
                                      filters,
                                      setFilters,
                                      selectedRow,
                                      setSelectedRow
                                  }: ListComponentProps, ref) => {

    useImperativeHandle(
        ref,
        () => ({
            refreshPage() {
                getData();
            },
        }),
    )

    const {t} = useTranslation();

    const toast = useRef<Toast>(null);

    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);

    useEffect(() => {
        getData();
    }, [pageState]);

    const getData = () => {
        setLoading(true);

        fetchDataMethod(pageState).then((dd) => {
            if (dd) {
                setData(dd.data);
                setTotalRecords(dd.totalElements);
            }
        }).finally(() => setLoading(false));
    }

    const onPage = (event) => {
        setPageState(prevState => ({
            ...prevState,
            pageable: {...prevState.pageable, page: event.page, size: event.rows}
        }))
    };

    const onSort = (event) => {
        setPageState(prevState => ({
            ...prevState,
            pageable: {
                ...prevState.pageable,
                sortField: event.sortField,
                sortOrder: event.sortOrder == 1 ? 'ASC' : 'DESC'
            }
        }))
    };

    const handleFilterChange = (e) => {
        let filterArr = []

        Object.entries(e.filters).forEach(([key, value]) => {
            if (value.value) {
                if (Array.isArray(value.value)) {
                    let idList = []
                    value.value.forEach((obj) => {
                        idList.push(obj.id)
                    })
                    filterArr.push({
                        fieldName: key,
                        value: idList.join(','),
                        operation: value.matchMode ? value.matchMode : "equals"
                    })
                } else {
                    filterArr.push({
                        fieldName: key,
                        value: value.value,
                        operation: value.matchMode ? value.matchMode : "equals"
                    })
                }
            }
        })

        setFilters(e.filters)
        setPageState(prevState => ({
            ...prevState,
            filters: filterArr
        }))
    }

    return (
        <div className="grid">
            <Toast ref={toast}/>

            <div className="col-12">
                <div className="card">
                    <h5>{title}</h5>
                    <DataTable
                        value={data}
                        size="small"
                        lazy
                        filterDisplay="row" filters={filters} onFilter={handleFilterChange}
                        selection={selectedRow} onSelectionChange={(e) => setSelectedRow(e.value)}
                        first={pageState.pageable.page * pageState.pageable.size} rows={pageState.pageable.size}
                        totalRecords={totalRecords} onPage={onPage}
                        removableSort onSort={onSort} sortField={pageState.pageable.sortField}
                        sortOrder={pageState.pageable.sortOrder == 'ASC' ? 1 : -1}
                        paginator
                        rowsPerPageOptions={[10, 50, 100]}
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        currentPageReportTemplate={t('common.paginationTemplate')}
                        className="p-datatable-gridlines"
                        stripedRows
                        dataKey="id"
                        scrollable
                        loading={loading}
                        header={header}
                    >
                        {columns}
                    </DataTable>
                </div>
            </div>
        </div>
    );
});

export default ListComponent;