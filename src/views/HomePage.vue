<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar color="primary">
        <ion-title>Lost &amp; Found</ion-title>
        <ion-buttons slot="end">
          <ion-button router-link="/search">
            <ion-icon :icon="searchOutline" slot="icon-only" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>

      <ion-toolbar class="filter-toolbar">
        <ion-segment v-model="activeFilter" mode="ios" class="filter-segment">
          <ion-segment-button value="all">
            <ion-label>All</ion-label>
          </ion-segment-button>
          <ion-segment-button value="lost">
            <ion-label>Lost</ion-label>
          </ion-segment-button>
          <ion-segment-button value="found">
            <ion-label>Found</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher slot="fixed" @ion-refresh="onRefresh">
        <ion-refresher-content />
      </ion-refresher>

      <div class="results-header">
        <span class="results-count">{{ resultsLabel }}</span>
      </div>

      <ItemList
        :items="filteredItems"
        empty-title="No reports yet"
        empty-message="Items that are reported lost or found will appear here."
        @select="goToDetail"
      />

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button router-link="/report" color="primary">
          <ion-icon :icon="addOutline" />
        </ion-fab-button>
      </ion-fab>
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
  IonButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonFab,
  IonFabButton,
} from '@ionic/vue';
import { searchOutline, addOutline } from 'ionicons/icons';
import type { Item } from '@/types/Item';
import { useItems } from '@/composables/UseItems';
import ItemList from '@/components/ItemList.vue';

const router = useRouter();
const { items } = useItems();

const activeFilter = ref<'all' | 'lost' | 'found'>('all');

const filteredItems = computed(() => {
  if (activeFilter.value === 'all') return items.value;
  return items.value.filter((item) => item.type === activeFilter.value);
});

const resultsLabel = computed(() => {
  const count = filteredItems.value.length;
  const noun = count === 1 ? 'item' : 'items';
  const scope =
    activeFilter.value === 'all' ? 'reported' : activeFilter.value === 'lost' ? 'lost' : 'found';
  return `${count} ${noun} ${scope}`;
});

function goToDetail(item: Item) {
  router.push(`/item/${item.id}`);
}

function onRefresh(event: CustomEvent) {
  // TODO: re-fetch items from Firebase here once useItems is wired up.
  (event.target as HTMLIonRefresherElement).complete();
}
</script>

<style scoped>
.filter-toolbar {
  --background: var(--ion-color-primary);
  --border-width: 0;
  padding-bottom: 10px;
}

.filter-segment {
  max-width: 360px;
  margin: 0 auto;
  --background: rgba(255, 255, 255, 0.18);
  border-radius: 10px;
}

.filter-segment ion-segment-button {
  --color: rgba(255, 255, 255, 0.75);
  --color-checked: var(--ion-color-primary);
  --background-checked: #ffffff;
  --indicator-color: transparent;
  min-height: 34px;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: none;
}

.results-header {
  display: flex;
  align-items: center;
  padding: 14px 16px 4px;
}

.results-count {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.2px;
  color: var(--ion-color-medium-shade);
}
</style>