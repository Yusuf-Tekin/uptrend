import { BgColors } from './../helper/Enum/Colors';
import { Cookies } from "react-cookie";
import axios, { Axios } from "axios";
import { toast } from "react-toastify";

const cookies = new Cookies();


const token = cookies.get('access_token');

const instance = (token?:string):Axios => {
  return axios.create({
    baseURL: "http://localhost:5000/api/v1",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
}

axios.interceptors.response.use((response) => response,(error) => {
    if(token && error.response.status === 401) {
        cookies.remove('access_token');
        toast.error("Token geçersiz ya da süresi dolmuş.Lütfen giriş yap!");
    }
})

export default instance;
