import axios from 'axios';

export const lookup = (ip: string, apiKey: string) => {
    return axios.get(`http://api.ipapi.com/api/${ip}?access_key=${apiKey}`);
}