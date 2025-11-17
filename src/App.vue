<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed } from "vue";
import NavigationBar from "@/components/NavigationBar.vue";

const route = useRoute();
const showNavigation = computed(() => route.name !== "admin");
</script>

<template>
    <div class="min-h-100dvh min-w-screen overflow-hidden">
        <NavigationBar v-if="showNavigation" />

        <main v-if="showNavigation">
            <router-view />
        </main>

        <div v-else class="min-h-screen min-w-screen">
            <router-view />
        </div>
    </div>
</template>
