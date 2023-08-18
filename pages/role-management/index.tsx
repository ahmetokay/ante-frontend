import React, {useContext, useEffect, useRef, useState} from 'react';
import {Column} from 'primereact/column';
import {Button} from 'primereact/button';

import {InputText} from 'primereact/inputtext';
import {RoleService} from "../../service/RoleService";
import {Dialog} from "primereact/dialog";
import {useTranslation} from "react-i18next";
import {Tree} from 'primereact/tree';
import {PrivilegeService} from "../../service/PrivilegeService";
import {DateUtils} from "../../public/utils/dateUtils";
import ListComponent from "../../layout/ListComponent";
import {DEFAULT_PAGE_STATE} from "../../service/constants";
import {SplitButton} from "primereact/splitbutton";
import {MultiSelect} from "primereact/multiselect";
import {FilterMatchMode} from "primereact/api";
import {AuthService} from "../../service/AuthService";
import {PrivilegeConstant} from "../../service/privilegeConstant";
import {AuthContext} from "../../layout/context/authcontext";
import HistoryComponent from "../../layout/HistoryComponent";
import Export from "../../layout/Export";

const RoleTable = () => {

    const {user} = useContext(AuthContext);

    const {i18n, t} = useTranslation();

    let emptyRole: Role.RoleModel = {
        id: null,
        uniqueId: '',
        name: '',
        privilegeList: []
    };

    const [selectedRow, setSelectedRow] = useState<Role.RoleModel>(emptyRole);

    const [pageState, setPageState] = useState(DEFAULT_PAGE_STATE);
    const [filters, setFilters] = useState({
        id: {value: null},
        createDate: {value: null},
        name: {value: null},
        privilegeList: {value: null, matchMode: FilterMatchMode.IN}
    });

    const [roleDialog, setRoleDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [historyDialog, setHistoryDialog] = useState(false);

    const [selectedPrivilegeData, setSelectedPrivilegeData] = useState([]);

    const [treePrivilegeData, setTreePrivilegeData] = useState([]);
    const [privilegeData, setPrivilegeData] = useState([]);
    const [expandedKeys, setExpandedKeys] = useState({});

    const listComponentRef = useRef<typeof ListComponent>(ListComponent);

    const clearPage = () => {
        setSelectedRow(emptyRole);
        setSelectedPrivilegeData([])
    }

    useEffect(() => {
        getPrivilegeData();
    }, []);

    const getPrivilegeData = () => {

        PrivilegeService.getPrivilegeList().then((data) => {
            if (data) {
                let privilegeTreeData = []
                data.data.forEach((privilege) => {
                    if (privilege.parentId == null) {
                        privilegeTreeData.push(privilege)
                    }
                });

                let treeData = createPrivilegeTree(privilegeTreeData);

                setPrivilegeData(data.data)
                setTreePrivilegeData(treeData)
                setExpandedKeys(expandTreeObject)
            }
        });
    };

    const saveRole = () => {

        selectedRow.privilegeList = convertSelectedTreeToPrivilege();

        if (selectedRow.id) {
            RoleService.updateRole(selectedRow).then((data) => {
                if (data) {
                    setRoleDialog(false);
                    clearPage()
                    listComponentRef.current.refreshPage();
                }
            });
        } else {
            RoleService.saveRole(selectedRow).then((data) => {
                if (data) {
                    setRoleDialog(false);
                    clearPage()
                    listComponentRef.current.refreshPage();
                }
            });
        }
    };

    const deleteRole = () => {
        if (selectedRow.uniqueId) {
            RoleService.deleteRole(selectedRow.uniqueId).then((data) => {
                setDeleteDialog(false);

                listComponentRef.current.refreshPage();
            });
        }
    };

    const tableHeader = () => {
        return (
            <div className="flex justify-content-between">
                <Button label={t("button.new")} icon="pi pi-plus" severity="success" className="mr-2"
                        onClick={() => {
                            clearPage();
                            setRoleDialog(true);
                        }}/>

                <Export url='/roles/export' fileName={t('menu.roleManagement')} pageState={pageState} />
            </div>
        );
    };

    const privilegeColumnTemplate = (row: Role.RoleModel) => {
        return (
            <>
                {row.privilegeList.map((item) => item.title).join(', ')}
            </>
        );
    };

    const privilegeRowFilterTemplate = (options) => {
        return (
            <MultiSelect
                value={options.value}
                options={privilegeData}
                maxSelectedLabels={1} selectedItemsLabel={t('common.selectedItemsLabel')}
                onChange={(e) => options.filterApplyCallback(e.value)}
                optionLabel="title"
                className="p-column-filter"
                style={{minWidth: '14rem'}}
            />
        );
    };

    const actionColumnTemplate = (row: Role.RoleModel) => {
        return (
            <div className="actionButton">
                <SplitButton label={t("button.actions")} icon="pi pi-cog" model={[
                    {
                        label: t("button.edit"),
                        icon: 'pi pi-pencil',
                        command: () => {
                            setSelectedRow(row);
                            setSelectedPrivilegeData(convertPrivilegeToSelectedTree(row.privilegeList, []));
                            setRoleDialog(true);
                        },
                        visible: AuthService.checkPrivilege(user, PrivilegeConstant.ROLE_MANAGEMENT.UPDATE)
                    },
                    {
                        label: t("button.delete"),
                        icon: 'pi pi-trash',
                        command: () => {
                            setSelectedRow(row);
                            setDeleteDialog(true);
                        },
                        visible: AuthService.checkPrivilege(user, PrivilegeConstant.ROLE_MANAGEMENT.DELETE)
                    },
                    {
                        label: t("button.history"),
                        icon: 'pi pi-history',
                        command: () => {
                            setSelectedRow(row);
                            setHistoryDialog(true);
                        },
                        visible: AuthService.checkPrivilege(user, PrivilegeConstant.ROLE_MANAGEMENT.HISTORY)
                    },
                ]} text/>
            </div>
        );
    };

    const roleDialogFooter = (
        <>
            <Button label={t("common.cancel")} icon="pi pi-times" text onClick={() => setRoleDialog(false)}/>
            <Button label={t("common.save")} icon="pi pi-check" text onClick={saveRole}/>
        </>
    );

    const deleteDialogFooter = (
        <>
            <Button label={t("common.no")} icon="pi pi-times" text onClick={() => setDeleteDialog(false)}/>
            <Button label={t("common.yes")} icon="pi pi-check" text onClick={deleteRole}/>
        </>
    );

    // generic taraf
    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _data = {...selectedRow};
        _data[`${name}`] = val;

        setSelectedRow(_data);
    }

    let expandTreeObject = {}

    const createPrivilegeTree = (privilegeList) => {

        let treeDataArr = []

        for (let i = 0; i < privilegeList.length; i++) {
            let privilege = privilegeList[i];

            let treeChildren = [];

            let childPrivilegeList = privilege.childPrivilegeList
            if (childPrivilegeList.length > 0) {

                treeChildren = Object.assign([], createPrivilegeTree(childPrivilegeList))
            }

            let treeData = {
                key: privilege.id.toString(),
                label: privilege.title,
                children: treeChildren
            }

            expandTreeObject[privilege.id] = true

            treeDataArr.push(treeData)
        }

        return treeDataArr;
    };

    const convertPrivilegeToSelectedTree = (privilegeList, selectedDataArr) => {

        for (let i = 0; i < privilegeList.length; i++) {
            let privilege = privilegeList[i];
            selectedDataArr[privilege.id] = {
                checked: true,
                partialChecked: false
            }
        }

        return selectedDataArr;
    };

    const convertSelectedTreeToPrivilege = () => {
        let privilegeList = []

        Object.keys(selectedPrivilegeData).forEach(key => {
            if (selectedPrivilegeData[key].checked) {
                privilegeList.push({
                    id: key
                })
            }
        })

        return privilegeList;
    };

    return (
        <div>
            <ListComponent ref={listComponentRef}
                           title={t("menu.roleManagement")}
                           fetchDataMethod={RoleService.getRoleList}
                           header={tableHeader}
                           columns={
                               [
                                   <Column field="id" header={t("pages.roleManagement.id")} style={{width: '5%'}}
                                           dataType="numeric" showFilterMenu={false} showClearButton={false} filter
                                           sortable/>,
                                   <Column field="createDate" header={t("pages.roleManagement.createDate")}
                                           body={DateUtils.formatDate}
                                           dataType="date" showClearButton={false} filter sortable/>,
                                   <Column field="name" header={t("pages.roleManagement.name")}
                                           dataType="text" showClearButton={false} filter sortable/>,
                                   <Column header={t("pages.roleManagement.privilegeList")}
                                           showFilterMenu={false} showClearButton={false}
                                           body={privilegeColumnTemplate} filter filterField="privilegeList"
                                           filterElement={privilegeRowFilterTemplate}/>,
                                   <Column body={actionColumnTemplate} headerStyle={{width: '5%'}}/>
                               ]
                           }
                           pageState={pageState}
                           setPageState={setPageState}
                           filters={filters}
                           setFilters={setFilters}
                           selectedRow={selectedRow}
                           setSelectedRow={setSelectedRow}
            />

            <Dialog visible={roleDialog} style={{width: '450px'}} header={t("pages.roleManagement.createRole")}
                    footer={roleDialogFooter}
                    modal className="p-fluid"
                    onHide={() => setRoleDialog(false)}>
                <div className="field">
                    <label htmlFor="name1">{t("pages.roleManagement.name")}</label>
                    <InputText id="name1" value={selectedRow?.name} required autoFocus
                               onChange={(e) => onChange(e, 'name')}/>
                </div>
                <div className="field">
                    <label htmlFor="privilegeTree1">{t("pages.roleManagement.choosePrivilege")}</label>
                    <Tree id="privilegeTree1" value={treePrivilegeData}
                          expandedKeys={expandedKeys} onToggle={(e) => setExpandedKeys(e.value)}
                          selectionMode="checkbox" selectionKeys={selectedPrivilegeData}
                          onSelectionChange={(e) => setSelectedPrivilegeData(e.value)} className="w-full md:w-30rem"/>
                </div>
            </Dialog>

            <Dialog visible={deleteDialog} style={{width: '450px'}} footer={deleteDialogFooter}
                    modal onHide={() => setDeleteDialog(false)}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{fontSize: '2rem'}}/>
                    {selectedRow && (
                        <div
                            dangerouslySetInnerHTML={{__html: i18n.t("common.deleteMessage", {name: selectedRow.name})}}/>
                    )}
                </div>
            </Dialog>

            <Dialog visible={historyDialog} style={{width: '80%'}} header={t("common.history")} modal
                    onHide={() => setHistoryDialog(false)}>

                <HistoryComponent id={selectedRow.id} fetchDataMethod={RoleService.getHistory} columns={[
                    <Column field="revisionType" header={t("label.revisionType")}/>,
                    <Column field="createDate" header={t("label.createDate")}
                            body={DateUtils.formatDate} sortable/>,
                    <Column field="createUser" header={t("label.createUser")} style={{width: '5%'}}
                            sortable/>,
                    <Column field="updateDate" header={t("label.updateDate")}
                            body={DateUtils.formatDate} sortable/>,
                    <Column field="updateUser" header={t("label.updateUser")} style={{width: '5%'}}
                            sortable/>,
                    <Column field="name" header={t("pages.roleManagement.name")} sortable/>,
                    <Column header={t("pages.roleManagement.privilegeList")} body={privilegeColumnTemplate}/>,
                ]}/>
            </Dialog>
        </div>
    );
};

export default RoleTable;