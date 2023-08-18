declare namespace Role {

    import BaseModel = Base.BaseModel;

    interface ListResult {
        data: RoleModel[],
        totalElements: number
    }

    interface RoleModel extends BaseModel {
        name: string
        privilegeList: Privilege.PrivilegeModel[]
    }
}