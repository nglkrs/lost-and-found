<template>
  <div v-if="items.length" class="item-list">
    <ItemCard
      v-for="item in items"
      :key="item.id"
      :item="item"
      @select="$emit('select', $event)"
    />
  </div>
  <EmptyState
    v-else
    :title="emptyTitle"
    :message="emptyMessage"
  />
</template>

<script setup lang="ts">
import type { Item } from '@/types/Item';
import ItemCard from './ItemCard.vue';
import EmptyState from './EmptyState.vue';

withDefaults(
  defineProps<{
    items: Item[];
    emptyTitle?: string;
    emptyMessage?: string;
  }>(),
  {
    emptyTitle: 'No items yet',
    emptyMessage: 'Reported items will show up here.',
  }
);

defineEmits<{
  (e: 'select', item: Item): void;
}>();
</script>

<style scoped>
.item-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
  padding: 12px;
}
</style>