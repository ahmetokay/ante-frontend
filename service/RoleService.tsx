import {RequestService} from "./RequestService";
import {API_HOST} from "./constants";

export const RoleService = {

    getAllRoleList() {
        return RequestService.post(`${API_HOST}/roles/list-all`).then((d) => d.body as Role.ListResult);
    },

    getRoleList(pageState: any) {
        return RequestService.post(`${API_HOST}/roles/list`, pageState).then((d) => d.body as Role.ListResult);
    },

    saveRole(role: Role.RoleModel) {
        return RequestService.post(`${API_HOST}/roles/role`, role).then((d) => d.body as Role.RoleModel);
    },

    updateRole(role: Role.RoleModel) {
        return RequestService.put(`${API_HOST}/roles/role`, role).then((d) => d.body as Role.RoleModel);
    },

    deleteRole(uniqueId: string) {
        return RequestService.delete(`${API_HOST}/roles/${uniqueId}`);
    },

    getHistory(id: number) {
        return RequestService.post(`${API_HOST}/roles/history/${id}`).then((d) => d.body as Role.ListResult);
    },
};