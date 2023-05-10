import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IHouse, ISavedHouse } from '@/models/models';

export const useSavedHousesStore = defineStore('savedHouses', () => {
  const savedHouses = ref<IHouse[]>([])

  function getHousesLocal() {
    if (localStorage.getItem("savedHouses") === null) {
      console.log("savedHouses property is null");
    } else if (Array.isArray(JSON.parse(localStorage.getItem("savedHouses") as string))
      && JSON.parse(localStorage.getItem("savedHouses") as string).length !== 0) {
      const savedHouses = JSON.parse(localStorage.getItem("savedHouses") as string);
      savedHouses.value = savedHouses
    }
  }

  async function updateSavedHouses({ saved, ...savedHouse }: ISavedHouse) {
    if (saved === false) {
      savedHouses.value.push(savedHouse)
    } else {
      savedHouses.value = savedHouses.value.filter(
        item => item.id !== savedHouse.id
      );
    }
    await localStorage.setItem(
      "savedHouses",
      JSON.stringify(savedHouses.value)
    );
  }

  return { updateSavedHouses, getHousesLocal, savedHouses }
})