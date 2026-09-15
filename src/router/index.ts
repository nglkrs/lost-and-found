import { createRouter, createWebHistory } from '@ionic/vue-router';
import type { RouteRecordRaw } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import SearchPage from '@/views/SearchPage.vue';
import ItemDetailPage from '@/views/ItemDetailPage.vue';
import ReportItemPage from '@/views/ReportItemPage.vue';
import EditItemPage from '@/views/EditItemPage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/search',
    name: 'Search',
    component: SearchPage,
  },
  {
    path: '/report',
    name: 'ReportItem',
    component: ReportItemPage,
  },
  {
    path: '/item/:id',
    name: 'ItemDetail',
    component: ItemDetailPage,
  },
  {
    path: '/edit/:id',
    name: 'EditItem',
    component: EditItemPage,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;