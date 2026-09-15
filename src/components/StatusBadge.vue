<template>
  <ion-badge :color="color" class="status-badge">
    {{ label }}
  </ion-badge>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonBadge } from '@ionic/vue';
import type { ItemStatus, ItemType } from '@/types/Item';

const props = defineProps<{
  status: ItemStatus;
  type?: ItemType;
}>();

const label = computed(() => {
  if (props.status === 'open' && props.type) {
    return props.type === 'lost' ? 'Lost' : 'Found';
  }
  return props.status.charAt(0).toUpperCase() + props.status.slice(1);
});

const color = computed(() => {
  if (props.status === 'claimed') return 'warning';
  if (props.status === 'resolved') return 'medium';
  // open
  return props.type === 'found' ? 'success' : 'danger';
});
</script>

<style scoped>
.status-badge {
  border-radius: 6px;
  font-weight: 600;
  letter-spacing: 0.2px;
  padding: 5px 10px;
}
</style>