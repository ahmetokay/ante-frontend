import React, {useContext, useEffect, useRef, useState} from 'react';
import {Column} from 'primereact/column';
import {Button} from 'primereact/button';

import {InputText} from 'primereact/inputtext';
import {Dialog} from "primereact/dialog";
import {UserService} from "../../service/UserService";
import {useTranslation} from "react-i18next";
import ListComponent from "../../layout/ListComponent";
import {Password} from "primereact/password";
import {RoleService} from "../../service/RoleService";
import {MultiSelect} from "primereact/multiselect";
import {DEFAULT_PAGE_STATE} from "../../service/constants";
import {FilterMatchMode} from "primereact/api";
import {SplitButton} from "primereact/splitbutton";
import {AuthService} from "../../service/AuthService";
import {AuthContext} from "../../layout/context/authcontext";
import {PrivilegeConstant} from "../../service/privilegeConstant";
import HistoryComponent from "../../layout/HistoryComponent";
import {DateUtils} from "../../public/utils/dateUtils";
import Export from "../../layout/Export";

const UserTable = () => {

    const {user} = useContext(AuthContext);

    const {i18n, t} = useTranslation();

    let emptyUser: User.UserModel = {
        id: null,
        uniqueId: '',
        name: '',
        surname: '',
        address: '',
        roleList: []
    };

    const [selectedRow, setSelectedRow] = useState<User.UserModel>(emptyUser);

    const [pageState, setPageState] = useState(DEFAULT_PAGE_STATE);
    const [filters, setFilters] = useState({
        id: {value: null},
        email: {value: null},
        name: {value: null},
        surname: {value: null},
        roleList: {value: null, matchMode: FilterMatchMode.IN}
    });

    const [userDialog, setUserDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [historyDialog, setHistoryDialog] = useState(false);

    const [roleData, setRoleData] = useState([]);

    const listComponentRef = useRef<typeof ListComponent>(ListComponent);

    const clearPage = () => {
        setSelectedRow(emptyUser);
    }

    useEffect(() => {
        getRoleData();
    }, []);

    const getRoleData = () => {

        RoleService.getAllRoleList().then((data) => {
            if (data) {
                setRoleData(data.data);
            }
        });
    };

    const saveUser = () => {

        if (selectedRow.id) {
            UserService.updateUser(selectedRow).then((data) => {
                if (data) {
                    setUserDialog(false);
                    clearPage()

                    listComponentRef.current.refreshPage();
                }
            });
        } else {
            UserService.saveUser(selectedRow).then((data) => {
                if (data) {
                    setUserDialog(false);
                    clearPage()

                    listComponentRef.current.refreshPage();
                }
            });
        }
    };

    const deleteUser = () => {

        if (selectedRow.uniqueId) {
            UserService.deleteUser(selectedRow.uniqueId).then((data) => {
                setDeleteDialog(false);
                clearPage()

                listComponentRef.current.refreshPage();
            });
        }
    };

    const tableHeader = () => {
        return (
            <div className="flex justify-content-between">
                <Button label={t("button.new")} icon="pi pi-plus" severity="success" className=" mr-2"
                        onClick={() => {
                            clearPage();
                            setUserDialog(true);
                        }}/>

                <Export url='/users/export' fileName={t('menu.userManagement')} pageState={pageState} />
            </div>
        );
    };

    const roleColumnTemplate = (row: User.UserModel) => {
        return (
            <>
                {row.roleList.map((item) => item.name).join(', ')}
            </>
        );
    };

    const roleRowFilterTemplate = (options) => {
        return (
            <MultiSelect
                value={options.value}
                options={roleData}
                maxSelectedLabels={1} selectedItemsLabel={t('common.selectedItemsLabel')}
                onChange={(e) => options.filterApplyCallback(e.value)}
                optionLabel="name"
                className="p-column-filter"
                style={{minWidth: '14rem'}}
            />
        );
    };

    const actionColumnTemplate = (row: User.UserModel) => {
        return (
            <div className="actionButton">
                <SplitButton label={t("button.actions")} icon="pi pi-cog" defaultChecked={true} model={[
                    {
                        label: t("button.edit"),
                        icon: 'pi pi-pencil',
                        command: (e) => {
                            setSelectedRow(row);
                            setUserDialog(true);
                        },
                        visible: AuthService.checkPrivilege(user, PrivilegeConstant.USER_MANAGEMENT.UPDATE)
                    },
                    {
                        label: t("button.delete"),
                        icon: 'pi pi-trash',
                        command: (e) => {
                            setSelectedRow(row);
                            setDeleteDialog(true);
                        },
                        visible: AuthService.checkPrivilege(user, PrivilegeConstant.USER_MANAGEMENT.DELETE)
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
            <Button label={t("common.cancel")} icon="pi pi-times" text onClick={() => setUserDialog(false)}/>
            <Button label={t("common.save")} icon="pi pi-check" text onClick={saveUser}/>
        </>
    );

    const deleteDialogFooter = (
        <>
            <Button label={t("common.no")} icon="pi pi-times" text onClick={() => setDeleteDialog(false)}/>
            <Button label={t("common.yes")} icon="pi pi-check" text onClick={deleteUser}/>
        </>
    );

    // generic taraf
    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _data = {...selectedRow};
        _data[`${name}`] = val;

        setSelectedRow(_data);
    }

    return (
        <div>
            <ListComponent ref={listComponentRef}
                           title={t("menu.userManagement")}
                           fetchDataMethod={UserService.getUserList}
                           header={tableHeader}
                           columns={
                               [
                                   <Column field="id" header={t("pages.userManagement.id")} style={{width: '5%'}}
                                           dataType="numeric" showFilterMenu={false} showClearButton={false} filter
                                           sortable/>,
                                   <Column field="createDate" header={t("pages.userManagement.createDate")}
                                           body={DateUtils.formatDate}
                                           dataType="date" showClearButton={false} filter sortable/>,
                                   <Column field="email" header={t("pages.userManagement.email")}
                                           dataType="text" showClearButton={false} filter sortable/>,
                                   <Column field="name" header={t("pages.userManagement.name")}
                                           dataType="text" showClearButton={false} filter sortable/>,
                                   <Column field="surname" header={t("pages.userManagement.surname")}
                                           dataType="text" showClearButton={false} filter sortable/>,
                                   <Column header={t("pages.userManagement.roleList")}
                                           showFilterMenu={false} showClearButton={false}
                                           body={roleColumnTemplate} filter filterField="roleList"
                                           filterElement={roleRowFilterTemplate}/>,
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

            <Dialog visible={userDialog} style={{width: '450px'}} header={t("pages.userManagement.createUser")}
                    footer={roleDialogFooter}
                    modal className="p-fluid"
                    onHide={() => setUserDialog(false)}>

                <div className="field">
                    <label htmlFor="email1">{t("pages.userManagement.email")}</label>
                    <InputText id="email1" value={selectedRow?.email} required autoFocus
                               onChange={(e) => onChange(e, 'email')}/>
                </div>

                <div className="field">
                    <label htmlFor="password1">{t("pages.userManagement.password")}</label>
                    <Password id="password1" value={selectedRow?.password} required toggleMask
                              onChange={(e) => onChange(e, 'password')}/>
                </div>

                <div className="field">
                    <label htmlFor="name1">{t("pages.userManagement.name")}</label>
                    <InputText id="name1" value={selectedRow?.name} required
                               onChange={(e) => onChange(e, 'name')}/>
                </div>

                <div className="field">
                    <label htmlFor="surname1">{t("pages.userManagement.surname")}</label>
                    <InputText id="surname1" value={selectedRow?.surname} required
                               onChange={(e) => onChange(e, 'surname')}/>
                </div>

                <div className="field">
                    <label htmlFor="role1">{t("pages.userManagement.selectRole")}</label>
                    <MultiSelect id="role1" options={roleData} optionLabel="name"
                                 maxSelectedLabels={3} selectedItemsLabel={t('common.selectedItemsLabel')}
                                 value={selectedRow.roleList}
                                 onChange={(e) => setSelectedRow({...selectedRow, roleList: e.value})}
                                 placeholder={t("pages.userManagement.selectRole")}/>
                </div>

            </Dialog>

            <Dialog visible={deleteDialog} style={{width: '450px'}} footer={deleteDialogFooter}
                    modal onHide={() => setDeleteDialog(false)}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{fontSize: '2rem'}}/>
                    {selectedRow && (
                        <div dangerouslySetInnerHTML={{__html: i18n.t("common.deleteMessage", {name: selectedRow.name + ' ' + selectedRow.surname})}} />
                    )}
                </div>
            </Dialog>

            <Dialog visible={historyDialog} style={{width: '80%'}} header={t("common.history")} modal onHide={() => setHistoryDialog(false)}>

                <HistoryComponent id={selectedRow.id} fetchDataMethod={UserService.getHistory} columns={[
                    <Column field="revisionType" header={t("label.revisionType")}/>,
                    <Column field="createDate" header={t("label.createDate")}
                            body={DateUtils.formatDate} sortable/>,
                    <Column field="createUser" header={t("label.createUser")} style={{width: '5%'}}
                            sortable/>,
                    <Column field="updateDate" header={t("label.updateDate")}
                            body={DateUtils.formatDate} sortable/>,
                    <Column field="updateUser" header={t("label.updateUser")} style={{width: '5%'}}
                            sortable/>,
                    <Column field="email" header={t("pages.userManagement.email")} sortable/>,
                    <Column field="name" header={t("pages.userManagement.name")} sortable/>,
                    <Column field="surname" header={t("pages.userManagement.surname")} sortable/>,
                    <Column header={t("pages.userManagement.roleList")} body={roleColumnTemplate}/>,
                ]} />
            </Dialog>
        </div>
    );
};

export default UserTable;