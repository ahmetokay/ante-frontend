import {RequestService} from "./RequestService";
import {API_HOST} from "./constants";

export const PrivilegeService = {

    getPrivilegeList() {
        return RequestService.post(`${API_HOST}/privileges/list-all`).then((d) => d.body as Privilege.ListResult);
    },
};