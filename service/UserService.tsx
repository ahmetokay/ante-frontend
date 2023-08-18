import {RequestService} from "./RequestService";
import {API_HOST, AUTH_HOST} from "./constants";

export const UserService = {
    getUserList(pageState: any) {
        return RequestService.post(`${API_HOST}/users/list`, pageState).then((d) => d.body as User.ListResult);
    },

    saveUser(role: User.UserModel) {
        return RequestService.post(`${API_HOST}/users/user`, role).then((d) => d.body as User.UserModel);
    },

    updateUser(role: User.UserModel) {
        return RequestService.put(`${API_HOST}/users/user`, role).then((d) => d.body as User.UserModel);
    },

    deleteUser(uniqueId: string) {
        return RequestService.delete(`${API_HOST}/users/${uniqueId}`);
    },

    getHistory(id: number) {
        return RequestService.post(`${API_HOST}/users/history/${id}`).then((d) => d.body as User.ListResult);
    },

    getCurrentUser() {
        return RequestService.post(`${AUTH_HOST}/get-current-user`).then((d) => d.body as User.UserModel);
    },
};