<script setup lang="ts">
import profileEm from "@/assets/image/profile_em.png";
import profileVi from "@/assets/image/profile_vi.png";

const router = useRouter();
const route = useRoute();

const navigateTo = (routeName: string) => {
    router.push({ name: routeName });
};

const isActive = (routeName: string) => {
    return route.name === routeName;
};

const isVioletTheme = computed(() => {
    return ["contoh-soal", "kuis"].includes(route.name as string);
});

const logoSrc = computed(() => {
    return isVioletTheme.value ? profileVi : profileEm;
});
</script>

<template>
    <Toolbar
        unstyled
        :pt="{
            root: 'flex flex-col items-center gap-0 pb-2 w-full max-w-sm mx-auto',
        }"
    >
        <template #start>
            <div class="flex items-center gap-3 my-3">
                <div
                    class="w-10 h-10 rounded-full overflow-hidden border-2 transition-all duration-500"
                    :class="
                        isVioletTheme
                            ? 'border-violet-200'
                            : 'border-emerald-200'
                    "
                >
                    <img
                        :src="logoSrc"
                        alt="Pyta"
                        class="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <h1
                        class="font-recoleta text-xl font-bold leading-none transition-colors duration-500"
                        :class="
                            isVioletTheme ? 'text-slate-800' : 'text-slate-900'
                        "
                    >
                        Pythagoras
                    </h1>
                    <p
                        class="text-xs font-light uppercase tracking-wider mt-1 transition-colors duration-500"
                        :class="
                            isVioletTheme ? 'text-violet-500' : 'text-slate-500'
                        "
                    >
                        Petualangan Matematika
                    </p>
                </div>
            </div>
        </template>

        <template #end>
            <div class="flex flex-wrap justify-center gap-1 w-full px-2">
                <Button
                    v-for="item in [
                        { label: 'Home', name: 'home' },
                        { label: 'Materi', name: 'materi' },
                        { label: 'Contoh', name: 'contoh-soal' },
                        { label: 'Kuis', name: 'kuis' },
                    ]"
                    :key="item.name"
                    :label="item.label"
                    text
                    rounded
                    plain
                    size="small"
                    @click="navigateTo(item.name)"
                    class="!px-3 !py-1.5 transition-all duration-300"
                    :class="[
                        isActive(item.name)
                            ? isVioletTheme
                                ? '!bg-violet-100 !text-violet-700 font-bold'
                                : '!bg-emerald-100 !text-emerald-700 font-bold'
                            : isVioletTheme
                              ? '!text-slate-500 hover:!bg-violet-50 hover:!text-violet-600'
                              : '!text-slate-500 hover:!bg-emerald-50 hover:!text-emerald-600',
                    ]"
                />
            </div>
        </template>
    </Toolbar>
</template>
