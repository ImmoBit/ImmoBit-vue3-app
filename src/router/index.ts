import { createRouter, createWebHistory } from 'vue-router'
import SearchView from '@/views/SearchView.vue'
import ListView from '@/views/ListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: SearchView
    },
    {
      path: "/list",
      name: "List",
      component: ListView,
    },
  ]
})

export default router
