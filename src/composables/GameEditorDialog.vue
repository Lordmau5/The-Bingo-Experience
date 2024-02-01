<template>
  <!-- TODO: Can't seem to work with flexbox to an extent that makes me happy... -->

  <q-card class="column" style="width: 100%; min-width: 800px; height: 80vh;">
    <div class="col-2">
      <q-card-section class="row justify-evenly q-gutter-md">
        <q-input
          class="col-5"
          v-model="game_id"
          square
          filled
          autogrow
          maxlength="50"
          label="Game ID"
          type="text"
        />

        <q-input
          class="col-5"
          v-model="game_name"
          square
          filled
          autogrow
          maxlength="100"
          label="Game Name"
          type="text"
        />
      </q-card-section>

      <q-card-section class="row justify-evenly q-gutter-md">
        <q-input
          class="col-5"
          v-model="short_description"
          square
          filled
          maxlength="200"
          label="Short Description"
          type="text"
        />

        <div class="col-5 row justify-center self-center">
          <q-btn
            class="col"
            icon="edit"
            color="orange"
            label="Description"
            outline
            @click="description_dialog = true"
          ></q-btn>
        </div>
      </q-card-section>
    </div>

    <div class="col-9 q-pt-sm">
      <q-card-section class="full-height">
        <q-card
          flat
          bordered
          class="full-height"
        >
          <div class="column full-height">
            <div class="col-1">
              <q-card-section class=" q-pa-sm">
                <span class="text-h4">Goal Editor</span>
              </q-card-section>
            </div>

            <div class="col-11">
              <q-separator></q-separator>

              <q-scroll-area class="full-height">
                <q-tree
                  :nodes="nodes"
                  node-key="label"
                  v-model:expanded="expanded"
                >
                  <template v-slot:header-goal="prop">
                    <div class="row items-center">
                      <q-btn
                        icon="edit"
                        flat
                        round
                        size="sm"
                        color="orange"
                        @click="openEditGoalDialog(prop.node)"
                      />
                      <div>{{ prop.node.item?.name || prop.node.label }}</div>
                      <q-btn
                        v-if="prop.node.item?.description?.length"
                        icon="help_outline"
                        flat
                        round
                        size="sm"
                        @click="event => openInfoDialog(prop.node.item?.description, event)"
                      ></q-btn>
                      <q-badge
                        outline
                        v-for="tag in prop.node.item?.tags"
                        :key="tag"
                        :color="getColorForString(tag)"
                        class="q-ml-sm"
                      >
                        <div class="text-weight-bold q-my-xs">{{ tag }}</div>
                      </q-badge>
                    </div>
                  </template>

                  <template v-slot:header-goal-list="prop">
                    <div class="row items-center">
                      <q-btn
                        icon="edit"
                        flat
                        round
                        size="sm"
                        color="orange"
                        @click="event => openEditGoalListDialog(prop.node, event)"
                      />
                      <div>{{ prop.node.item?.name || prop.node.label }}</div>
                      <q-btn
                        v-if="prop.node.item?.description?.length"
                        icon="help_outline"
                        flat
                        round
                        size="sm"
                        @click="event => openInfoDialog(prop.node.item?.description, event)"
                      ></q-btn>
                      <q-badge
                        outline
                        color="orange"
                        class="q-ml-sm"
                      >
                        <div class="text-weight-bold q-my-xs">Goal List</div>
                      </q-badge>
                    </div>
                  </template>

                  <template v-slot:header-category="prop">
                    <div class="row items-center">
                      <q-btn
                        icon="edit"
                        flat
                        round
                        size="sm"
                        color="orange"
                        @click="event => openEditCategoryDialog(prop.node, event)"
                      />
                      <div>{{ prop.node.item?.name || prop.node.label }}</div>
                      <q-btn
                        v-if="prop.node.item?.description?.length"
                        icon="help_outline"
                        flat
                        round
                        size="sm"
                        @click="event => openInfoDialog(prop.node.item?.description, event)"
                      ></q-btn>
                      <q-badge
                        outline
                        color="blue"
                        class="q-ml-sm"
                      >
                        <div class="text-weight-bold q-my-xs">Category</div>
                      </q-badge>
                    </div>
                  </template>

                  <!-- Add Goal -->
                  <template v-slot:header-add-goal="prop">
                    <div class="row items-center">
                      <q-btn
                        outline
                        icon="add"
                        label="Goal"
                        color="light-blue"
                        size="sm"
                        @click="openEditGoalDialog(prop.node)"
                      ></q-btn>
                    </div>
                  </template>

                  <!-- Add Goal List -->
                  <template v-slot:header-add-goal-list="prop">
                    <div class="row items-center">
                      <q-btn
                        outline
                        icon="add"
                        label="Goal List"
                        color="light-blue"
                        size="sm"
                        @click="event => openEditGoalListDialog(prop.node, event)"
                      ></q-btn>
                    </div>
                  </template>

                  <!-- Add Category -->
                  <template v-slot:header-add-category="prop">
                    <div class="row items-center">
                      <q-btn
                        outline
                        icon="add"
                        label="Category"
                        color="light-blue"
                        size="sm"
                        @click="event => openEditCategoryDialog(prop.node, event)"
                      ></q-btn>
                    </div>
                  </template>
                </q-tree>
              </q-scroll-area>
            </div>
          </div>
        </q-card>
      </q-card-section>
    </div>

    <div class="col-1">
      <q-card-actions class="full-height items-end">
        <q-space/>

        <q-btn
          flat
          color="red"
          icon="cancel"
          label="Cancel"
          :loading="loading"
          @click="cancel"
        />
        <q-btn
          flat
          color="green"
          icon="save"
          label="Save"
          :loading="loading"
          @click="saveGame"
        />
      </q-card-actions>
    </div>
  </q-card>

  <q-dialog v-model="description_dialog">
    <q-card
      class="column"
      flat
      bordered
      style="min-width: 700px; max-width: 80vw; min-height: 10vh; max-height: 70vh;"
    >
      <div class="col-1">
        <q-card-section>
          <span class="text-h4">Description Editor</span>
        </q-card-section>
      </div>

      <div class="col-6">
        <q-card-section>
          <q-input
            v-model="game_description"
            square
            filled
            counter
            autogrow
            maxlength="500"
            label="Description"
            type="text"
          />
        </q-card-section>
      </div>

      <div class="col-1">
        <q-card-actions class="full-height items-end">
          <q-btn
            flat
            color="red"
            icon="cancel"
            label="Preview"
            :loading="loading"
            @click="event => openInfoDialog(game_description, event)"
          />

          <q-space/>

          <q-btn
            flat
            color="red"
            icon="cancel"
            label="Save"
            :loading="loading"
          />
        </q-card-actions>
      </div>
    </q-card>
  </q-dialog>

  <q-dialog v-model="info_dialog">
    <q-card
      flat
      bordered
      style="min-width: 700px; max-width: 80vw; min-height: 10vh; max-height: 80vh;"
    >
      <q-card-section>
        <MarkdownRenderer :text="info_dialog_text"/>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="edit_goal_dialog" persistent>
    <EditGoalDialog
      :data="edit_goal_data"
      @cancel="edit_goal_dialog = false"
      @create-goal="create_goal"
      @update-goal="update_goal"
      @delete-goal="delete_goal"
    />
  </q-dialog>

  <q-dialog v-model="edit_goal_list_dialog" persistent>
    <EditGoalListDialog
      :data="edit_goal_list_data"
      @cancel="edit_goal_list_dialog = false"
      @create-goal-list="create_goal_list"
      @update-goal-list="update_goal_list"
      @delete-goal-list="delete_goal_list"
    />
  </q-dialog>

  <q-dialog v-model="edit_category_dialog" persistent>
    <EditCategoryDialog
      :data="edit_category_data"
      @cancel="edit_category_dialog = false"
      @create-category="create_category"
      @update-category="update_category"
      @delete-category="delete_category"
    />
  </q-dialog>
</template>

<script setup lang="ts">
interface Node {
	item?: BingoGoal | BingoGoalList | BingoCategory;
	parent?: BingoCategory | BingoGoalList;

	label: string;
	header?: string; // 'goal' | 'goal-list' | 'category' | 'add-goal' | 'add-goal-list' | 'add-category'

	children?: Node[];
}

import {
	getColorForString
} from '@/js/lib/Util.ts';

import BingoCategory from '@/js/lib/BingoCategory.ts';
import BingoGame from '@/js/lib/BingoGame.ts';
import BingoGoal from '@/js/lib/BingoGoal.ts';
import BingoGoalList from '@/js/lib/BingoGoalList.ts';
import Parser from '@/js/lib/Parser.ts';

const props = defineProps<{
	game?: BingoGame;
}>();

const emit = defineEmits([
	'cancel',
	'addGame',
	'updateGame'
]);

const game = ref(
	props.game
		? Parser.getCopy(props.game)
		: new BingoGame('new-game', 'New Game', 'A short description', 'A long description')
);
game.value.is_local = true;

const game_id = ref(game.value.id);
const game_name = ref(game.value.name);
const short_description = ref(game.value.short_description);
const game_description = ref(game.value.description.substring(0, 500));
const description_dialog = ref(false);

const expanded = ref<Node[]>([]);

const loading = ref(false);

function cancel() {
	loading.value = true;

	emit('cancel');
}

function saveGame() {
	loading.value = true;

	// Updating game
	if (props.game) {
		game.value.id = game_id.value;
		game.value.name = game_name.value;
		game.value.short_description = short_description.value;
		game.value.description = game_description.value;

		emit('updateGame', props.game, game.value);
	}
	// Adding game
	else {
		emit('addGame', game.value);
	}
}

/* Info Dialog */
const info_dialog = ref(false);
const info_dialog_text = ref('');

function openInfoDialog(text: string, event: Event) {
	// Stop expanding of the tree
	event.stopPropagation();

	info_dialog_text.value = text;
	info_dialog.value = true;
}

/* End Info Dialog */

/* Edit Goal Dialog */
interface EditGoalData {
	goal?: BingoGoal;
	all_tags: string[];
	reserved_names: string[];
	parent_group: BingoCategory | BingoGoalList | undefined;
}

const edit_goal_data = ref<EditGoalData>({
	all_tags: [] as string[],
	reserved_names: [] as string[],
	parent_group: undefined
});
const edit_goal_dialog = ref(false);
const openEditGoalDialog = (node: Node) => {
	edit_goal_data.value.goal = node.item as BingoGoal;
	edit_goal_data.value.reserved_names = game.value?.reserved_names ?? [];
	edit_goal_data.value.parent_group = node.parent;
	edit_goal_data.value.all_tags = game.value?.getAllTags() ?? [];
	edit_goal_dialog.value = true;
};

const create_goal = (goal: BingoGoal) => {
	// We always assume parent group is a goal list. You can't add goals to categories.
	const goal_list = edit_goal_data.value.parent_group as BingoGoalList;

	goal_list.goals.push(goal);

	// Reset values
	edit_goal_data.value = {
		goal: undefined,
		all_tags: [],
		reserved_names: [],
		parent_group: undefined
	};
	edit_goal_dialog.value = false;
};

const update_goal = (old_goal: BingoGoal, goal: BingoGoal) => {
	// We always assume parent group is a goal list. You can't add goals to categories.
	const goal_list = edit_goal_data.value.parent_group as BingoGoalList;

	const index = goal_list.goals.findIndex(g => g === old_goal);
	goal_list.goals.splice(index, 1, goal);

	// Reset values
	edit_goal_data.value = {
		goal: undefined,
		all_tags: [],
		reserved_names: [],
		parent_group: undefined
	};
	edit_goal_dialog.value = false;
};

const delete_goal = (goal: BingoGoal) => {
	// We always assume parent group is a goal list. You can't add goals to categories.
	const goal_list = edit_goal_data.value.parent_group as BingoGoalList;

	const index = goal_list.goals.findIndex(g => g === goal);
	goal_list.goals.splice(index, 1);

	// Reset values
	edit_goal_data.value = {
		goal: undefined,
		all_tags: [],
		reserved_names: [],
		parent_group: undefined
	};
	edit_goal_dialog.value = false;
};

/* End Edit Goal Dialog */

/* Edit Goal List Dialog */
interface EditGoalListData {
	goal_list?: BingoGoalList;
	reserved_names: string[];
	parent_group: BingoCategory | undefined;
}

const edit_goal_list_data = ref<EditGoalListData>({
	reserved_names: [] as string[],
	parent_group: undefined
});

const edit_goal_list_dialog = ref(false);

function openEditGoalListDialog(node: Node, event: Event) {
	// Stop expanding of the tree
	event.stopPropagation();

	edit_goal_list_data.value.goal_list = node.item as BingoGoalList;
	edit_goal_list_data.value.reserved_names = game.value?.reserved_names ?? [];
	edit_goal_list_data.value.parent_group = node.parent as BingoCategory;
	edit_goal_list_dialog.value = true;
}

const create_goal_list = (goal_list: BingoGoalList) => {
	// We always assume parent group is a category. You can't add goal lists to goal lists.
	const category = edit_goal_list_data.value.parent_group as BingoCategory;

	// Add goal list to category
	if (category) {
		category.goal_lists.push(goal_list);
	}
	// Add goal list to game
	else {
		game.value?.items.push(goal_list);
	}

	// Reset values
	edit_goal_list_data.value = {
		parent_group: undefined,
		reserved_names: []
	};
	edit_goal_list_dialog.value = false;
};

const update_goal_list = (old_goal_list: BingoGoalList, goal_list: BingoGoalList) => {
	// We always assume parent group is a category. You can't add goal lists to goal lists.
	const category = edit_goal_list_data.value.parent_group as BingoCategory;

	// Replace existing goal list in category
	if (category) {
		const index = category.goal_lists.findIndex(g => g === old_goal_list);
		category.goal_lists.splice(index, 1, goal_list);
	}
	// Replace existing goal list in game
	else {
		const index = game.value?.items.findIndex(g => g === old_goal_list);
		game.value?.items.splice(index, 1, goal_list);
	}

	// Reset values
	edit_goal_list_data.value = {
		parent_group: undefined,
		reserved_names: []
	};
	edit_goal_list_dialog.value = false;
};

const delete_goal_list = (goal_list: BingoGoalList) => {
	// Prevent deletion if goal list still has goals
	if (!goal_list.goals.length) {
		// We always assume parent group is a category. You can't add goal lists to goal lists.
		const category = edit_goal_list_data.value.parent_group as BingoCategory;

		// Delete goal list from category
		if (category) {
			const index = category.goal_lists.findIndex(g => g === goal_list);
			category.goal_lists.splice(index, 1);
		}
		// Delete goal list from game
		else {
			const index = game.value?.items.findIndex(g => g === goal_list);
			game.value?.items.splice(index, 1);
		}
	}

	// Reset values
	edit_goal_list_data.value = {
		parent_group: undefined,
		reserved_names: []
	};
	edit_goal_list_dialog.value = false;
};

/* End Edit Goal List Dialog */

/* Edit Category Dialog */

interface EditCategoryData {
	reserved_names: string[];
	category?: BingoCategory;
}

const edit_category_data = ref<EditCategoryData>({
	reserved_names: [] as string[]
});

const edit_category_dialog = ref(false);

function openEditCategoryDialog(node: Node, event: Event) {
	// Stop expanding of the tree
	event.stopPropagation();

	edit_category_data.value.category = node.item as BingoCategory;
	edit_category_dialog.value = true;
}

const create_category = (category: BingoCategory) => {
	game.value?.items.push(category);

	// Reset values
	edit_category_data.value = {
		reserved_names: []
	};
	edit_category_dialog.value = false;
};

const update_category = (old_category: BingoCategory, category: BingoCategory) => {
	const index = game.value?.items.findIndex(g => g === old_category);
	game.value?.items.splice(index, 1, category);

	// Reset values
	edit_category_data.value = {
		reserved_names: []
	};
	edit_category_dialog.value = false;
};

const delete_category = (category: BingoCategory) => {
	const index = game.value?.items.findIndex(g => g === category);
	game.value?.items.splice(index, 1);

	// Reset values
	edit_category_data.value = {
		reserved_names: []
	};
	edit_category_dialog.value = false;
};

// const emit_category = (category: BingoCategory) => {
// 	// Add new category
// 	if (!edit_category_data.value.category) {
// 		game.value?.items.push(category);
// 	}
// 	// Replace existing category
// 	else {
// 		const index = game.value?.items.findIndex(g => g === category);
// 		game.value?.items.splice(index, 1, category);
// 	}

// 	// Reset values
// 	edit_category_data.value = {
// 		reserved_names: []
// 	};
// 	edit_category_dialog.value = false;
// };

// const delete_category = (category: BingoCategory) => {
// 	const index = game.value?.items.findIndex(g => g === category);
// 	game.value?.items.splice(index, 1);

// 	// Reset values
// 	edit_category_data.value = {
// 		reserved_names: []
// 	};
// 	edit_category_dialog.value = false;
// };

/* End Edit Category Dialog */

const nodes = computed(() => {
	const results: Node[] = [];

	if (!game.value) {
		return results;
	}

	results.push(...game.value?.items.map(item => {
		const is_category = item instanceof BingoCategory;
		const is_goal_list = item instanceof BingoGoalList;

		const group_node: Node = {
			item,

			label: item.name,
			header: is_category
				? 'category'
				: is_goal_list
					? 'goal-list'
					: '',

			children: []
		};

		if (is_category) {
			group_node.children = item.goal_lists.map(goal_list => {
				const goal_list_node: Node = {
					item: goal_list,
					parent: item,

					label: goal_list.name,
					header: 'goal-list',

					children: []
				};

				goal_list_node.children?.push(...goal_list.goals.map(goal => {
					const goal_node: Node = {
						item: goal,
						parent: goal_list,

						label: goal.name,
						header: 'goal'
					};

					return goal_node;
				}));

				goal_list_node.children?.push({
					label: 'Add Goal',
					header: 'add-goal',
					parent: goal_list
				});

				return goal_list_node;
			});


			group_node.children?.push({
				label: 'Add Goal List',
				header: 'add-goal-list'
			});
		}
		else if (is_goal_list) {
			group_node.children = item.goals.map(goal => {
				const goal_node: Node = {
					item: goal,
					parent: item,

					label: goal.name,
					header: 'goal'
				};

				return goal_node;
			});

			group_node.children.push({
				label: 'Add Goal',
				header: 'add-goal',
				parent: item
			});
		}

		return group_node;
	}));

	results.push({
		label: 'Add Goal List',
		header: 'add-goal-list'
	});

	results.push({
		label: 'Add Category',
		header: 'add-category'
	});

	return results;
});
</script>

