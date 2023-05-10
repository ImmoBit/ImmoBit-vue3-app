import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import authRequests from '@/api/authRequests'
import searchRequests from '@/api/searchRequests'
import type { IAuthData, IErrors, IFormData } from '@/models/models'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref<string | null>('')
  const userId = ref<number | null>(0)
  const user = ref({
    id: null,
    email: "",
    phone: ""
  })
  const error = ref({
    situation: false,
    message: ""
  })
  const formErrors = ref({
    email: [""],
    password: [""],
    phone: [""]
  })
  const userHouses = ref([])

  // Functions
  async function setUserLocal(token: string) {
    try {
      const res = await authRequests.getUser(token);
      console.log(res.data);
      user.value = res.data
      userId.value = res.data.id
      localStorage.setItem("token", token);
      localStorage.setItem("userId", res.data.id);
    } catch (error) {
      console.log(error);
    }
  }

  async function signIn(authData: IAuthData) {
    const res = await authRequests.signIn(authData);
    try {
      // Good request
      if (res.status == 200) {
        token.value = "token " + res.data.auth_token
        await setUserLocal("token " + res.data.auth_token);
      }
      // Bad request
      else if (res.response.status == 400) {
        console.log(res.status);
        const err = {
          situation: true,
          message: res.response.data.non_field_errors[0]
        };
        error.value = err
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getUserHouses(){
    const res = await searchRequests.getUserHouses(userId.value as number);
    //commit("setUserHouses", res.data);
  }

  async function signUp(formData: IFormData) {
    try {
      await authRequests.signUp(formData)
    } catch (error) {
      console.log("error", error);
      showErrors(error)
    }
    signIn({
      email: formData.email,
      password: formData.password
    })
  }

  async function showErrors(error: any) {
    if (error.response.status == 400) {
      const errors = ref<IErrors>({
        email: [""],
        password: [""],
        phone: [""]
      });
      const keys = Object.keys(error.response.data);
      for (const key of keys) {
        errors[key as keyof typeof errors]  = 
        error.response.data[key][0].includes('user with this email') ? ['Un utilisateur avec cet email existe déjà'] 
        : error.response.data[key][0].includes('password is too short') ? ['Ce mot de passe est trop court. Il doit contenir au moins 8 caractères.']
        : error.response.data[key][0].includes('password is too similar') ? ['le mot de passe est similaire au email']  
        : error.response.data[key] 
      }
      formErrors.value = errors.value
    }
  }

  async function updateUser(formData: IFormData) {
    try {
      await authRequests.updateUserInfo(token.value as any, formData)
    } catch (error) {
      showErrors(error)
    }
  }

  function logout() {
    token.value = null
    userId.value = null
    localStorage.setItem("token", "null");
    localStorage.setItem("userId", "null");
  }

  return {
    token, userId, user, error, formErrors, userHouses,
    setUserLocal, signIn, getUserHouses, signUp, showErrors, updateUser, logout
  }
})
