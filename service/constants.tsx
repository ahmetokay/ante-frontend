export const AUTH_HOST: string = `http://${process.env.AUTH_HOST || "localhost:5050"}/auth`
export const API_HOST: string = `http://${process.env.API_HOST || "localhost:5055"}/api`

export const DEFAULT_PAGE_STATE: object = {
    filters: [],
    pageable: {
        page: 0,
        size: 10,
        sortField: 'id',
        sortOrder: 'DESC'
    }
};