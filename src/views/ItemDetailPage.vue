<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/home" />
        </ion-buttons>
        <ion-title>Item Details</ion-title>
        <ion-buttons slot="end">
          <ion-button v-if="item" :router-link="`/edit/${item.id}`">
            <ion-icon :icon="createOutline" slot="icon-only" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div v-if="loading" class="state-wrap">
        <ion-spinner name="crescent" />
      </div>

      <div v-else-if="item" class="detail">
        <div class="hero-wrap">
          <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.itemName" class="hero" />
          <div v-else class="hero hero-placeholder">
            <ion-icon :icon="imageOutline" />
          </div>
          <StatusBadge :status="item.status" :type="item.type" class="hero-badge" />
        </div>

        <div class="detail-body">
          <ion-text class="category">{{ item.category }}</ion-text>
          <h1 class="title">{{ item.itemName }}</h1>

          <div class="meta-grid">
            <div class="meta-item">
              <ion-icon :icon="locationOutline" />
              <span>{{ item.location || 'Not specified' }}</span>
            </div>
            <div class="meta-item">
              <ion-icon :icon="calendarOutline" />
              <span>{{ formattedDate }}</span>
            </div>
          </div>

          <ion-item lines="none" class="section-item">
            <ion-label>
              <h2>Description</h2>
              <p class="description">{{ item.description || 'No description provided.' }}</p>
            </ion-label>
          </ion-item>

          <ion-item lines="none" class="section-item">
            <ion-label>
              <h2>Reported by</h2>
              <ContactInfo
                :reporter-name="item.reporterName"
                :reporter-phone="item.reporterPhone"
                :reporter-email="item.reporterEmail"
              />
            </ion-label>
          </ion-item>

          <div class="contact-actions">
            <ion-button
              v-if="item.reporterPhone"
              expand="block"
              :href="`tel:${item.reporterPhone}`"
              class="contact-btn"
            >
              <ion-icon :icon="callOutline" slot="start" />
              Call reporter
            </ion-button>
            <ion-button
              v-if="item.reporterEmail"
              expand="block"
              fill="outline"
              :href="`mailto:${item.reporterEmail}`"
              class="contact-btn"
            >
              <ion-icon :icon="mailOutline" slot="start" />
              Email reporter
            </ion-button>
          </div>
        </div>
      </div>

      <div v-else class="state-wrap">
        <p>This item couldn't be found.</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonBackButton,
  IonIcon,
  IonContent,
  IonSpinner,
  IonText,
  IonItem,
  IonLabel,
} from '@ionic/vue';
import {
  createOutline,
  locationOutline,
  calendarOutline,
  imageOutline,
  callOutline,
  mailOutline,
} from 'ionicons/icons';
import { useItem } from '@/composables/UseItems';
import StatusBadge from '@/components/StatusBadge.vue';
import ContactInfo from '@/components/ContactInfo.vue';

const route = useRoute();
const itemId = computed(() => route.params.id as string);
const { item, loading } = useItem(itemId.value);

const formattedDate = computed(() => {
  if (!item.value?.date) return 'Date not specified';
  const d = new Date(item.value.date);
  if (isNaN(d.getTime())) return item.value.date;
  return d.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
});
</script>

<style scoped>
.state-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  color: var(--ion-color-medium);
}

.hero-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  background: var(--ion-color-light);
}

.hero {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hero-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ion-color-medium);
  font-size: 3rem;
}

.hero-badge {
  position: absolute;
  top: 14px;
  left: 14px;
}

.detail-body {
  padding: 16px;
}

.category {
  font-size: 0.85rem;
  color: var(--ion-color-medium);
  text-transform: none;
}

.title {
  margin: 2px 0 14px;
  font-size: 1.4rem;
  font-weight: 700;
}

.meta-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.92rem;
  color: var(--ion-color-dark);
}

.meta-item ion-icon {
  color: var(--ion-color-medium);
  font-size: 1.1rem;
}

.section-item {
  --padding-start: 0;
}

.section-item h2 {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--ion-color-medium-shade);
  margin-bottom: 6px;
}

.description {
  font-size: 0.95rem;
  line-height: 1.5;
  white-space: pre-line;
}

.contact-btn {
  margin-top: 0;
}

.contact-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
}
</style>