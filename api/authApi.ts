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

export interface UpdateUser {
    height_cm: number;
    weight_kg: number;
    gender: string;
    goal: string;
}


const authApi ={
    login: (data: Login) =>{
        return axiosClient.post('/user/signin', data);
    },
    register: (data: Register) =>{
        return axiosClient.post('/user/signup', data);
    },
    updateInfo: (data: UpdateUser) => {
        return axiosClient.patch('/user/update', data);
    }
}


export default authApi;