import axios from "axios";
axios.defaults.baseURL = `${import.meta.env.VITE_APP_API_URL}/api`;

export default {
  getHousesReq(searchStr: string, controller: AbortController) {
    return axios.get(`/houses-list/?` + searchStr, {
      signal: controller.signal
    }).then((res) => {
      return res.data;
    });
  },
  getHouse(id: number) {
    return axios.get("/house-details/" + id).then(res => {
      console.log(res);
      return res.data;
    });
  },
  getUserHouses(userId: number) {
    return axios.get("/houses-list/" + userId).then(res => {
      console.log(res.data);
      return res;
    });
  }
};
