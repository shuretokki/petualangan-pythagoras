<script setup lang="ts">
import Message from 'primevue/message';

defineProps<{
  text: string;
}>();
</script>

<template>
  <Message
    :closable="false"
    severity="info"
    :pt="{
      root: {
        class: [
          'max-w-2xl bg-white/95 rounded-2xl shadow-lg p-6',
          'border-none', // Removes PrimeVue's default severity border
        ],
      },
      wrapper: { class: 'flex items-center gap-4' }, // Applies the flex layout
      icon: { class: 'text-6xl' }, // Styles the content of the #icon slot
      text: { class: 'flex-1 p-0' }, // Styles the container of the default slot
    }"
  >
    <!-- 
      The #icon slot replaces PrimeVue's default info icon 
      with your custom emoji.
    -->
    <template #icon>
      🐍
    </template>

    <!-- 
      The default slot contains your text content, which gets
      placed inside the styled 'text' container.
    -->
    <div class="flex-1">
      <div class="text-sm font-semibold text-purple-600 mb-1">Pyta berkata:</div>
      <div class="text-gray-800" v-html="text"></div>
    </div>
  </Message>
</template>