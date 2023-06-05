<template>
  <FiltersBar class="filters-card"></FiltersBar>
  <v-container ref="card" :class="`mt-16 ${loading ? 'loading' : ''} ${$vuetify.display.mobile ? 'px-0 my-0' : ''}`">
    <div class="text-h6 pa-4 text-medium-emphasis font-weight-medium">
      {{ housesCount }} annonce(s) trouvées {{ address ? `à ${address}` : `` }}
    </div>
    <v-row style="min-height: 300px" no-gutters>
      <v-col v-if="!$vuetify.display.mobile" cols="7" align="start"> 
        <div v-for="(house, index) in houses" :key="index" class="my-5">
          <Card
            :house="house"
            ref="card"
          ></Card>    
        </div>
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
import CardPhone from "@/components/CardPhone.vue";
import { useSearchStore } from "@/stores/search";
import { onMounted } from "vue";
import { watch } from "vue";
import { defineComponent, ref, computed, watchEffect } from "vue";
import { useRoute, useRouter, type LocationQueryValue } from "vue-router";
import FiltersBar from "@/components/FiltersBar.vue";


export default defineComponent({
  components: { Card, CardPhone, FiltersBar },
  name: 'ListView',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const page = ref(1)
    const searchStore = useSearchStore()
    const card = ref(null)
    const options = {
      duration: 300,
      offset: 0,
      easing: "easeInOutCubic"
    }

    const loading = computed(() => searchStore.loading)
    const housesCount = computed(() => searchStore.housesCount)
    const pagesCount = computed(() => searchStore.pageCount)
    const searchStr = computed(() => searchStore.searchQuery)
    const searchStrComp = computed(() => searchStore.searchQueryWithPage)
    const filtersQuery = computed(() => searchStore.filterQuery)
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
        page.value = Number(p as string)
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
        let query = {}
        //
        for (var [key, value] of params.entries()) {
          // is array
          if (Array.isArray(query[key])) {
            query = { ...query, [key]: [...query[key], value] }
          } else if (typeof query[key] === 'string') {
            query = { ...query, [key]: [query[key], value] }
          } else {
            query = { ...query, [key]: value }
          }
        }
        await router.replace({ path: `${route.path}`, query })
        searchStore.loading = false
        //this.$vuetify.goTo(this.target, this.options);
      }
    })

    watch(searchStrComp, async (val) => {
      searchStore.loading = true
      //goTo(options)
      await searchStore.getHouses(val)
      const params = new URLSearchParams(val)
      let query = {}
      for (var [key, value] of params.entries()) {
        // is array
        if (Array.isArray(query[key])) {
          query = { ...query, [key]: [...query[key], value] }
        } else if (typeof query[key] === 'string') {
          query = { ...query, [key]: [query[key], value] }
        } else {
          query = { ...query, [key]: value }
        }
      }
      router.replace({ path: `${route.path}`, query })
      searchStore.loading = false
    })

    watchEffect(() => {
      if (houses.value) {
        searchStore.loading = false
      }
    })
    watchEffect(() => {
      if (filtersQuery.value) {
        searchStore.page = 1
      }
    })
    watchEffect(() => {
      searchStore.page = page.value
    })

    return {
      page, loading,
      pagesCount, housesCount, searchStr, searchStrComp, houses, address,
    }
  }
})
</script>
  
<style scoped>
.loading {
  opacity: 0.5;
}

.filters-card {
  position: fixed;
  z-index: 5;
  width: 100%;
}
</style>
  