import { computed, ref } from 'vue';
import {
  ref as dbRef,
  push,
  set as dbSet,
  update as dbUpdate,
  remove as dbRemove,
  onValue,
} from 'firebase/database';
import { db } from '@/firebase';
import type { Item, ItemDraft } from '@/types/Item';

const ITEMS_PATH = 'items';

const items = ref<Item[]>([]);
const loading = ref(true);

// Subscribed once, as soon as this module is first imported, and kept in
// sync for the lifetime of the app — every component that calls useItems()/
// useItem() shares this same reactive list, so a new report shows up
// everywhere immediately without needing a manual refetch.
onValue(dbRef(db, ITEMS_PATH), (snapshot) => {
  const data = snapshot.val() as Record<string, Omit<Item, 'id'>> | null;
  items.value = data
    ? Object.entries(data)
        .map(([id, value]) => ({ id, ...value }))
        .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
    : [];
  loading.value = false;
});

export function useItems() {
  return { items, loading };
}

export function useItem(id: string) {
  // Looks the item up from the same live-synced list above, so detail/edit
  // pages update automatically if the record changes elsewhere too.
  const item = computed(() => items.value.find((i) => i.id === id) ?? null);
  return { item, loading };
}

export function useSaveItem() {
  const saving = ref(false);
  const error = ref<string | null>(null);

  async function saveItem(draft: ItemDraft, imageFile: File | null) {
    saving.value = true;
    error.value = null;
    try {
      // TODO: Firebase Storage isn't configured yet, so a picked photo is
      // only kept as a temporary local blob URL — it will NOT persist after
      // a refresh or show up on another device. Once Storage is set up,
      // upload imageFile there (uploadBytes + getDownloadURL) and use that
      // permanent URL here instead.
      const imageUrl = imageFile ? URL.createObjectURL(imageFile) : draft.imageUrl;

      const newItemRef = push(dbRef(db, ITEMS_PATH));
      await dbSet(newItemRef, {
        ...draft,
        imageUrl,
        createdAt: Date.now(),
      });
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
      // Same limitation as saveItem — see the TODO there re: Storage.
      const imageUrl = imageFile ? URL.createObjectURL(imageFile) : draft.imageUrl;

      await dbUpdate(dbRef(db, `${ITEMS_PATH}/${id}`), {
        ...draft,
        imageUrl,
      });
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update item';
    } finally {
      saving.value = false;
    }
  }

  return { updateItem, saving, error };
}

export function useDeleteItem() {
  const deleting = ref(false);
  const error = ref<string | null>(null);

  async function deleteItem(id: string) {
    deleting.value = true;
    error.value = null;
    try {
      await dbRemove(dbRef(db, `${ITEMS_PATH}/${id}`));
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete item';
    } finally {
      deleting.value = false;
    }
  }

  return { deleteItem, deleting, error };
}