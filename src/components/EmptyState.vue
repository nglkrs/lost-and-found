<template>
  <div class="empty-state">
    <ion-icon :icon="icon" />
    <h2>{{ title }}</h2>
    <p>{{ message }}</p>
    <ion-button v-if="actionLabel" fill="outline" @click="$emit('action')">
      {{ actionLabel }}
    </ion-button>
  </div>
</template>

<script setup lang="ts">
import { IonIcon, IonButton } from '@ionic/vue';
import { searchOutline } from 'ionicons/icons';

withDefaults(
  defineProps<{
    title?: string;
    message?: string;
    actionLabel?: string;
    icon?: string;
  }>(),
  {
    title: 'Nothing here yet',
    message: 'No items match this view right now.',
    actionLabel: '',
    icon: searchOutline,
  }
);

defineEmits<{
  (e: 'action'): void;
}>();
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 48px 24px;
  color: var(--ion-color-medium);
}

.empty-state ion-icon {
  font-size: 2.75rem;
  margin-bottom: 12px;
  opacity: 0.6;
}

.empty-state h2 {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--ion-color-dark);
  margin: 0 0 4px;
}

.empty-state p {
  font-size: 0.9rem;
  margin: 0 0 16px;
  max-width: 260px;
}
</style>