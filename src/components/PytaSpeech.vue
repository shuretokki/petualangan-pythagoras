<script setup lang="ts">
import { computed, ref, watch } from "vue";

const props = withDefaults(
    defineProps<{
        text: string;
        variant?: "emerald" | "violet";
    }>(),
    {
        variant: "emerald",
    },
);

// Typewriter Logic
const displayedText = ref("");
const isTyping = ref(false);

const typeText = async (newText: string) => {
    isTyping.value = true;
    displayedText.value = "";
    const chars = newText.split("");

    // Faster typing for longer text
    const speed = chars.length > 50 ? 10 : 20;

    for (const char of chars) {
        displayedText.value += char;
        await new Promise((r) => setTimeout(r, speed));
    }
    isTyping.value = false;
};

// Watch for text changes to restart typing
watch(
    () => props.text,
    (newVal) => {
        typeText(newVal);
    },
    { immediate: true },
);

// Theme Classes
const containerClass = computed(() => {
    return props.variant === "violet"
        ? "bg-white border-violet-200 text-slate-700 shadow-[0_4px_20px_-4px_rgba(139,92,246,0.15)]"
        : "bg-white border-emerald-200 text-slate-700 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.15)]";
});

const accentClass = computed(() => {
    return props.variant === "violet" ? "text-violet-500" : "text-emerald-500";
});
</script>

<template>
    <div class="relative w-full max-w-sm mx-auto mt-4">
        <div
            class="absolute -top-6 -left-2 w-12 h-12 rounded-full bg-white border-2 flex items-center justify-center text-2xl shadow-sm z-20 transform -rotate-12"
            :class="
                variant === 'violet'
                    ? 'border-violet-100'
                    : 'border-emerald-100'
            "
        >
            🐍
        </div>

        <div
            class="relative rounded-2xl border-2 px-6 py-5 min-h-[90px] flex items-center transition-all duration-300"
            :class="containerClass"
        >
            <div class="pl-6 w-full">
                <h3
                    class="text-[10px] font-bold uppercase tracking-widest mb-1"
                    :class="accentClass"
                >
                    Pyta Berkata:
                </h3>
                <p
                    class="text-sm leading-relaxed font-medium"
                    v-html="displayedText"
                ></p>
            </div>

            <div
                class="absolute -bottom-[10px] left-8 w-5 h-5 bg-white border-b-2 border-r-2 transform rotate-45"
                :class="
                    variant === 'violet'
                        ? 'border-violet-200'
                        : 'border-emerald-200'
                "
            ></div>
        </div>
    </div>
</template>
