declare namespace User {

    import BaseModel = Base.BaseModel;
    import RoleModel = Role.RoleModel;

    interface ListResult {
        data: UserModel[],
        totalElements: number
    }

    interface UserModel extends BaseModel {
        email: string
        password: string
        name: string
        surname: string
        address: string
        roleList: RoleModel[]
    }
}