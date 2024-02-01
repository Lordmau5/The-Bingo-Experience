<template>
  <q-drawer :model-value="drawer" side="left" elevated>
    <q-scroll-area class="fit">
      <q-list>

        <template v-for="(menuItem, index) in menuList" :key="index">
          <q-item clickable v-ripple :to="{ name: menuItem.to }">
            <q-item-section avatar>
              <q-icon :name="menuItem.icon" />
            </q-item-section>
            <q-item-section>
              {{ menuItem.label }}
            </q-item-section>
          </q-item>
          <q-separator :key="'sep' + index"  v-if="menuItem.separator" />
        </template>

      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup lang="ts">
const {
	drawer
} = defineProps({
	drawer: {
		type: Boolean,
		required: true,
		default: false
	}
});

const menuList = [
	{
		icon: 'home',
		label: 'Home',
		separator: true,
		to: 'home'
	},
	{
		icon: 'replay',
		label: 'Generator',
		separator: false,
		to: 'generator'
	},
	{
		icon: 'edit',
		label: 'Editor',
		separator: false,
		to: 'editor'
	}
];
</script>
