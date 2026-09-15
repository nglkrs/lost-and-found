<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button :default-href="`/item/${itemId}`" />
        </ion-buttons>
        <ion-title>Edit Item</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div v-if="loading" class="state-wrap">
        <ion-spinner name="crescent" />
      </div>

      <ItemForm
        v-else-if="item"
        :initial="item"
        submit-label="Save changes"
        @submit="onSubmit"
      />

      <div v-else class="state-wrap">
        <p>Item not found.</p>
      </div>

      <ion-loading :is-open="saving" message="Saving changes..." />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonSpinner,
  IonLoading,
} from '@ionic/vue';
import type { ItemDraft } from '@/types/Item';
import { useItem, useUpdateItem } from '@/composables/UseItems';
import ItemForm from '@/components/ItemForm.vue';

const route = useRoute();
const router = useRouter();

const itemId = computed(() => route.params.id as string);
const { item, loading } = useItem(itemId.value);
const { updateItem, saving, error } = useUpdateItem();

async function onSubmit(payload: { draft: ItemDraft; imageFile: File | null }) {
  await updateItem(itemId.value, payload.draft, payload.imageFile);
  if (!error.value) {
    router.push(`/item/${itemId.value}`);
  }
}
</script>

<style scoped>
.state-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  color: var(--ion-color-medium);
}
</style>