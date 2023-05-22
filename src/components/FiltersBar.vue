<template>
  <v-sheet color="white" elevation="1">
    <v-container>
      <!-- Rooms -->
      <v-row no-gutters>  
        <div class="d-flex flex-column justify-center">
          <v-menu v-model="menuRooms">
            <template v-slot:activator="{ props }">
              <v-btn
                class="btn-menu"
                light
                color="#455A64"
                size="small"
                rounded
                variant="outlined"
                v-bind="props"
                >Chambres
                <v-icon>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-card class="rooms-wrapper">
              <v-checkbox
                density="comfortable"    
                color="primary"            
                v-for="(roomsItem, i) in roomsItems"
                :key="i"
                v-model="selectedRooms"
                :label="roomsItem"
                :value="roomsItem"
                hide-details
              ></v-checkbox>
            </v-card>
          </v-menu>
        </div>
        <!-- Price -->
        <div class="d-flex flex-column justify-center">
          <v-menu :close-on-content-click="false">
            <template v-slot:activator="{ props }">
              <v-btn
                class="btn-menu"
                color="#455A64"
                size="small"
                rounded
                variant="outlined"
                v-bind="props"
                >Prix
                <v-icon>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-card class="px-3 pt-2">
              <v-radio-group hide-details v-model="selectedRange">
                <v-radio
                  color="primary"
                  v-for="(priceRange, i) in priceRanges"
                  :key="i"
                  class="radioInput"
                  :label="priceRange.min + ' - ' + priceRange.max + ` ${paymentFormat}`"
                  :value="priceRange"
                >
                </v-radio>
              </v-radio-group>
            </v-card>
          </v-menu>
        </div>
      </v-row>
      <v-row>
        <div class="rooms-chips mx-3">
          <v-chip class="mx-1" color="#37474F" v-for="(chipRooms, i) in chipsRooms.slice(0, 2)" size="small" :key="i">
            <span>{{ chipRooms }}</span>
          </v-chip>  
          <span v-if="chipsRooms.length >= 3" class="grey--text text-caption">
            (+{{ chipsRooms.length - 2 }})
          </span>
        </div> 
        <v-divider vertical></v-divider> 
        <div class="price-chip mx-3">
          <v-chip color="#37474F" v-if="chipPrice" size="small">
            <span>{{ chipPrice.min }} - {{ chipPrice.max }} {{ paymentFormat }}</span>
          </v-chip>
        </div>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script lang="ts">
import { formatPrice } from '@/helpers/helpers';
import { useSearchStore } from '@/stores/search';
import { watchEffect, onMounted, computed, defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
export default defineComponent({
  name: 'FiltersBar',
  setup() {
    const searchStore = useSearchStore()
    const route = useRoute()
    const roomsItems = ['1/Studio', '2', '3', '4', '5', '6', '7', '8']
    const selectedRooms = ref<string[]>([])
    const chipsRooms = ref<string[]>([])
    const selectedRange = ref<{ min: string, max: string } | null>(null)
    const chipPrice = ref<{ min: string, max: string } | null>(null)
    const priceRanges = ref([
      { min: "0", max: "30 000" },
      { min: "30 000", max: "50 000" },
      { min: "50 000", max: "100 000" },
      { min: "100 000", max: "200 000" }
    ])
    const paymentFormat = ref('دج')
    const loading = ref(false)
    const timeout = ref<number | null>(null)
    const menuRooms = ref(false)
    const menuPrice = ref(false)

    const searchStr = computed(() => searchStore.searchQuery)
    const selectedFilters = computed(() => {
      let filtersStr = ""
      try {
        const roomsFilters = selectedRooms.value.map(item => `rooms=${item}`).join('&');
        if (roomsFilters.length) {
          filtersStr += `${roomsFilters}`
        }
        let priceFilters = ''
        if (selectedRange.value) {
          priceFilters = `price_gte=${selectedRange.value.min.replace(/\s+/g, '')}&price_lte=${selectedRange.value.max.replace(/\s+/g, '')}`
          filtersStr += `&${priceFilters}`
        }
        return filtersStr
      } catch {
        return ''
      }
    })

    onMounted(() => {
      if (searchStr.value.includes('buy')) {
        priceRanges.value = [
          { min: "0", max: "200" },
          { min: "200", max: "400" },
          { min: "400", max: "600" },
          { min: "600", max: "999" },
        ]
        paymentFormat.value = 'مليون دج'
      }
      //TO BE REFACTORED
      const { rooms, price_gte, price_lte } = route.query
      if (rooms) {
        selectedRooms.value = [...rooms as string[]]
        chipsRooms.value = [...selectedRooms.value as string[]]
      }
      if (price_gte && price_lte) {
        selectedRange.value = {
          min: formatPrice(price_gte as string) || '0',
          max: formatPrice(price_lte as string)
        }
        chipPrice.value = { ...selectedRange.value as any }
      }
    })

    function filterHouses() {
      searchStore.loading = true
      searchStore.filterQuery = selectedFilters.value
      chipsRooms.value = [...selectedRooms.value]
      chipPrice.value = selectedRange.value
      searchStore.loading = false
    }

    watchEffect(() => {
      if (selectedFilters.value) {
        if (timeout.value) {
          clearTimeout(timeout.value);
        }
        timeout.value = setTimeout(() => {
          filterHouses();
        }, 1000);
      }
    })

    watchEffect(() => {
      //TO BE REFACTORED
      const { rooms, price_gte, price_lte } = route.query
      if (rooms) {
        chipsRooms.value = [...rooms as string[]]
      }
      if (price_gte && price_lte) {
        chipPrice.value = {
          min: formatPrice(price_gte as string) || '0',
          max: formatPrice(price_lte as string)
        }
      }
    })
    return {
      roomsItems, selectedRooms, selectedRange, priceRanges,
      chipsRooms, chipPrice, paymentFormat, menuRooms, menuPrice,
      filterHouses
    }
  }
})
</script>
<style scoped>
.btn-menu {
  text-transform: none;
  margin-right: 12px;
}

.rooms-wrapper {
  display: grid;
  grid-template-rows: 2.5rem 2.5rem 2.5rem 2.5rem;
  grid-template-columns: 6rem 6rem;
}
</style>
