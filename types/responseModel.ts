declare namespace Response {

    interface ResponseModel {
        body: any
        messageList: string[]
        success: boolean
        statusCode: number
    }
}