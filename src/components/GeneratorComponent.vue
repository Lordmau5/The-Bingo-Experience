<template>
  <q-tree
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
        />
        <div>{{ prop.node.label }}</div>
        <q-badge
          outline
          v-for="tag in prop.node.goal.tags"
          :key="tag"
          :color="getColorForTag(tag)"
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

    <!-- Add Goal -->
    <template v-slot:header-add-goal="prop">
      <div class="row items-center">
        <q-btn
          outline
          icon="add"
          label="Goal"
          color="light-blue"
          size="sm"
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
        ></q-btn>
      </div>
    </template>
  </q-tree>
</template>

<script setup lang="ts">
interface Node {
	label: string;
	header?: string; // 'goal' | 'goal-list' | 'category' | 'add-goal' | 'add-goal-list' | 'add-category'
	children?: Node[];
	goal?: BingoGoal;
	tickable?: boolean;
	noTick?: boolean;
}

import BingoCategory from '@/js/lib/BingoCategory.ts';
import type BingoGoal from '@/js/lib/BingoGoal.ts';
import BingoGoalList from '@/js/lib/BingoGoalList.ts';

import {
	useLocalGamesStore
} from '@/stores/local-games.ts';
const localGames = useLocalGamesStore();

onMounted(async() => {
	await localGames.fetchGames();
});

const {
	editMode
} = defineProps({
	editMode: Boolean
});

const selected = ref<Node[]>([]);
const ticked = ref<Node[]>([]);
const expanded = ref<Node[]>([]);

const getColorForTag = (tag: string) => {
	switch (tag) {
		case 'Easy':
			return 'green';
		case 'Normal':
			return 'orange';
		case 'Hard':
			return 'red';
		default:
			return 'primary';
	}
};

const getAllGoals = (node: Node): BingoGoal[] => {
	const goals: BingoGoal[] = [];
	if (node.children) {
		for (const child of node.children) {
			goals.push(...getAllGoals(child));
		}
	}
	else if (node.goal) {
		goals.push(node.goal);
	}

	return goals;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const selectByTag = (tag: string) => {
	ticked.value.length = 0;
	ticked.value.push(...nodes.value.filter(node => {
		return getAllGoals(node).map(goal => goal.tags.includes(tag));
	}));
};

const nodes = computed(() => {
	return localGames.games.map(game => {
		const game_node: Node = {
			label: game.name,
			children: [],
			tickable: !editMode,
			noTick: editMode
		};

		game_node.children = game.items.map(item => {
			const is_category = item instanceof BingoCategory;
			const is_goal_list = item instanceof BingoGoalList;

			const group_node: Node = {
				label: item.name,
				header: is_category
					? 'category'
					: is_goal_list
						? 'goal-list'
						: '',
				children: [],
				tickable: !editMode,
				noTick: editMode
			};

			if (is_category) {
				group_node.children = item.goal_lists.map(goal_list => {
					const goal_list_node: Node = {
						label: goal_list.name,
						header: 'goal-list',
						children: [],
						tickable: !editMode,
						noTick: editMode
					};

					goal_list_node.children?.push(...goal_list.goals.map(goal => {
						const goal_node: Node = {
							label: goal.name,
							header: 'goal',
							goal,
							tickable: !editMode,
							noTick: editMode
						};

						return goal_node;
					}));

					if (editMode) {
						goal_list_node.children?.push({
							label: 'Add Goal',
							header: 'add-goal',
							tickable: false,
							noTick: true
						});
					}

					return goal_list_node;
				});

				if (editMode) {
					group_node.children?.push({
						label: 'Add Goal List',
						header: 'add-goal-list',
						tickable: false,
						noTick: true
					});
				}
			}
			else if (is_goal_list) {
				group_node.children = item.goals.map(goal => {
					const goal_node: Node = {
						label: goal.name,
						header: 'goal',
						goal,
						tickable: !editMode,
						noTick: editMode
					};

					return goal_node;
				});

				if (editMode) {
					group_node.children.push({
						label: 'Add Goal',
						header: 'add-goal',
						tickable: false,
						noTick: true
					});
				}
			}

			return group_node;
		});

		if (editMode) {
			game_node.children.push({
				label: 'Add Goal List',
				header: 'add-goal-list',
				tickable: false,
				noTick: true
			});

			game_node.children.push({
				label: 'Add Category',
				header: 'add-category',
				tickable: false,
				noTick: true
			});
		}

		return game_node;
	});
});
</script>
