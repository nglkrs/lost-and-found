<template>
  <ion-card class="item-card" button @click="$emit('select', item)">
    <div class="thumb-wrap">
      <img
        v-if="item.imageUrl"
        :src="item.imageUrl"
        :alt="item.itemName"
        class="thumb"
      />
      <div v-else class="thumb thumb-placeholder">
        <ion-icon :icon="imageOutline" />
      </div>
      <StatusBadge :status="item.status" :type="item.type" class="badge-overlay" />
    </div>

    <ion-card-header>
      <ion-card-subtitle>{{ item.category }}</ion-card-subtitle>
      <ion-card-title>{{ item.itemName }}</ion-card-title>
    </ion-card-header>

    <ion-card-content>
      <p class="meta-line">
        <ion-icon :icon="locationOutline" />
        <span>{{ item.location || 'Location not specified' }}</span>
      </p>
      <p class="meta-line">
        <ion-icon :icon="calendarOutline" />
        <span>{{ formattedDate }}</span>
      </p>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonIcon,
} from '@ionic/vue';
import { locationOutline, calendarOutline, imageOutline } from 'ionicons/icons';
import type { Item } from '@/types/Item';
import StatusBadge from './StatusBadge.vue';

const props = defineProps<{
  item: Item;
}>();

defineEmits<{
  (e: 'select', item: Item): void;
}>();

const formattedDate = computed(() => {
  if (!props.item.date) return 'Date not specified';
  const d = new Date(props.item.date);
  if (isNaN(d.getTime())) return props.item.date;
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
});
</script>

<style scoped>
.item-card {
  margin: 0;
  border-radius: 14px;
  overflow: hidden;
}

.thumb-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  background: var(--ion-color-light);
}

.thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.thumb-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ion-color-medium);
}

.thumb-placeholder ion-icon {
  font-size: 2.2rem;
}

.badge-overlay {
  position: absolute;
  top: 10px;
  left: 10px;
}

.meta-line {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 4px 0;
  font-size: 0.85rem;
  color: var(--ion-color-medium-shade);
}

.meta-line ion-icon {
  font-size: 1rem;
  flex-shrink: 0;
}
</style>