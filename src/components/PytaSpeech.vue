<script setup lang="ts">
import profileEm from "@/assets/image/profile_em.png";
import profileVi from "@/assets/image/profile_vi.png";

const props = withDefaults(
    defineProps<{
        text: string;
        variant?: "emerald" | "violet";
    }>(),
    {
        variant: "emerald",
    },
);

const displayedText = ref("");
const isTyping = ref(false);
let currentJobId = 0;

const typeText = async (newText: string) => {
    const jobId = ++currentJobId;
    isTyping.value = true;
    displayedText.value = "";

    const chars = newText.split("");
    const speed = chars.length > 60 ? 15 : 25;

    for (const char of chars) {
        if (jobId !== currentJobId) return;
        displayedText.value += char;
        await new Promise((r) => setTimeout(r, speed));
    }

    if (jobId === currentJobId) {
        isTyping.value = false;
    }
};

watch(
    () => props.text,
    (newVal) => {
        typeText(newVal);
    },
    { immediate: true },
);

onUnmounted(() => {
    currentJobId++;
});

const avatarSrc = computed(() => {
    return props.variant === "violet" ? profileVi : profileEm;
});

const containerClass = computed(() => {
    return props.variant === "violet"
        ? "bg-white border-violet-200 text-slate-700"
        : "bg-white border-emerald-200 text-slate-700";
});

const accentClass = computed(() => {
    return props.variant === "violet" ? "text-violet-500" : "text-emerald-500";
});
</script>

<template>
    <div class="relative w-full max-w-sm mx-auto mt-4 z-20">
        <div
            class="absolute -top-6 -left-2 w-14 h-14 rounded-full bg-white border-2 flex items-center justify-center z-20 transform -rotate-6 transition-transform hover:rotate-0 duration-300 overflow-hidden"
            :class="
                variant === 'violet'
                    ? 'border-violet-100'
                    : 'border-emerald-100'
            "
        >
            <img
                :src="avatarSrc"
                alt="Pyta"
                class="w-full h-full object-cover"
            />
        </div>

        <div
            class="relative rounded-lg border px-6 py-5 min-h-[90px] flex items-center transition-all duration-300"
            :class="containerClass"
        >
            <div class="pl-8 w-full">
                <h3
                    class="text-[10px] font-bold uppercase tracking-widest mb-1"
                    :class="accentClass"
                >
                    Pyta:
                </h3>
                <p class="text-sm leading-relaxed font-medium text-slate-600">
                    <span v-html="displayedText"></span
                    ><span v-if="isTyping" class="animate-pulse text-slate-400"
                        >|</span
                    >
                </p>
            </div>

            <div
                class="absolute -bottom-[9px] left-8 w-4 h-4 bg-white border-b-1 border-r-1 transform rotate-45"
                :class="
                    variant === 'violet'
                        ? 'border-violet-200'
                        : 'border-emerald-200'
                "
            ></div>
        </div>
    </div>
</template>
