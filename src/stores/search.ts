import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import searchRequests from '@/api/searchRequests'
import type { IHouse } from '@/models/models'


export const useSearchStore = defineStore('search', () => {
  //State
  const searchQuery = ref("")
  const filterQuery = ref("")
  const houses = ref<IHouse[]>([])
  const house = ref(null)
  const housesCount = ref(0)
  const pageSize = ref(10)
  const page = ref(1)
  const loading = ref(false)
  const address = ref('')

  //Getters
  const pageCount = computed(() => Math.ceil(housesCount.value / pageSize.value))
  const searchQueryWithPage = computed(() =>
    `p=${page.value}${searchQuery.value !== '' ? '&' + searchQuery.value : ''}${filterQuery.value !== '' ? '&' + filterQuery.value : ''}`)

  //Functions
  async function getHouses(searchStr: string) {
    const data = await searchRequests.getHousesReq(searchStr);
    houses.value = data.results
    housesCount.value = data.count
  }

  async function getHouse(id: number) {
    const data = await searchRequests.getHouse(id);
    house.value = data
  }
  return {
    searchQuery, filterQuery, houses, housesCount, pageSize, page, loading, address,
    pageCount, searchQueryWithPage,
    getHouses, getHouse
  }
})



