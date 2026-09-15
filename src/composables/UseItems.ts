import { computed, ref } from 'vue';
import type { Item, ItemDraft } from '@/types/Item';

/**
 * TEMPORARY in-memory data layer.
 *
 * There's no database wired up yet, so `items` just lives in memory here.
 * It's module-level (declared outside the functions), so every component
 * that calls these composables shares the same reactive array — reporting
 * an item on ReportItemPage will show up immediately on HomePage/SearchPage.
 *
 * IMPORTANT: this resets on every page refresh / app restart since nothing
 * is persisted. Once the real Firebase Realtime Database logic is ready,
 * replace the bodies of these functions (keep the same return shapes) and
 * none of the view/component files should need to change.
 */

const items = ref<Item[]>([]);
const loading = ref(false);

function generateId(): string {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useItems() {
  // TODO: subscribe to `items/` in Firebase and keep `items` in sync instead.
  return { items, loading };
}

export function useItem(id: string) {
  // Reactively look the item up from the shared in-memory list.
  const item = computed(() => items.value.find((i) => i.id === id) ?? null);
  const itemLoading = ref(false);

  // TODO: once Firebase is wired up, fetch `items/{id}` directly instead
  // of relying on the item already being present in the local `items` list.

  return { item, loading: itemLoading };
}

export function useSaveItem() {
  const saving = ref(false);
  const error = ref<string | null>(null);

  async function saveItem(draft: ItemDraft, imageFile: File | null) {
    saving.value = true;
    error.value = null;
    try {
      // TODO: replace this block with real Firebase logic:
      // 1. If imageFile is set, upload it to Firebase Storage and get a URL.
      // 2. Push the draft (with that imageUrl) to `items/` in the DB.
      const imageUrl = imageFile ? URL.createObjectURL(imageFile) : draft.imageUrl;

      const newItem: Item = {
        ...draft,
        imageUrl,
        id: generateId(),
        createdAt: Date.now(),
      };

      items.value = [newItem, ...items.value];
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to save item';
    } finally {
      saving.value = false;
    }
  }

  return { saveItem, saving, error };
}

export function useUpdateItem() {
  const saving = ref(false);
  const error = ref<string | null>(null);

  async function updateItem(id: string, draft: ItemDraft, imageFile: File | null) {
    saving.value = true;
    error.value = null;
    try {
      // TODO: replace with a real Firebase update() call on `items/{id}`.
      const imageUrl = imageFile ? URL.createObjectURL(imageFile) : draft.imageUrl;

      items.value = items.value.map((existing) =>
        existing.id === id ? { ...existing, ...draft, imageUrl } : existing
      );
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update item';
    } finally {
      saving.value = false;
    }
  }

  return { updateItem, saving, error };
}