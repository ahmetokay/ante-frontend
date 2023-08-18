import Router from "next/router";

export const RequestService = {

    get(url: URL) {
        const requestOptions: any = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,POST,DELETE,PUT,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type', ...this.getAuthHeader()
            }
        };
        return fetch(url, requestOptions).then((d) => d.ok ? d.json() : Promise.reject(d.status));
    },

    post(url: string, body?: any) {
        const requestOptions: any = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,POST,DELETE,PUT,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type', ...this.getAuthHeader()
            },
        };
        if (body) {
            requestOptions.body = JSON.stringify(body)
        }
        return fetch(url, requestOptions).then(this.handleResponse);
    },

    put(url: string, body?: any) {
        const requestOptions: any = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,POST,DELETE,PUT,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type', ...this.getAuthHeader()
            },
            body: JSON.stringify(body)
        };
        return fetch(url, requestOptions).then(this.handleResponse);
    },

    delete(url: string) {
        const requestOptions: any = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,POST,DELETE,PUT,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type', ...this.getAuthHeader()
            }
        };
        return fetch(url, requestOptions).then(this.handleResponse);
    },

    download(url: string, body?: any, language: string, exportType: string) {
        const requestOptions: any = {
            method: 'POST',
            responseType: 'blob',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,POST,DELETE,PUT,OPTIONS',
                ...this.getAuthHeader()
            }
        };
        if (body) {
            requestOptions.body = JSON.stringify(body)
        }
        return fetch(url + '?language=' + language + '&exportType=' + exportType, requestOptions);
    },

    getAuthHeader() {
        const token = sessionStorage.getItem('access_token')
        if (token) {
            return {'Authorization': `Bearer ${token}`};
        } else {
            return {};
        }
    },

    handleResponse(response: any) {
        if ([401, 403].includes(response.status)) {
            sessionStorage.removeItem("access_token");
            sessionStorage.removeItem("refresh_token");
            Router.replace('/login?redirected=true');
            return Promise.reject()
        }

        if (response.ok) {
            return response.clone().text().then((text: string) => {
                if (text.trim() != "") {
                    return response.json()
                }
                return Promise.resolve();
            });
        } else {
            return Promise.reject(response.status)
        }
    },
};