
<template>
  <q-card
    flat
    bordered
    style="min-width: 700px; max-width: 80vw; min-height: 10vh; max-height: 80vh;"
  >
    <q-card-section class="q-gutter-y-md column">
      <q-input
        v-model="goal_list_name"
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
        v-model="goal_list_description"
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
        v-if="data.goal_list"
        flat
        color="red"
        icon="delete"
        :label="delete_label"
        @click="deleteGoalList()"
        :disabled="!delete_actually_enabled"
      >
        <q-tooltip v-if="has_goals">
          Cannot delete goal list with goals
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
        @click="saveGoalList()"
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
        <MarkdownRenderer :text="goal_list_description"/>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import BingoGoalList from '@/js/lib/BingoGoalList.ts';
import {
	stringCompare
} from '@/js/lib/Util.ts';

const emit = defineEmits([
	'cancel',
	'createGoalList',
	'updateGoalList',
	'deleteGoalList'
]);

const {
	data
} = defineProps<{
	data: {
		reserved_names: string[],
		goal_list?: BingoGoalList,
	},
}>();

const markdown_preview = ref(false);

const delete_label = ref('Delete (5)');
const delete_enabled = ref(false);

const has_goals = computed(() => {
	return data.goal_list?.goals?.length;
});

onMounted(() => {
	if (has_goals) {
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
	return delete_enabled.value && !has_goals;
});

const goal_list_name = ref('');
const goal_list_description = ref('');

goal_list_name.value = data.goal_list?.name ?? '';
goal_list_description.value = data.goal_list?.description ?? '';

const name_error = computed(() => {
	if (isNameReserved(goal_list_name.value)) {
		return 'Name is reserved';
	}

	return '';
});
function isNameReserved(name: string) {
	return name.length && data.reserved_names.some(reserved_name =>
		reserved_name !== data.goal_list?.name
		&& stringCompare(reserved_name, name));
}

function canSave() {
	return !isNameReserved(goal_list_name.value);
}

function cancel() {
	emit('cancel');
}

function saveGoalList() {
	const goal_list = new BingoGoalList(goal_list_name.value);
	goal_list.description = goal_list_description.value;

	// Create new goal list
	if (!data.goal_list) {
		emit('createGoalList', goal_list);
	}
	// Update existing goal list
	else {
		goal_list.goals = data.goal_list.goals;

		emit('updateGoalList', data.goal_list, goal_list);
	}
}

function deleteGoalList() {
	emit('deleteGoalList', data.goal_list);
}
</script>

