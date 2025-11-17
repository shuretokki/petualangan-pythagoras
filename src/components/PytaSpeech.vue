<script setup lang="ts">
import Message from 'primevue/message';

defineProps<{
  text: string;
}>();
</script>

<template>
  <Message
    :closable="false"
    severity="success"
    :pt="{
      root: {
        class: [
          'min-w-sm max-w-sm px-8 py-4',
          'border-none',
        ],
      },
      wrapper: { class: 'flex' }, 
      text: { class: '' },
    }"
  >
    <!-- 
      The #icon slot replaces PrimeVue's default info icon 
      with your custom emoji.
    -->
    <template #icon>
    </template>

    <!-- 
      The default slot contains your text content, which gets
      placed inside the styled 'text' container.
    -->
    <div class="flex-1">
      <div class="text-sm font-semibold text-emerald-600 mb-1">Pyta:</div>
      <div class="text-gray-800 text-sm" v-html="text"></div>
    </div>
  </Message>
</template>