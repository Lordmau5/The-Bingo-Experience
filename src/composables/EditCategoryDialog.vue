
<template>
  <q-card
    flat
    bordered
    style="min-width: 700px; max-width: 80vw; min-height: 10vh; max-height: 80vh;"
  >
    <q-card-section class="q-gutter-y-md column">
      <q-input
        v-model="category_name"
        :error="!!name_error.length"
        :error-message="name_error"
        square
        filled
        counter
        clearable
        maxlength="40"
        label="Name"
        type="text"
      ></q-input>

      <q-input
        class="col-10"
        v-model="category_description"
        square
        filled
        counter
        autogrow
        maxlength="500"
        label="Description"
        hint="Optional"
        type="text"
      >
        <template v-slot:after>
          <q-btn
            label="Preview"
            outline
            color="green"
            @click="markdown_preview = true"
          />
        </template>
      </q-input>
    </q-card-section>

    <q-separator />

    <q-card-actions>
      <q-btn
        v-if="data.category"
        flat
        color="red"
        icon="delete"
        :label="delete_label"
        @click="deleteCategory()"
        :disabled="!delete_actually_enabled"
      >
        <q-tooltip v-if="has_goal_lists">
          Cannot delete category with goal lists
        </q-tooltip>
      </q-btn>

      <q-space/>

      <q-btn
        flat
        color="red"
        icon="cancel"
        label="Cancel"
        @click="cancel()"
      />
      <q-btn
        flat
        color="green"
        icon="save"
        label="Save"
        @click="saveCategory()"
        :disabled="!canSave()"
      />
    </q-card-actions>
  </q-card>

  <q-dialog v-model="markdown_preview">
    <q-card
      flat
      bordered
    >
      <q-card-section>
        <MarkdownRenderer :text="category_description"/>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import BingoCategory from '@/js/lib/BingoCategory.ts';
import {
	stringCompare
} from '@/js/lib/Util.ts';

const emit = defineEmits([
	'cancel',
	'createCategory',
	'updateCategory',
	'deleteCategory'
]);

const {
	data
} = defineProps<{
	data: {
		reserved_names: string[],
		category?: BingoCategory,
	},
}>();

const markdown_preview = ref(false);

const delete_label = ref('Delete (5)');
const delete_enabled = ref(false);

const has_goal_lists = computed(() => {
	return data.category?.goal_lists?.length;
});

onMounted(() => {
	if (has_goal_lists) {
		delete_label.value = 'Delete';

		return;
	}

	let countdown = 5;
	let interval = setInterval(() => {
		if (--countdown <= 0) {
			clearInterval(interval);
			delete_label.value = 'Delete';
			delete_enabled.value = true;

			return;
		}
		else {
			delete_label.value = `Delete (${ countdown })`;
		}
	}, 1000);
});

const delete_actually_enabled = computed(() => {
	return delete_enabled.value && !has_goal_lists;
});

const category_name = ref('');
const category_description = ref('');

category_name.value = data.category?.name ?? '';
category_description.value = data.category?.description ?? '';

const name_error = computed(() => {
	if (isNameReserved(category_name.value)) {
		return 'Name is reserved';
	}

	return '';
});
function isNameReserved(name: string) {
	return name.length && data.reserved_names.some(reserved_name =>
		reserved_name !== data.category?.name
		&& stringCompare(reserved_name, name));
}

function canSave() {
	return !isNameReserved(category_name.value);
}

function cancel() {
	emit('cancel');
}

function saveCategory() {
	const category = new BingoCategory(category_name.value);
	category.description = category_description.value;

	// Create new category
	if (!data.category) {
		emit('createCategory', category);
	}
	// Update existing category
	else {
		category.goal_lists = data.category.goal_lists;

		emit('updateCategory', data.category, category);
	}
}

function deleteCategory() {
	emit('deleteCategory', data.category);
}
</script>

