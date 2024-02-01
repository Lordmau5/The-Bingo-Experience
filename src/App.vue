<template>
  <q-layout view="hHh LpR fFf">
    <NavbarComponent @toggleLeftDrawer="toggleLeftDrawer"/>
    <SidebarComponent :drawer="leftDrawerOpen"/>

    <q-page-container>
      <!-- This is where the magic happens -->
      <RouterView />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
	leftDrawerOpen.value = !leftDrawerOpen.value;
};
</script>
