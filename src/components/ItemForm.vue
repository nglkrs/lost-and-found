<template>
  <form class="item-form" @submit.prevent="handleSubmit">
    <ImageUploader
      :preview-url="previewUrl"
      @file-selected="onFileSelected"
      @clear="onClearImage"
    />

    <ion-item>
      <ion-label position="stacked">Item name</ion-label>
      <ion-input
        v-model="draft.itemName"
        placeholder="e.g. Black umbrella"
        required
      />
    </ion-item>

    <CategorySelect
      v-model="draft.category"
      :type="draft.type"
      @update:type="draft.type = $event"
    />

    <LocationPicker v-model="draft.location" />

    <ion-item>
      <ion-label position="stacked">Date</ion-label>
      <ion-input v-model="draft.date" type="date" required />
    </ion-item>

    <ion-item>
      <ion-label position="stacked">Description</ion-label>
      <ion-textarea
        v-model="draft.description"
        placeholder="Color, brand, distinguishing marks..."
        :auto-grow="true"
        :rows="3"
      />
    </ion-item>

    <ContactInfo
      editable
      :reporter-name="draft.reporterName"
      :reporter-phone="draft.reporterPhone"
      :reporter-email="draft.reporterEmail"
      @update:reporter-name="draft.reporterName = $event"
      @update:reporter-phone="draft.reporterPhone = $event"
      @update:reporter-email="draft.reporterEmail = $event"
    />

    <ion-button expand="block" type="submit" class="submit-btn">
      {{ submitLabel }}
    </ion-button>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { IonItem, IonLabel, IonInput, IonTextarea, IonButton } from '@ionic/vue';
import type { ItemDraft } from '@/types/Item';
import ImageUploader from './ImageUploader.vue';
import CategorySelect from './CategorySelect.vue';
import LocationPicker from './LocationPicker.vue';
import ContactInfo from './ContactInfo.vue';

const props = withDefaults(
  defineProps<{
    initial?: Partial<ItemDraft>;
    submitLabel?: string;
  }>(),
  {
    initial: () => ({}),
    submitLabel: 'Submit report',
  }
);

const emit = defineEmits<{
  // imageFile is passed separately so the parent / db layer decides
  // how and where to upload it before saving the rest of the draft.
  (e: 'submit', payload: { draft: ItemDraft; imageFile: File | null }): void;
}>();

const draft = reactive<ItemDraft>({
  itemName: props.initial.itemName ?? '',
  category: props.initial.category ?? '',
  type: props.initial.type ?? 'lost',
  status: props.initial.status ?? 'open',
  date: props.initial.date ?? '',
  description: props.initial.description ?? '',
  imageUrl: props.initial.imageUrl ?? '',
  location: props.initial.location ?? '',
  reporterName: props.initial.reporterName ?? '',
  reporterPhone: props.initial.reporterPhone ?? '',
  reporterEmail: props.initial.reporterEmail ?? '',
});

const imageFile = ref<File | null>(null);
const previewUrl = ref<string>(props.initial.imageUrl ?? '');

watch(
  () => props.initial,
  (val) => {
    if (!val) return;
    Object.assign(draft, val);
    previewUrl.value = val.imageUrl ?? '';
  }
);

function onFileSelected(file: File) {
  imageFile.value = file;
  previewUrl.value = URL.createObjectURL(file);
}

function onClearImage() {
  imageFile.value = null;
  previewUrl.value = '';
  draft.imageUrl = '';
}

function handleSubmit() {
  emit('submit', { draft: { ...draft }, imageFile: imageFile.value });
}

// Ionic's router-outlet keeps pages alive in the DOM instead of destroying
// them on navigation, so this component won't automatically remount (and
// reset its state) the next time the user visits this page. Call this from
// the parent after a successful save so the form is blank next time.
function resetForm() {
  Object.assign(draft, {
    itemName: '',
    category: '',
    type: 'lost',
    status: 'open',
    date: '',
    description: '',
    imageUrl: '',
    location: '',
    reporterName: '',
    reporterPhone: '',
    reporterEmail: '',
  });
  imageFile.value = null;
  previewUrl.value = '';
}

defineExpose({ resetForm });
</script>

<style scoped>
.item-form {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
}

.submit-btn {
  margin-top: 20px;
}
</style>