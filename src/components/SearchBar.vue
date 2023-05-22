<template>
<v-container>
  <v-sheet rounded="xl" elevation="2" color="white">
    <v-row>
      <v-container class="px-7">
        <v-row>
          <v-col :cols="$vuetify.display.mobile ? 12 : 6">
            <v-select
              flat
              prepend-inner-icon="mdi-map-marker"
              label="Wilaya"
              hide-details
              variant="solo-filled"
              density="default"
              rounded
              :items="wilNames"
              v-model="wilaya"
            >
            </v-select>
          </v-col>
          <v-col :cols="$vuetify.display.mobile ? 12 : 6">
            <v-select
              flat
              prepend-inner-icon="mdi-map-marker-plus"
              height="50"
              label="Daira"
              hide-details
              variant="solo-filled"
              density="default"
              rounded
              :disabled="!dairasItems.length"
              multiple
              :items="dairasItems"
              v-model="dairas"
            >
              <template v-slot:selection="{ item, index }">
                <v-chip size="small" v-if="index < 1">
                  <span>{{ item.title }}</span>
                </v-chip>
                <span
                  v-if="index === 2"
                  class="text-grey text-caption align-self-center"
                >
                  (+{{ dairas.length - 1 }})
                </span>
              </template>
          </v-select>
          </v-col>
          <v-col class="mx-auto" :cols="$vuetify.display.mobile ? 12 : 6">
            <v-select
              flat
              prepend-inner-icon="mdi-home-modern"
              height="50"
              label="Type"
              hide-details
              variant="solo-filled"
              density="default"
              rounded
              multiple
              :items="types"
              v-model="selectedTypes"
            >
              <template v-slot:selection="{ item, index }">
                <v-chip size="small" v-if="index < 2">
                  <span>{{ item.title }}</span>
                </v-chip>
                <span
                  v-if="index === 2"
                  class="text-grey text-caption align-self-center"
                >
                  (+{{ selectedTypes.length - 2 }})
                </span>
              </template>
            </v-select>
          </v-col>
        </v-row>
      </v-container>
    </v-row>
    <v-row>
      <v-col class="py-0" align="center">
        <v-radio-group hide-details v-model="transaction">
          <v-radio
            v-for="(type, i) in ['Location', 'Achat']"
            :key="i"
            :class="i == 0 ? 'mx-auto' : 'pr-5 mx-auto'"
            :label="type"
            :value="type"
          ></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row class="mt-2">
      <v-col align="center">
        <v-btn
          style="text-transform: none;"
          class="white--text"
          x-large
          rounded
          color="primary"
          @click="searchState"
          :loading="loading"
          :disabled="loading"
          append-icon="mdi-magnify"
          >
          Recherchez
        </v-btn>
      </v-col>
    </v-row>
  </v-sheet>
</v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import algeriaCities from "@/assets/algeria-cities.json";
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSearchStore } from '@/stores/search';
import { watchEffect } from 'vue';


export default defineComponent({
  name: 'SearchBar',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const searchStore = useSearchStore()
    const types = ["Appartement", "Villa", "Studio"]
    const selectedTypes = ref<string[]>([])
    const wilObj = algeriaCities.wilayas
    const wilNames = ref<string[]>([])
    const wilaya = ref('')
    const dairasItems = ref<string[]>([])
    const dairas = ref([])
    const transaction = ref('Location')
    const loading = ref(false)

    onMounted(async () => {
      selectedTypes.value = types
      for (let i = 0; i < wilObj.length; i++) {
        wilNames.value.push(i + 1 + " - " + wilObj[i].name);
      }
      wilaya.value = wilNames.value[16 - 1]
      console.log("wilaya ", wilaya.value);
    })
    async function searchState() {
      loading.value = true;
      searchStore.loading = true
      let searchStr = '';

      //Setting up search array and address
      searchStore.address = wilaya.value.slice(4)
      if (wilaya.value)
        searchStr += "city=" + wilaya.value.slice(4).trim()
      if (selectedTypes.value) {
        for (const selectedType of selectedTypes.value) {
          searchStr += "&type=" + selectedType;
        }
      }
      for (const daira of dairas.value) {
        searchStr += "&daira=" + daira
      }
      if (transaction.value) {
        const transactionEn = transaction.value === 'Location' ? 'rent' : transaction.value === 'Achat' ? 'buy' : ''
        searchStr += "&transaction=" + transactionEn
      }

      //Dispatch search action
      searchStore.searchQuery = searchStr
      let url = route.path;
      await searchStore.getHouses(searchStore.searchQueryWithPage)

      //Going to list page
      if (url != "/list") router.push("/list");
    }
    watchEffect(() => {
      if (wilaya.value) {
        const indexFun = (element: string) => element == wilaya.value;
        var indexWil = wilNames.value.findIndex(indexFun);
        console.log(
          indexWil
        );
        var dairasItemsTmp = wilObj[indexWil].dairas;
        dairasItems.value = [];
        for (let index = 0; index < dairasItemsTmp.length; index++) {
          dairasItems.value.push(dairasItemsTmp[index].name);
        }
      }
    })
    return {
      types, selectedTypes, wilNames, wilaya, dairasItems, dairas, transaction, loading,
      searchState
    }
  }
})

</script>

<style>
.wrapper {
  border-radius: 25px;
}
</style>
