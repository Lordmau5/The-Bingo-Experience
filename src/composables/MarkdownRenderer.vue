<template>
  <div v-html="markdown"></div>
</template>

<script setup lang="ts">
import MarkdownIt from 'markdown-it';
const md = new MarkdownIt();

const {
	text
} = defineProps({
	text: {
		type: String,
		required: true,
		default: ''
	}
});

const markdown = computed(() => {
	return md.render(text);
});
</script>
