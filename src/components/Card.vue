<template>
  <v-hover v-slot="{ hover }">
    <v-card @click="goHousePage"  height="250" shaped :elevation="hover ? 12 : 2">
      <v-container fluid class="pa-0">
        <v-row class="ma-0 pa-0">
          <v-col class="ma-0 pa-0" cols="5">
            <v-img :src="images[0]"></v-img>
            <!--<v-carousel height="250" show-arrows="hover">
              <v-carousel-item
                v-for="(image, i) in images"
                :key="i"
                :src="image"
                cover
              ></v-carousel-item>
            </v-carousel>-->
          </v-col>
          <v-col class="pb-0">
            <v-container fill-height>
              <v-row>
                <v-col>
                  <div class="text--secondary title">{{ $props.house.type }} à {{ $props.house.daira }}</div>
                  <v-divider></v-divider>
                  <div class="font-weight-normal ml-3 mt-3">
                    <v-icon class="pb-1 mr-1 ml-1">mdi-map-marker</v-icon
                    >{{ $props.house.address }}
                  </div>
                  <div v-if="house.type != 'Studio'" class="text--secondary body-2 ml-10">
                    • {{ house.rooms }} Chambres
                  </div>
                </v-col>
              </v-row>
              <!-- heart icon, price -->
              <v-row align="end">
                <v-col align="end">
                  <v-btn color="alert" icon @click.stop="updateSavedHouse">
                    <v-icon outline>
                      {{ saved ? "mdi-heart" : "mdi-heart-outline" }}
                    </v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-hover>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onBeforeMount } from "vue";
import { filesToBase64, urlsToFiles, formatPrice } from '@/helpers/helpers';
import { useSavedHousesStore } from "@/stores/savedHouses";
import type { IHouse, ISavedHouse } from '@/models/models'
import { useRouter } from "vue-router";
import { onMounted } from "vue";

export default defineComponent({
  name: 'CardView',
  props: ['house'],
  setup(props: { house: IHouse }) {
    const router = useRouter()
    const show = ref(false)
    const images = ref<any[]>([])
    const savedHousesStore = useSavedHousesStore()

    const saved = computed(() => {
      if (savedHousesStore.savedHouses.find(item => item.id == props.house.id)) {
        return true;
      } else { return false }
    })

    onMounted(async () => {
      let imagesFiles: string[] = []
      for (let i = 0; i < 5; i++) {
        imagesFiles = [...imagesFiles, props.house.images[i]];
      }
      const files = await urlsToFiles(imagesFiles) as File[]
      images.value = filesToBase64(files)
    })

    async function updateSavedHouse() {
      const house = { ...props.house, saved: saved.value } as ISavedHouse;
      savedHousesStore.updateSavedHouses(house)
    }
    async function goHousePage() {
      await router.push("/house/" + props.house.id).catch(() => { });
    }
    return {
      show, images, saved,
      updateSavedHouse, goHousePage, formatPrice
    }

  }

})
</script>

<style scoped>
#price {
  min-width: 400px;
  background: linear-gradient(to top, rgba(0, 0, 0, 1), rgba(255, 255, 255, 0));
}
</style>
