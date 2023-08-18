declare namespace Privilege {

    import BaseModel = Base.BaseModel;

    interface ListResult {
        data: PrivilegeModel[],
        totalElements: number
    }

    interface PrivilegeModel extends BaseModel{
        name: string
        title: string
        parentId: number
        childPrivilegeList: PrivilegeModel[]
    }
}