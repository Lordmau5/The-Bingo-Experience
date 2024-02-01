<template>
  <div class="q-pa-md q-gutter-md">
    <div class="row justify-around">
      <q-card class="col-6" style="max-width: 800px; height: 800px;">
        <q-scroll-area style="height: 100%;">
          <GeneratorComponent />
        </q-scroll-area>
      </q-card>

      <q-card class="col-6" style="max-width: 800px; height: 800px;">
        <q-scroll-area style="height: 100%;">
          <GeneratorComponent :edit-mode="true" />
        </q-scroll-area>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
