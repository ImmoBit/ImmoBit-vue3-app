<template>
  <v-hover v-slot="{ hover }">
    <v-card rounded="be-xl" height="250" :elevation="hover ? 12 : 2">
      <v-container fluid class="pa-0">
        <v-row>
          <v-col cols="5">
            <v-carousel preload height="250" hide-delimiters show-arrows="hover">
              <v-carousel-item
                v-for="i in 5"
                :key="i"
                eager
                cover
              >
                <v-img cover :src="$props.house.images[i]" width="100%" height="100%" eager/>
              </v-carousel-item>
            </v-carousel>
          </v-col>
          <v-col @click="goHousePage">
            <v-container class="fill-height flex-column align-stretch">
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
              <v-row align="end" justify="end">
                <v-col align="end">
                  <v-btn color="alert" variant="text" icon @click.stop="updateSavedHouse">
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
import { defineComponent, ref, computed } from "vue";
import { formatPrice } from '@/helpers/helpers';
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
      for (let i = 0; i < 5; i++) {
        var highResImage = new Image();
        highResImage.onload = function () {
          images.value[i] = props.house.images[i] as any
        }
        highResImage.src = props.house.images[i]
      }
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
