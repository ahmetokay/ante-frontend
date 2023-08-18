import moment from 'moment';

export const DateUtils = {

    formatDate(rowData, column) {
        if (rowData && column && rowData[column.field]) {
            return moment(rowData[column.field]).format('DD.MM.YYYY HH:mm:ss')
        }

        return null;
    },
};