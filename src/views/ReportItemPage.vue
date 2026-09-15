<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/home" />
        </ion-buttons>
        <ion-title>Report an Item</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ItemForm ref="formRef" submit-label="Submit report" @submit="onSubmit" />

      <ion-loading :is-open="saving" message="Saving report..." />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonLoading,
} from '@ionic/vue';
import type { ItemDraft } from '@/types/Item';
import { useSaveItem } from '@/composables/UseItems';
import ItemForm from '@/components/ItemForm.vue';

const router = useRouter();
const { saveItem, saving, error } = useSaveItem();

const formRef = ref<InstanceType<typeof ItemForm> | null>(null);

async function onSubmit(payload: { draft: ItemDraft; imageFile: File | null }) {
  await saveItem(payload.draft, payload.imageFile);
  if (!error.value) {
    formRef.value?.resetForm();
    router.push('/home');
  }
  // TODO: surface error.value to the user (e.g. an ion-toast) if the save fails.
}
</script>