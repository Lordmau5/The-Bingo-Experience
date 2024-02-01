<template>
  <div class="row q-pa-lg items-center justify-evenly q-col-gutter-md">
    <div class="col-12" :style="{ 'max-width': '400px' }">
      <q-card flat bordered>
        <q-card-section horizontal>
          <q-card-section>
            <div class="text-h5 q-mt-sm q-mb-xs">New Game</div>
            <div class="text-caption text-grey">
              Add a new game
            </div>
          </q-card-section>

          <q-space></q-space>

          <q-card-section class="col-5 flex flex-center">
            <q-avatar square size="100px">
              <q-icon name="add" size="4rem"/>
            </q-avatar>
          </q-card-section>
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <q-btn
            flat
            color="green"
            label="Add"
          />

          <q-space/>

          <q-btn
            flat
            color="blue"
            icon="upload"
            label="Import"
          />
        </q-card-actions>
      </q-card>
    </div>
  </div>

  <div class="q-mx-auto" style="max-width: 70vw;">
    <div class="row q-pa-lg items-center justify-evenly q-col-gutter-md">
      <div class="col-12">
        <div class="row items-center justify-evenly">
          <div class="col-4">
            <q-input
              filled
              v-model="search"
              label="Search for games..."
            />
          </div>
        </div>
      </div>

      <div
        class="col"
        v-for="(game, index) of filtered_games"
        :key="game.id"
        :style="{ 'max-width': '500px' }"
      >
        <q-card flat bordered>
          <q-card-section horizontal>
            <q-card-section>
              <q-badge
                v-if="game.is_local"
                outline
                color="orange"
              >
                <div class="text-weight-bold q-my-xs">Local Game</div>
              </q-badge>

              <div class="text-h5 q-mt-sm q-mb-xs">{{ game.name }}</div>
              <div class="text-caption text-grey">
                {{ game.short_description }}
              </div>
            </q-card-section>

            <q-space></q-space>

            <q-card-section class="col-5 flex justify-end">
              <q-avatar square size="100px">
                <q-img
                  :src="`https://picsum.photos/200/200?_=${index}`"
                  width="100%"
                  height="100%"
                />
              </q-avatar>
            </q-card-section>
          </q-card-section>

          <q-separator />

          <q-card-actions>
            <q-btn
              flat
              icon="help"
              @click="learnMore(game)"
            >
              <q-tooltip>
                Learn more...
              </q-tooltip>
            </q-btn>
            <template v-if="game.is_local">
              <q-btn
                flat
                icon="edit"
                color="green"
                :loading="loading"
                @click="editGame(game)"
              >
                <q-tooltip>
                  Edit
                </q-tooltip>
              </q-btn>
              <q-btn
                flat
                icon="delete"
                color="red"
                :loading="loading"
                @click="deleteGameInternal(game.id)"
              >
                <q-tooltip>
                  Delete
                </q-tooltip>
              </q-btn>

              <q-space/>

              <q-btn
                flat
                color="blue"
                icon="download"
                label="Export"
              />
            </template>
            <template v-else>
              <q-btn
                flat
                icon="content_copy"
                color="green"
                :loading="loading"
                :disabled="localGames.hasGame(game.id)"
                @click="cloneGame(game)"
              >
                <q-tooltip>
                  Copy to local
                </q-tooltip>
              </q-btn>
            </template>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </div>

  <q-dialog v-model="learn_more">
    <q-card style="min-width: 700px; max-width: 80vw; min-height: 10vh; max-height: 80vh;">
      <q-card-section class="row items-start q-col-gutter-md">
        <div class="col-2">
          <q-avatar
            square
            size="200px"
            style="width: 100%; height: auto; aspect-ratio: 1/1;"
          >
            <q-img
              src="https://picsum.photos/200/200"
              width="100%"
              height="100%"
            />
          </q-avatar>
        </div>
        <div class="col-6">
          <div class="text-h3">{{ selected_game?.name }}</div>
          <div class="text-h6 text-grey">
            {{ selected_game?.short_description }}
          </div>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <MarkdownRenderer :text="selected_game?.description"/>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="edit_game"
    persistent
  >
    <GameEditorDialog
      v-if="selected_game"
      :game="selected_game"
      @cancel="edit_game = false"
      @add-game="addGame"
      @update-game="updateGame"
    />
  </q-dialog>
</template>

<script setup lang="ts">
import {
	games as parsed_games
} from '@/js/ParseGamesJSON.js';
import BingoGame from '@/js/lib/BingoGame.ts';

// Local game store
import {
	useLocalGamesStore
} from '@/stores/local-games.ts';
const localGames = useLocalGamesStore();

// All games
const games = ref<BingoGame[]>(Array.from(parsed_games.values()));

const loading = ref<boolean>(false);

onMounted(async() => {
	await localGames.fetchGames();
});

const edit_game = ref(false);

function editGame(game: BingoGame) {
	loading.value = true;

	selected_game.value = game;
	edit_game.value = true;

	loading.value = false;
}

async function addGame(game: BingoGame) {
	loading.value = true;

	await localGames.addGame(game);

	loading.value = false;
}

async function updateGame(old_game: BingoGame, game: BingoGame) {
	loading.value = true;

	await localGames.updateGame(old_game, game);

	edit_game.value = false;

	loading.value = false;
}

async function cloneGame(game: BingoGame) {
	loading.value = true;

	await localGames.addGame(game);

	loading.value = false;
}

async function deleteGameInternal(id: string) {
	loading.value = true;

	await localGames.deleteGame(id);

	loading.value = false;
}

// Selected game
const selected_game = ref<BingoGame | undefined>(undefined);

// Popup open state
const learn_more = ref<boolean>(false);

// Search query
const search = ref<string>('');

const combined_games = computed(() => {
	return [
		...games.value,
		...localGames.games.values()
	];
});

// Filter games by search
const filtered_games = computed(() => {
	return combined_games.value.filter(game => game.name.toLocaleLowerCase().includes(search.value.toLocaleLowerCase()));
});

function learnMore(game: BingoGame) {
	selected_game.value = game;
	learn_more.value = true;
}
</script>
