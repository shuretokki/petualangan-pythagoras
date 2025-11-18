<script setup lang="ts">
import { ref } from "vue";

const rec = ref(
    Array.from({ length: 4 }, (_, i) => ({
        id: i,
        isDragged: false,
    })),
);

const dropzoneHighlight = ref(false);
const dropzoneOver = ref(false);
const index = ref(0);

const dragStart = (_: DragEvent, id: number) => {
    console.log("item", id);
    index.value = id;
    rec.value.forEach((r) => (r.isDragged = false));

    rec.value[id]!.isDragged = true;
    console.log("isDragged", rec.value[id]);
};

const drag = () => {
    dropzoneHighlight.value = true;
};

const dragOver = () => {
    dropzoneOver.value = true;
};

const dragLeave = () => {
    dropzoneOver.value = false;
};

const dragEnd = () => {
    rec.value.forEach((r) => (r.isDragged = false));
    dropzoneHighlight.value = false;
};

const drop = () => {
    dropzoneHighlight.value = false;
    dropzoneOver.value = false;

    rec.value = rec.value.filter((r) => r.id !== index.value);
};
</script>

<template>
    <div class="bg-red-50 min-w-screen text-xl text-black">
        <div
            :class="{
                'border bg-blue-500': dropzoneHighlight && !dropzoneOver,
                'bg-red-500': dropzoneOver,
            }"
            @dragover.prevent="dragOver"
            @dragleave="dragLeave"
            @drop.prevent="drop"
        >
            dropzone
        </div>
        <div class="flex gap-4 justify-center items-center px-24 py-6">
            <div v-for="r in rec" :key="r.id" class="w-21">
                <div
                    class="h-21 bg-black"
                    :class="{
                        'bg-blue-500': r.isDragged,
                    }"
                    draggable="true"
                    @dragstart="dragStart($event, r.id)"
                    @drag="drag"
                    @dragend="dragEnd"
                ></div>
            </div>
        </div>
    </div>
</template>
