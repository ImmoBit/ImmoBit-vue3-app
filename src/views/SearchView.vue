<template>
    <v-container>
      <v-row>
        <v-col align="center">          
          <img :src="immoArab" height="200">
        </v-col>
      </v-row>
      <v-row>
        <v-col class="mx-auto" :cols="$vuetify.display.mobile ? 11 : 7">
          <SearchBar />
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script lang="ts">
    import SearchBar from "@/components/SearchBar.vue";
    import { defineComponent } from "vue";
    import immoArab from '@/assets/cart-houses.png';
  
    export default defineComponent({
    components: { SearchBar },
    name: 'SearchView',
    setup(){
      return { immoArab }
    }
    })
  </script>
  
  <style>
  
  </style>