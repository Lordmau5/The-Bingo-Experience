<template>
  <span>TODO: Show a big list with all games and let user tick things. Use that for generation.</span>
  <!-- <q-tree
    :nodes="nodes"
    node-key="label"
    tick-strategy="leaf"
    v-model:selected="selected"
    v-model:ticked="ticked"
    v-model:expanded="expanded"
  >
    <template v-slot:header-goal="prop">
      <div class="row items-center">
        <q-btn
          v-if="editMode"
          icon="edit"
          flat
          round
          size="sm"
          color="orange"
          @click="openEditGoalDialog(prop.node)"
        />
        <div>{{ prop.node.label }}</div>
        <q-badge
          outline
          v-for="tag in prop.node.goal.tags"
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
          v-if="editMode"
          icon="edit"
          flat
          round
          size="sm"
          color="orange"
        />
        <div>{{ prop.node.label }}</div>
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
          v-if="editMode"
          icon="edit"
          flat
          round
          size="sm"
          color="orange"
        />
        <div>{{ prop.node.label }}</div>
        <q-badge
          outline
          color="blue"
          class="q-ml-sm"
        >
          <div class="text-weight-bold q-my-xs">Category</div>
        </q-badge>
      </div>
    </template>

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

    <template v-slot:header-add-goal-list="prop">
      <div class="row items-center">
        <q-btn
          outline
          icon="add"
          label="Goal List"
          color="light-blue"
          size="sm"
        ></q-btn>
      </div>
    </template>

    <template v-slot:header-add-category="prop">
      <div class="row items-center">
        <q-btn
          outline
          icon="add"
          label="Category"
          color="light-blue"
          size="sm"
        ></q-btn>
      </div>
    </template>
  </q-tree>

  <q-dialog v-model="edit_goal_dialog" persistent>
    <EditGoalDialog
      :data="edit_goal_data"
      @cancel="edit_goal_dialog = false"
      @delete-goal="delete_goal"
      @emit-goal="emit_goal"
    />
  </q-dialog> -->
</template>

<script setup lang="ts">
// interface Node {
// 	label: string;
// 	header?: string; // 'goal' | 'goal-list' | 'category' | 'add-goal' | 'add-goal-list' | 'add-category'
// 	children?: Node[];
// 	goal?: BingoGoal;
// 	parent?: BingoCategory | BingoGoalList;
// 	tickable?: boolean;
// 	noTick?: boolean;
// }

// import {
// 	getColorForString
// } from '@/js/lib/Util.ts';

// import BingoCategory from '@/js/lib/BingoCategory.ts';
// import type BingoGame from '@/js/lib/BingoGame.ts';
// import BingoGoal from '@/js/lib/BingoGoal.ts';
// import BingoGoalList from '@/js/lib/BingoGoalList.ts';
// import Parser from '@/js/lib/Parser.ts';

// const props = defineProps<{
// 	editMode: boolean;
// 	game: BingoGame;
// }>();

// const game = Parser.getCopy(props.game);
// const editMode = props.editMode;

// const selected = ref<Node[]>([]);
// const ticked = ref<Node[]>([]);
// const expanded = ref<Node[]>([]);

// /* Edit Goal Dialog */
// interface EditGoalData {
// 	goal?: BingoGoal;
// 	all_tags: string[];
// 	parent_group: BingoCategory | BingoGoalList | undefined;
// }

// const edit_goal_data = ref<EditGoalData>({
// 	all_tags: [] as string[],
// 	parent_group: undefined
// });
// const edit_goal_dialog = ref(false);
// const openEditGoalDialog = (node: Node) => {
// 	edit_goal_data.value.goal = node.goal;
// 	edit_goal_data.value.parent_group = node.parent;
// 	edit_goal_data.value.all_tags = game?.getAllTags() ?? [];
// 	edit_goal_dialog.value = true;
// };

// const delete_goal = (goal: BingoGoal) => {
// 	// We always assume parent group is a goal list. You can't add goals to categories.
// 	const goal_list = edit_goal_data.value.parent_group as BingoGoalList;

// 	const index = goal_list.goals.findIndex(g => g === goal);
// 	goal_list.goals.splice(index, 1);

// 	// Reset values
// 	edit_goal_data.value = {
// 		goal: undefined,
// 		all_tags: [],
// 		parent_group: undefined
// 	};
// 	edit_goal_dialog.value = false;
// };

// const emit_goal = (goal: BingoGoal) => {
// 	// We always assume parent group is a goal list. You can't add goals to categories.
// 	const goal_list = edit_goal_data.value.parent_group as BingoGoalList;

// 	// Add new goal
// 	if (!edit_goal_data.value.goal) {
// 		goal_list.goals.push(goal);
// 	}
// 	// Replace existing goal
// 	else {
// 		const index = goal_list.goals.findIndex(g => g === edit_goal_data.value.goal);
// 		goal_list.goals.splice(index, 1, goal);
// 	}

// 	// Reset values
// 	edit_goal_data.value = {
// 		goal: undefined,
// 		all_tags: [],
// 		parent_group: undefined
// 	};
// 	edit_goal_dialog.value = false;
// };

// // const getAllGoals = (node: Node): BingoGoal[] => {
// // 	const goals: BingoGoal[] = [];
// // 	if (node.children) {
// // 		for (const child of node.children) {
// // 			goals.push(...getAllGoals(child));
// // 		}
// // 	}
// // 	else if (node.goal) {
// // 		goals.push(node.goal);
// // 	}

// // 	return goals;
// // };

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// // const selectByTag = (tag: string) => {
// // 	ticked.value.length = 0;
// // 	ticked.value.push(...nodes.value.filter(node => {
// // 		return getAllGoals(node).map(goal => goal.tags.includes(tag));
// // 	}));

// // 	console.log(ticked.value);
// // };

// const nodes = computed(() => {
// 	const results: Node[] = [];

// 	if (!game) {
// 		return results;
// 	}

// 	results.push(...game.items.map(item => {
// 		const is_category = item instanceof BingoCategory;
// 		const is_goal_list = item instanceof BingoGoalList;

// 		const group_node: Node = {
// 			label: item.name,
// 			header: is_category
// 				? 'category'
// 				: is_goal_list
// 					? 'goal-list'
// 					: '',
// 			children: [],
// 			tickable: !editMode,
// 			noTick: editMode
// 		};

// 		if (is_category) {
// 			group_node.children = item.goal_lists.map(goal_list => {
// 				const goal_list_node: Node = {
// 					label: goal_list.name,
// 					header: 'goal-list',
// 					children: [],
// 					tickable: !editMode,
// 					noTick: editMode
// 				};

// 				goal_list_node.children?.push(...goal_list.goals.map(goal => {
// 					const goal_node: Node = {
// 						label: goal.name,
// 						header: 'goal',
// 						goal,
// 						parent: goal_list,
// 						tickable: !editMode,
// 						noTick: editMode
// 					};

// 					return goal_node;
// 				}));

// 				if (editMode) {
// 					goal_list_node.children?.push({
// 						label: 'Add Goal',
// 						header: 'add-goal',
// 						parent: goal_list,
// 						tickable: false,
// 						noTick: true
// 					});
// 				}

// 				return goal_list_node;
// 			});

// 			if (editMode) {
// 				group_node.children?.push({
// 					label: 'Add Goal List',
// 					header: 'add-goal-list',
// 					tickable: false,
// 					noTick: true
// 				});
// 			}
// 		}
// 		else if (is_goal_list) {
// 			group_node.children = item.goals.map(goal => {
// 				const goal_node: Node = {
// 					label: goal.name,
// 					header: 'goal',
// 					goal,
// 					parent: item,
// 					tickable: !editMode,
// 					noTick: editMode
// 				};

// 				return goal_node;
// 			});

// 			if (editMode) {
// 				group_node.children.push({
// 					label: 'Add Goal',
// 					header: 'add-goal',
// 					parent: item,
// 					tickable: false,
// 					noTick: true
// 				});
// 			}
// 		}

// 		return group_node;
// 	}));

// 	if (editMode) {
// 		results.push({
// 			label: 'Add Goal List',
// 			header: 'add-goal-list',
// 			tickable: false,
// 			noTick: true
// 		});

// 		results.push({
// 			label: 'Add Category',
// 			header: 'add-category',
// 			tickable: false,
// 			noTick: true
// 		});
// 	}

// 	return results;
// });
</script>

