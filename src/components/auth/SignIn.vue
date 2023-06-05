<template>
  <v-card>
    <v-card-actions class="d-flex justify-end">
      <v-btn @click="$emit('dialog-false')" variant="text" icon="mdi-close"></v-btn>
    </v-card-actions>
    <v-card-text>
      <p class="text-red" v-if="isError">Veuillez corrigez l'email ou le mot de pass.</p>
      <v-text-field
        v-model="email"
        class="inputs"
        label="Email"
        type="text"
      />
      <v-text-field
        v-model="password"
        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
        class="inputs"
        label="Password"
        :type="show1 ? 'text' : 'password'"
        @click:append="show1 = !show1"
      />
    </v-card-text>
    <v-card-actions class="d-flex justify-end">
      <v-btn
        class="btn"
        :disabled="loading"
        :loading="loading"
        raised
        color="primary"
        variant="tonal"
        @click="Submit"
        >Connecter
      </v-btn>
    </v-card-actions>
    <!--<v-facebook-login class="mx-auto" app-id="453110369395561" @login="onLogin">
      ></v-facebook-login>-->
      
  </v-card>
</template>

<script lang="ts">
import { useAuthStore } from '@/stores/auth';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'SignIn',
  setup() {
    const authStore = useAuthStore()
    const email = ref('')
    const password = ref('')
    const show1 = ref(false)
    const isError = ref(false)
    const loading = ref(false)

    async function Submit() {
      loading.value = true
      const formData = {
        email: email.value,
        password: password.value
      };
      await authStore.signIn(formData)
      isError.value = authStore.error.situation
      loading.value = false
    }
    /* function onLogin(res: any) {
      console.log(res.authResponse);
       this.$store.dispatch("socialLogin", res.authResponse.accessToken);
     }*/
    return {
      email, password, show1, isError, loading,
      Submit
    }
  }
})
/*export default {
  
    onLogin(res) {
      console.log(res.authResponse);
      this.$store.dispatch("socialLogin", res.authResponse.accessToken);
    }
  }
};*/
</script>

<style></style>
