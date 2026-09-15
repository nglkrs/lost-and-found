<template>
  <ion-item>
    <ion-label position="stacked">Location</ion-label>
    <ion-input
      :model-value="modelValue"
      placeholder="e.g. Main Library, 2nd floor"
      @ion-input="$emit('update:modelValue', $event.detail.value ?? '')"
    >
      <ion-icon :icon="locationOutline" slot="start" />
    </ion-input>
  </ion-item>
</template>

<script setup lang="ts">
import { IonItem, IonLabel, IonInput, IonIcon } from '@ionic/vue';
import { locationOutline } from 'ionicons/icons';

defineProps<{
  modelValue: string;
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<!--
  Kept as a plain text field so it works out of the box.
  Swap the ion-input for a map/geolocation widget later without
  changing how the parent uses v-model:modelValue.
-->