<script setup lang="ts">
import profileEm from "@/assets/image/profile_em.png";
import profileVi from "@/assets/image/profile_vi.png";

const props = defineProps<{
    title: string;
    description: string;
    buttonText: string;
    variant: "emerald" | "violet";
}>();

const emit = defineEmits(["start"]);

const avatarSrc = computed(() =>
    props.variant === "violet" ? profileVi : profileEm,
);

const colorClasses = computed(() => {
    return props.variant === "violet"
        ? {
              title: "text-slate-800",
              btn: "!bg-violet-600 !border-violet-600 hover:!bg-violet-700",
              border: "border-violet-100",
              sub: "text-violet-500",
          }
        : {
              title: "text-slate-800",
              btn: "!bg-emerald-600 !border-emerald-600 hover:!bg-emerald-700",
              border: "border-emerald-100",
              sub: "text-emerald-500",
          };
});
</script>

<template>
    <div
        class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAFAFA] p-8 text-center overflow-hidden"
    >
        <div class="absolute inset-0 pointer-events-none z-0">
            <div
                class="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] rounded-full opacity-30 blur-3xl"
                :class="
                    variant === 'violet' ? 'bg-violet-200' : 'bg-emerald-200'
                "
            ></div>
            <div
                class="absolute bottom-[10%] -left-[10%] w-[50%] h-[50%] rounded-full opacity-30 blur-3xl"
                :class="variant === 'violet' ? 'bg-fuchsia-200' : 'bg-teal-200'"
            ></div>
        </div>

        <div class="relative z-10 flex flex-col items-center max-w-sm w-full">
            <div
                class="w-28 h-28 rounded-full bg-white border-4 flex items-center justify-center mb-8 overflow-hidden relative"
                :class="colorClasses.border"
                v-motion
                :initial="{ opacity: 0, scale: 0.5 }"
                :enter="{
                    opacity: 1,
                    scale: 1,
                    transition: { type: 'spring', stiffness: 200, damping: 15 },
                }"
            >
                <img
                    :src="avatarSrc"
                    class="w-full h-full object-cover"
                    alt="Pyta"
                />
            </div>

            <div class="space-y-4 mb-12">
                <h1
                    class="font-recoleta text-4xl font-bold"
                    :class="colorClasses.title"
                    v-motion
                    :initial="{ opacity: 0, y: 20 }"
                    :enter="{ opacity: 1, y: 0, transition: { delay: 100 } }"
                >
                    {{ title }}
                </h1>

                <div
                    class="h-1 w-16 mx-auto rounded-full"
                    :class="
                        variant === 'violet'
                            ? 'bg-violet-200'
                            : 'bg-emerald-200'
                    "
                ></div>

                <p
                    class="text-slate-500 text-lg leading-relaxed"
                    v-motion
                    :initial="{ opacity: 0, y: 20 }"
                    :enter="{ opacity: 1, y: 0, transition: { delay: 200 } }"
                >
                    {{ description }}
                </p>
            </div>

            <div
                v-motion
                :initial="{ opacity: 0, y: 20 }"
                :enter="{ opacity: 1, y: 0, transition: { delay: 300 } }"
                class="w-full"
            >
                <Button
                    :label="buttonText"
                    rounded
                    class="!w-full !py-4 !text-lg !font-bold !text-white transition-transform hover:scale-105 active:scale-95"
                    :class="colorClasses.btn"
                    @click="$emit('start')"
                >
                    <template #icon>
                        <i-lucide-arrow-right class="mr-2 w-5 h-5" />
                    </template>
                </Button>
            </div>
        </div>
    </div>
</template>
