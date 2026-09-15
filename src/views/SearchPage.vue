<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/home" />
        </ion-buttons>
        <ion-title>Search</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar
          v-model="query"
          placeholder="Search by item name or location"
          :debounce="250"
        />
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="filter-row">
        <ion-chip
          v-for="cat in categories"
          :key="cat"
          :outline="activeCategory !== cat"
          :color="activeCategory === cat ? 'primary' : 'medium'"
          @click="toggleCategory(cat)"
        >
          {{ cat }}
        </ion-chip>
      </div>

      <ItemList
        :items="results"
        empty-title="No matches"
        empty-message="Try a different search term or clear your filters."
        @select="goToDetail"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonSearchbar,
  IonContent,
  IonChip,
} from '@ionic/vue';
import { ITEM_CATEGORIES, type Item } from '@/types/Item';
import { useItems } from '@/composables/UseItems';
import ItemList from '@/components/ItemList.vue';

const router = useRouter();
const { items } = useItems();

const query = ref('');
const activeCategory = ref<string | null>(null);
const categories = ITEM_CATEGORIES;

function toggleCategory(cat: string) {
  activeCategory.value = activeCategory.value === cat ? null : cat;
}

const results = computed(() => {
  const q = query.value.trim().toLowerCase();
  return items.value.filter((item) => {
    const matchesQuery =
      !q ||
      item.itemName.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q);
    const matchesCategory = !activeCategory.value || item.category === activeCategory.value;
    return matchesQuery && matchesCategory;
  });
});

function goToDetail(item: Item) {
  router.push(`/item/${item.id}`);
}
</script>

<style scoped>
.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 10px 12px 0;
}
</style>