import {RequestService} from "./RequestService";
import {API_HOST} from "./constants";

export const ExportService = {

    export(path: string, pageState: any, language: string, exportType: string) {
        return RequestService.download(`${API_HOST}${path}`, pageState, language, exportType).then((d) => d.blob());
    },
};