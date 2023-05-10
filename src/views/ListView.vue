<template>
    <v-container ref="card" :class="`mt-16 ${loading ? 'loading' : ''} ${$vuetify.display.mobile ? 'px-0 my-0' : ''}`">
      <div class="headline pa-4 text--secondary">
        {{ housesCount }} annonce(s) trouvées {{ address ? `à ${address}` : `` }}
      </div>
      <v-row style="min-height: 300px" no-gutters>
        <v-col v-if="!$vuetify.display.mobile" cols="7" align="start"> 
          <Card
            v-for="(house, index) in houses"
            :key="index"
            :house="house"
            class="mb-6"
            ref="card"
          ></Card>    
        </v-col>
        <v-col v-else>
          <card-phone
            v-for="(house, index) in houses"
            :key="index"
            :house="house"
            style="margin-bottom: 70px"
          ></card-phone>
        </v-col>
      </v-row>
      <v-pagination
        v-model="page"
        :length="pagesCount"
      ></v-pagination>
    </v-container>
  </template>
  
<script lang="ts">
import Card from "@/components/Card.vue";
//import cardPhone from "../components/cards/cardPhone";
import { useSearchStore } from "@/stores/search";
import { onMounted } from "vue";
import { defineComponent, ref, computed, watchEffect } from "vue";
import { useRoute, useRouter, type LocationQueryValue } from "vue-router";



export default defineComponent({
  components: { Card },
  name: 'ListView',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const page = ref(1)
    const loading = ref(false)
    const searchStore = useSearchStore()
    const card = ref(null)
    const options = {
      duration: 300,
      offset: 0,
      easing: "easeInOutCubic"
    }
    const housesCount = computed(() => searchStore.housesCount)
    const pagesCount = computed(() => searchStore.pageCount)
    const searchStr = computed(() => searchStore.searchQuery)
    const searchStrComp = computed(() => searchStore.searchQueryWithPage)
    const houses = computed(() => searchStore.houses)
    const address = computed(() => searchStore.address)
    const target = computed(() => card.value)

    onMounted(async () => {
      await router.isReady()
      if (searchStr.value === "") {
        const { p, ...query } = route.query
        await router.replace({ query: query })
        const { city, type, transaction, rooms, price_gte, price_lte } = query
        let searchStrTmp = ''
        if (city) {
          searchStore.address = city as string
          searchStrTmp += `city=${city}`
        }
        if (transaction) {
          searchStrTmp += `&transaction=${transaction}`
        }
        if (type) {
          const typeQuery = (type as LocationQueryValue[]).map((item: any) => `type=${item}`).join('&')
          searchStrTmp += `&${typeQuery}`
        }
        searchStore.page = Number(p as string)
        let filterStr = ''
        if (rooms) {
          const roomsQuery = (rooms as LocationQueryValue[]).map((item: any) => `rooms=${item}`).join('&')
          if (roomsQuery.length) {
            filterStr = `${roomsQuery}`
          }
        }
        if (price_gte && price_lte) {
          filterStr = `&price_gte=${price_gte}&price_lte=${price_lte}`
        }
        searchStore.searchQuery = searchStrTmp
        searchStore.filterQuery = filterStr
      } else {
        const params = new URLSearchParams(searchStrComp.value)
        const query = Object.fromEntries(params.entries());
        await router.replace({ path: `${route.path}`, query })
        searchStore.loading = false
        //this.$vuetify.goTo(this.target, this.options);
      }
    })

    watchEffect(async () => {
      await router.isReady()
      if (searchStrComp.value) {
        loading.value = true
        //goTo(options)
        searchStore.getHouses(searchStrComp.value)
        const params = new URLSearchParams(searchStrComp.value)
        const query = Object.fromEntries(params.entries());
        await router.replace({ path: `${route.path}`, query })
        loading.value = false
      }
    })

    watchEffect(async () => {
      if (houses.value) {
        searchStore.loading = false
      }
    })

    watchEffect(async () => {
      searchStore.page = page.value
    })

    return {
      page, loading,
      pagesCount, housesCount, searchStr, searchStrComp, houses, address,
    }
  }
})
</script>
  
<style>
.loading {
  opacity: 0.5;
}
</style>
  