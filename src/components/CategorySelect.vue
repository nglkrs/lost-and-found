<template>
  <ion-item>
    <ion-label position="stacked">Category</ion-label>
    <ion-select
      :model-value="modelValue"
      placeholder="Select a category"
      interface="action-sheet"
      @ion-change="onCategoryChange"
    >
      <ion-select-option v-for="cat in ITEM_CATEGORIES" :key="cat" :value="cat">
        {{ cat }}
      </ion-select-option>
    </ion-select>
  </ion-item>

  <ion-item>
    <ion-label position="stacked">Type</ion-label>
    <ion-segment :value="type" @ion-change="onTypeChange">
      <ion-segment-button value="lost">
        <ion-label>Lost</ion-label>
      </ion-segment-button>
      <ion-segment-button value="found">
        <ion-label>Found</ion-label>
      </ion-segment-button>
    </ion-segment>
  </ion-item>
</template>

<script setup lang="ts">
import {
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonSegment,
  IonSegmentButton,
} from '@ionic/vue';
import { ITEM_CATEGORIES, type ItemType } from '@/types/Item';

defineProps<{
  modelValue: string;
  type: ItemType;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'update:type', value: ItemType): void;
}>();

function onCategoryChange(event: CustomEvent) {
  const value = event.detail.value as string;
  emit('update:modelValue', value);
}

function onTypeChange(event: CustomEvent) {
  const value = event.detail.value as ItemType;
  emit('update:type', value);
}
</script>