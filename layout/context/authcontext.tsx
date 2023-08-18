import React, {createContext, useEffect, useState} from 'react';
import {ChildContainerProps} from '../../types/types';
import {AuthContextProps} from "../../types/layout";
import {UserService} from "../../service/UserService";

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({children}: ChildContainerProps) => {

    const [user, setUser] = useState<User.UserModel>(null)

    useEffect(() => {
        async function loadUserFromSessionStorage() {
            const token = sessionStorage.getItem('access_token')
            if (token) {
                UserService.getCurrentUser().then((user) => setUser(user));
            }
        }

        loadUserFromSessionStorage();
    }, []);


    const value: AuthContextProps = {
        user,
        setUser
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};