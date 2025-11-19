<script setup lang="ts">
import Message from "primevue/message";
import { computed } from "vue";

// Added variant prop to support different moods
const props = withDefaults(
    defineProps<{
        text: string;
        variant?: "emerald" | "violet";
    }>(),
    {
        variant: "emerald",
    },
);

// Dynamic label color based on variant
const labelClass = computed(() => {
    return props.variant === "violet" ? "text-violet-600" : "text-emerald-600";
});

// Dynamic severity to match background tint (Help is usually purple, Success is green)
const severity = computed(() => {
    return props.variant === "violet" ? "help" : "success";
});
</script>

<template>
    <Message
        :closable="false"
        :severity="severity"
        :pt="{
            root: {
                class: [
                    'w-full max-w-sm',
                    'px-5 py-4',
                    'border-none shadow-sm',
                ],
            },
            wrapper: { class: 'flex items-start' },
            text: { class: 'w-full' },
        }"
    >
        <template #icon> </template>

        <div class="flex-1">
            <div class="text-sm font-semibold mb-1" :class="labelClass">
                Pyta:
            </div>
            <div
                class="text-gray-800 text-sm leading-relaxed break-words"
                v-html="text"
            ></div>
        </div>
    </Message>
</template>
