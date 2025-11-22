<script setup lang="ts">
const authStore = useAuthStore();
onMounted(() => {
    authStore.initAuth();
});

const route = useRoute();
const showNavigation = computed(() => route.name !== "admin");
</script>

<template>
    <div class="min-h-screen min-w-screen overflow-hidden">
        <main v-if="showNavigation">
            <router-view />
        </main>

        <div v-else class="min-h-screen min-w-screen">
            <router-view />
        </div>
    </div>
</template>
