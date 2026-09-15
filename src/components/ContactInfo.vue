<template>
  <div v-if="editable">
    <ion-item>
      <ion-label position="stacked">Your name</ion-label>
      <ion-input
        :model-value="reporterName"
        placeholder="Juan Dela Cruz"
        @ion-input="$emit('update:reporterName', $event.detail.value ?? '')"
      />
    </ion-item>
    <ion-item>
      <ion-label position="stacked">Contact number</ion-label>
      <ion-input
        :model-value="reporterPhone"
        type="tel"
        placeholder="09xx xxx xxxx"
        @ion-input="$emit('update:reporterPhone', $event.detail.value ?? '')"
      />
    </ion-item>
    <ion-item>
      <ion-label position="stacked">Email (optional)</ion-label>
      <ion-input
        :model-value="reporterEmail"
        type="email"
        placeholder="you@email.com"
        @ion-input="$emit('update:reporterEmail', $event.detail.value ?? '')"
      />
    </ion-item>
  </div>

  <div v-else class="contact-display">
    <div class="contact-row">
      <ion-icon :icon="personOutline" />
      <span>{{ reporterName || 'Anonymous' }}</span>
    </div>
    <div class="contact-row">
      <ion-icon :icon="callOutline" />
      <span>{{ reporterPhone || 'No contact number provided' }}</span>
    </div>
    <div v-if="reporterEmail" class="contact-row">
      <ion-icon :icon="mailOutline" />
      <span>{{ reporterEmail }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonItem, IonLabel, IonInput, IonIcon } from '@ionic/vue';
import { personOutline, callOutline, mailOutline } from 'ionicons/icons';

withDefaults(
  defineProps<{
    reporterName: string;
    reporterPhone: string;
    reporterEmail?: string;
    editable?: boolean;
  }>(),
  {
    reporterEmail: '',
    editable: false,
  }
);

defineEmits<{
  (e: 'update:reporterName', value: string): void;
  (e: 'update:reporterPhone', value: string): void;
  (e: 'update:reporterEmail', value: string): void;
}>();
</script>

<style scoped>
.contact-display {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 4px 0;
}

.contact-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
}

.contact-row ion-icon {
  color: var(--ion-color-medium);
  font-size: 1.1rem;
}
</style>