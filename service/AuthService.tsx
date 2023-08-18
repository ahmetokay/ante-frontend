import {RequestService} from "./RequestService";
import {AUTH_HOST} from "./constants";

export const AuthService = {

    login(email: String, password: String) {
        return RequestService.post(`${AUTH_HOST}/login`, {
            email,
            password
        }).then((d) => d as Auth.AuthModel);
    },

    logout() {
        return RequestService.post(`${AUTH_HOST}/logout`);
    },

    checkPrivilege(user: User.UserModel, privilege: string) {
        let privilegeList = []
        user?.roleList.forEach((role) => {
            if (role.privilegeList) {
                role.privilegeList.forEach((privilege) => privilegeList.push(privilege.name))
            }
        })

        if (privilegeList.indexOf(privilege) != -1) {
            return true;
        } else {
            return false
        }
    }
};