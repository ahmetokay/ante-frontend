import {RequestService} from "./RequestService";
import {API_HOST} from "./constants";

export const AccessLogService = {

    getAccessLogList(pageState: any) {
        return RequestService.post(`${API_HOST}/access-log/list`, pageState).then((d) => d.body as AccessLog.ListResult);
    },
};