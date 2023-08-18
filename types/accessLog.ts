declare namespace AccessLog {

    import BaseModel = Base.BaseModel;

    interface ListResult {
        data: AccessLogModel[],
        totalElements: number
    }

    interface AccessLogModel extends BaseModel {
        userId: number
        servletPath: string
        method: string
        request: string
        response: string
    }
}