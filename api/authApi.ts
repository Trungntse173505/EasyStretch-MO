import axiosClient from './axiosClient';


export interface Login{
    email: string;
    password: string;
}

export interface Register{
    user_name: string;
    full_name: string;
    email: string;
    password: string;
    role: string;
}


const authApi ={
    login: (data: Login) =>{
        return axiosClient.post('/user/signin', data);
    },
    register: (data: Register) =>{
        return axiosClient.post('/user/signup', data);
    }
}


export default authApi;