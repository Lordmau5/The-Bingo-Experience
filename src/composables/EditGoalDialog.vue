
<template>
  <q-card
    flat
    bordered
    style="min-width: 700px; max-width: 80vw; min-height: 10vh; max-height: 80vh;"
  >
    <q-card-section class="q-gutter-y-md column">
      <q-input
        v-model="goal_name"
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
        v-model="goal_description"
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

      <q-select
        label="Select Tags"
        square
        filled
        v-model="goal_tags"
        use-input
        use-chips
        multiple
        clearable
        hint="Optional"
        hide-dropdown-icon
        input-debounce="0"
        :options="all_tags"
        @new-value="addTag"
      ></q-select>
    </q-card-section>

    <q-separator />

    <q-card-actions>
      <q-btn
        v-if="data.goal"
        flat
        color="red"
        icon="delete"
        :label="delete_label"
        @click="deleteGoal()"
        :disabled="!delete_enabled"
      />

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
        @click="saveGoal()"
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
        <MarkdownRenderer :text="goal_description"/>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import BingoGoal from '@/js/lib/BingoGoal.ts';
import {
	stringCompare
} from '@/js/lib/Util.ts';

const emit = defineEmits([
	'cancel',
	'createGoal',
	'updateGoal',
	'deleteGoal'
]);

const {
	data
} = defineProps<{
	data: {
		all_tags: string[],
		reserved_names: string[],
		goal?: BingoGoal,
	},
}>();

const all_tags: Ref<string[]> = ref([ ...data.all_tags ]);

const markdown_preview = ref(false);

const delete_label = ref('Delete (5)');
const delete_enabled = ref(false);

onMounted(() => {
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

const goal_name = ref('');
const goal_description = ref('');
const goal_tags: Ref<string[]> = ref([ ]);

goal_name.value = data.goal?.name ?? '';
goal_description.value = data.goal?.description ?? '';
goal_tags.value = data.goal?.tags ?? [];

const name_error = computed(() => {
	if (isNameReserved(goal_name.value)) {
		return 'Name is reserved';
	}

	return '';
});
function isNameReserved(name: string) {
	return name.length && data.reserved_names.some(reserved_name =>
		reserved_name !== data.goal?.name
		&& stringCompare(reserved_name, name));
}

function canSave() {
	return !isNameReserved(goal_name.value);
}

function addTag(value: string, done: Function) {
	// Exit if tag already exists
	if (goal_tags.value.some(tag => stringCompare(tag, value))) {
		done();

		return;
	}

	const tag = all_tags.value.find(tag => stringCompare(tag, value));
	value = tag ?? value;

	if (!data.all_tags.some(tag => stringCompare(tag, value))) {
		all_tags.value.push(value);
	}

	done(value, 'toggle');
}

function cancel() {
	emit('cancel');
}

function saveGoal() {
	const goal = new BingoGoal(goal_name.value);
	goal.description = goal_description.value;
	goal.tags = goal_tags.value;

	// Create new goal
	if (!data.goal) {
		emit('createGoal', goal);
	}
	// Update existing goal
	else {
		emit('updateGoal', data.goal, goal);
	}
}

function deleteGoal() {
	emit('deleteGoal', data.goal);
}
</script>

