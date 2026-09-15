<template>
  <div class="uploader">
    <ion-label class="uploader-label">Photo</ion-label>

    <div class="preview-wrap" @click="isSheetOpen = true">
      <img v-if="previewUrl" :src="previewUrl" alt="Selected item" class="preview" />
      <div v-else class="preview placeholder">
        <ion-icon :icon="cameraOutline" />
        <span>Add a photo</span>
      </div>

      <ion-button
        v-if="previewUrl"
        class="remove-btn"
        size="small"
        fill="clear"
        color="light"
        @click.stop="clear"
      >
        <ion-icon :icon="closeCircle" slot="icon-only" />
      </ion-button>
    </div>

    <ion-action-sheet
      :is-open="isSheetOpen"
      header="Add a photo"
      :buttons="sheetButtons"
      @did-dismiss="isSheetOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonLabel, IonIcon, IonButton, IonActionSheet } from '@ionic/vue';
import { cameraOutline, closeCircle, imagesOutline } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

defineProps<{
  previewUrl?: string;
}>();

const emit = defineEmits<{
  (e: 'file-selected', file: File): void;
  (e: 'clear'): void;
}>();

const isSheetOpen = ref(false);

const sheetButtons = [
  {
    text: 'Take Photo',
    icon: cameraOutline,
    handler: () => capture(CameraSource.Camera),
  },
  {
    text: 'Choose from Gallery',
    icon: imagesOutline,
    handler: () => capture(CameraSource.Photos),
  },
  {
    text: 'Cancel',
    role: 'cancel',
  },
];

async function capture(source: CameraSource) {
  try {
    const photo = await Camera.getPhoto({
      quality: 80,
      resultType: CameraResultType.DataUrl,
      source,
    });
    if (photo.dataUrl) {
      const file = await dataUrlToFile(photo.dataUrl, `item-photo-${Date.now()}.jpeg`);
      emit('file-selected', file);
    }
  } catch {
    // User cancelled the camera/gallery prompt — nothing to do.
  }
}

async function dataUrlToFile(dataUrl: string, filename: string): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
}

function clear() {
  emit('clear');
}
</script>

<style scoped>
.uploader-label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.85rem;
  color: var(--ion-color-medium-shade);
}

.preview-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  border: 1.5px dashed var(--ion-color-medium);
  background: var(--ion-color-light);
}

.preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: var(--ion-color-medium);
  font-size: 0.85rem;
}

.placeholder ion-icon {
  font-size: 1.8rem;
}

.remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  --background: rgba(0, 0, 0, 0.45);
  border-radius: 50%;
}
</style>