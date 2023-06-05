<template>
  <v-card elevation="1">  
    <v-carousel height="350" show-arrows hide-delimiters> 
      <template v-slot:prev="{ props }">
        <v-btn
          variant="text"
          @click="props.onClick"
          size="x-large"
          icon="mdi-chevron-left"
          color="white"        
          >       
        </v-btn>
      </template>
      <template v-slot:next="{ props }">
        <v-btn
          variant="text"
          @click="props.onClick"
          size="large"
          icon="mdi-chevron-right"
          color="white"        
        >
      </v-btn>
      </template>
      <v-carousel-item
        v-for="i in 5"
        :key="i"
        :src="$props.house.images[i]"
        cover
      >
      </v-carousel-item>
      <div @click="goHousePage" class="carousel-container d-flex flex-column justify-space-between">
        <v-btn class="align-self-end" @click.stop="updateSavedHouse" color="white" variant="text" large icon dark>
          <v-icon class="pa-4">
            {{ saved ? "mdi-heart" : "mdi-heart-outline" }}
          </v-icon>
        </v-btn>
        <div class="price text-white d-flex pa-2">
          <div class="text-h6 font-weight-bold ml-2">• {{ formatPrice($props.house.price) }}</div>
          <div class="text-caption align-self-end ml-1 mb-1">{{ house.paymentFormat }}</div>
        </div>
      </div>
    </v-carousel>
    <v-card-text class="text-medium-emphasis pb-0">
      <div class="text-body-1 d-flex align-end">
        <v-icon>mdi-map-marker</v-icon>
        <div class="font-regular text-high-emphasis align-start">{{ $props.house.address }}</div>
      </div>
      <div class="text-body-2 ml-6">
        • {{ house.rooms === 1 ? house.type : `${house.rooms} Chambres` }} 
      </div>
    </v-card-text>

    <v-card-actions class="py-0">
      <v-spacer></v-spacer>
      <v-btn icon @click="show = !show">
        <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
      </v-btn>
    </v-card-actions>
    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>
        <v-card-text>
          {{ $props.house.description }}
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
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
.carousel-container {
  width: 100%;
  height: 100%;
  position: absolute;
}

.price {
  min-width: 400px;
  background: linear-gradient(to top, rgba(0, 0, 0, 1), rgba(255, 255, 255, 0));
}
</style>
