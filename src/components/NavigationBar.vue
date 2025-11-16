<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const navigateTo = (routeName: string) => {
  router.push({ name: routeName });
};

const isActive = (routeName: string) => {
  return route.name === routeName;
};
</script>

<template>
  <Toolbar 
    unstyled
    :pt="{
      root: 'flex flex-col items-center gap-1'
    }"
  >
    <template #start>
      <div class="flex items-center gap-3">
        <span class="text-3xl">🐍</span>
        <div>
          <h1 class="font-recoleta text-xl font-bold text-slate-900">
            Pythagoras
          </h1>
          <p class="text-xs text-slate-500 font-light">Petualangan Matematika</p>
        </div>
      </div>
    </template>

    <template #end>
      <div class="flex gap-2">
        <Button
          label="Home"
          text
          rounded
          @click="navigateTo('home')"
          :severity="isActive('home') ? 'primary' : 'secondary'"
        />
        <Button
          label="Materi"
          text
          rounded
          @click="navigateTo('materi')"
          :severity="isActive('materi') ? 'primary' : 'secondary'"
        />
        <Button
          label="Contoh Soal"
          text
          rounded
          @click="navigateTo('contoh-soal')"
          :severity="isActive('contoh-soal') ? 'primary' : 'secondary'"
        />
        <Button
          label="Kuis"
          text
          rounded
          @click="navigateTo('kuis')"
          :severity="isActive('kuis') ? 'primary' : 'secondary'"
        />
      </div>
    </template>
  </Toolbar>
</template>