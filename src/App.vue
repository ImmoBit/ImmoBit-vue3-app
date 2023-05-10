<template>
  <v-app>
    <v-app-bar class="pa-0" color="#ECEFF1" height="80" app fixed>
      <v-container :fluid="$vuetify.display.xs" class="pa-0">
        <v-row align="center" class="ma-0">
          <!-- Logo -->
          <v-col class="pl-0" :cols="$vuetify.display.xs ? 3 : 1" @click="goHome">
            <!-- <v-img :src="logo" alt="logo"></v-img>-->
          </v-col>

          <!-- Title -->
          <v-col cols="2" v-if="!$vuetify.display.xs" @click="goHome" class="pa-0" >
            <span color="#80c8F1" class="display-1">Immo</span>
            <span color="#F69C65" class="display-1">Bit</span>
          </v-col>        
            <!--Create a house button-->
          <v-col v-if="!authenticated && homePage" align="center" align-self="center" cols="2">
            <!--<transition appear name="bounce">
              <v-btn small dark color="orange" prepend="mdi-home-plus" :to="{ name: 'CreateProperty' }"> 
                <v-icon> mdi-home-plus </v-icon>
                Créer une annonce
              </v-btn>            
            </transition>-->
          </v-col>          
          <v-spacer></v-spacer>
          
          <!-- save,sign in/up section -->
          <v-col class="pa-0" align="end" cols="6">
            <v-menu
              v-if="!$vuetify.display.xs && savedHouses.length !== 0"
              eager
              id="menu"
              offset-x
              :close-on-content-click="false"
              :disabled="savedHouses.length == 0"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" class="mt-6" large icon>
                  <v-icon>mdi-heart</v-icon>
                  <v-badge
                    eager
                    v-if="savedHouses.length"
                    dot
                    bottom
                    color="red"
                    :content="savedHouses.length"
                  >
                  </v-badge>
                </v-btn>
              </template>
              <!--<saved-houses
                class="saved-houses"
                :savedHouses="savedHouses"
              ></saved-houses>-->
            </v-menu>

            <v-menu eager v-if="!authenticated" offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn class="mt-6" icon large v-bind="attrs" v-on="on">
                  <v-icon>mdi-account-circle</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <v-dialog persistent max-width="350" v-model="dialog1">
                    <template v-slot:activator="{ on, attrs }">
                      <v-list-item-title v-bind="attrs" v-on="on">
                        Créer un compte
                      </v-list-item-title>
                    </template>
                    <!--<sign-up
                      v-if="dialog1"
                      @dialog-false="dialog1 = false"
                    ></sign-up>-->
                  </v-dialog>
                </v-list-item>

                <v-list-item>
                  <v-dialog persistent max-width="350" v-model="dialog2">
                    <template v-slot:activator="{ on, attrs }">
                      <v-list-item-title v-bind="attrs" v-on="on">
                        Se connecter                       
                      </v-list-item-title>
                    </template>
                    <!--<sign-in
                      v-if="dialog2"
                      @dialog-false="dialog2 = false"
                    ></sign-in>-->
                  </v-dialog>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-menu eager v-if="authenticated" offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn class="mt-6" icon large v-bind="attrs" v-on="on">
                  <v-icon>mdi-account-circle</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <!--<router-link
                    style="text-decoration: none; color: inherit;"
                    :to="{ name: 'admin-panel' }"
                  >
                    <v-list-item-title>
                      <v-btn variant="text" color="primary">Vos annonces</v-btn>
                    </v-list-item-title>
                  </router-link>-->
                </v-list-item>

                <v-divider class="mx-3"></v-divider>
                <v-list-item>
                  <v-list-item-title>
                    <v-btn variant="text" @click="logout">Se déconnecter</v-btn>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <v-main class="mb-12">
      <transition name="slide-fade" mode="out-in">
        <router-view></router-view>
      </transition>
      <v-bottom-navigation hide-on-scroll v-if="$vuetify.display.xs && !homePage" fixed color="indigo">
        <v-btn @click="goHome">
          <span>Recherche</span>
          <v-icon> mdi-magnify </v-icon>
        </v-btn>
        <v-btn @click="saved = !saved">
          <span>Enregistré</span>
          <v-icon>mdi-heart</v-icon>
        </v-btn>
        <v-btn :to="{ name: 'CreateProperty' }">
          <span class="text-center">Créer <br> une annonce</span>
          <v-icon> mdi-home-plus </v-icon>
        </v-btn>
      </v-bottom-navigation>
    </v-main>
    <v-footer class="footer d-flex flex-column align-center" :style="$vuetify.display.xs && !homePage ? 'margin-bottom: 60px' : ''">
      <div class="terms-privacy pa-4">
        <!--<router-link class="pa-4" :to="{ name: 'terms' }">
          terms
        </router-link>
        <router-link class="pa-4" :to="{ name: 'privacy-policy' }">
          privacy policy
        </router-link>-->
      </div>
      <div class="year-company">
        <div>
          {{ new Date().getFullYear() }} — ImmoBit
        </div>
      </div>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useSavedHousesStore } from '@/stores/savedHouses'

export default defineComponent({
  name: 'HomeView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const authStore = useAuthStore()
    const savedHousesStore = useSavedHousesStore()
    //const logo = await import("@/assets/Immobit-logo.png")
    //const immoArab = await import("@/assets/cart-houses.png")
    const saved = ref(false)
    const dialog1 = ref(false)
    const dialog2 = ref(false)

    // Computed
    const savedHouses = computed(() => savedHousesStore.savedHouses)
    const authenticated = computed(() => authStore.token?.includes('token') && !!authStore.userId)
    const homePage = computed(() => {
      try {
        return route.path == "/" || route.path == "/terms" || route.path == "/privacy-policy"
      } catch { return false }
    })
    const isListPage = computed(() => {
      try {
        return route.path === "/list"
      } catch { return false }
    })

    // Functions
    function goHome() {
      if (route.path != "/") router.push("/");
    }

    function goList() {
      if (route.path != "/list") router.push("/list");
    }

    function logout() {
      authStore.logout()
    }

    return {
      saved, dialog1, dialog2,
      goList, goHome, logout,
      savedHouses, authenticated, homePage, isListPage
    }
  }
})



</script>

<style scoped></style>
