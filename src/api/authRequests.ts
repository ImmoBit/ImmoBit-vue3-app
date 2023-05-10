import axios from "axios";
axios.defaults.baseURL = `${import.meta.env.VITE_APP_API_URL}/api/auth`;

export default {
  signIn(authData: {email: string, password: string}) {
    return axios
      .post("/users/token/login/", {
        email: authData.email,
        password: authData.password
      })
      .then(res => {
        //console.log("TokenGet", res);
        return res;
      })
      .catch(error => {
        //console.log(error.response);
        return error;
      });
  },
  async getUser(token: string) {
    return await axios.get("/users/users/me/", {
        headers: {
          Authorization: token
        }
      })
  },
  updateUserInfo(token: string, formData: any) {
    return axios
      .put("/users/users/me/", formData, {
        headers: {
          Authorization: token
        }
      } )
  },
  
  
  async signUp(formData: any) {
    await axios.post("/users/users/", formData)
  }
};
