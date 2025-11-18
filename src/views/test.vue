<script setup lang="ts">
import { reactive } from "vue";

// --- CONFIGURATION ---
// SCALE: 50% of original size
// Triangles: 100px (w) x 50px (h)
// Dropzone Box: 150px x 150px (Located at Left:75, Top:30)

interface Triangle {
    id: number;
    color: string;
    targetLeft: number;
    targetTop: number;
    rotation: number;
    initialLeft: number;
    initialTop: number;
    currentLeft: number;
    currentTop: number;
    isLocked: boolean;
    isDragging: boolean;
}

// Calculated Offsets:
// Box starts at X:75, Y:30. Size is 150.
// T1 (Top-Left): 75, 30
// T2 (Top-Right): 75 + 150 = 225, 30
// T3 (Bottom-Right): 225, 30 + 150 = 180
// T4 (Bottom-Left): 75, 180

const triangles = reactive<Triangle[]>([
    {
        id: 1,
        color: "bg-rose-500",
        targetLeft: 75,
        targetTop: 30,
        rotation: 0,
        initialLeft: 20,
        initialTop: 280,
        currentLeft: 20,
        currentTop: 280,
        isLocked: false,
        isDragging: false,
    },
    {
        id: 2,
        color: "bg-blue-500",
        targetLeft: 225,
        targetTop: 30,
        rotation: 90,
        initialLeft: 80,
        initialTop: 280,
        currentLeft: 80,
        currentTop: 280,
        isLocked: false,
        isDragging: false,
    },
    {
        id: 3,
        color: "bg-emerald-500",
        targetLeft: 225,
        targetTop: 180,
        rotation: 180,
        initialLeft: 140,
        initialTop: 280,
        currentLeft: 140,
        currentTop: 280,
        isLocked: false,
        isDragging: false,
    },
    {
        id: 4,
        color: "bg-amber-500",
        targetLeft: 75,
        targetTop: 180,
        rotation: 270,
        initialLeft: 200,
        initialTop: 280,
        currentLeft: 200,
        currentTop: 280,
        isLocked: false,
        isDragging: false,
    },
]);

// --- DRAG LOGIC (Unchanged) ---
let draggedItem: Triangle | null = null;
let startMouseX = 0;
let startMouseY = 0;
let startElemX = 0;
let startElemY = 0;

const mouseDown = (e: MouseEvent, item: Triangle) => {
    if (item.isLocked) return;
    draggedItem = item;
    item.isDragging = true;
    startMouseX = e.clientX;
    startMouseY = e.clientY;
    startElemX = item.currentLeft;
    startElemY = item.currentTop;
    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);
};

const mouseMove = (e: MouseEvent) => {
    if (!draggedItem) return;
    draggedItem.currentLeft = startElemX + (e.clientX - startMouseX);
    draggedItem.currentTop = startElemY + (e.clientY - startMouseY);
};

const mouseUp = () => {
    if (draggedItem) {
        checkSnap(draggedItem);
        draggedItem.isDragging = false;
    }
    draggedItem = null;
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseup", mouseUp);
};

const checkSnap = (item: Triangle) => {
    const SNAP_THRESHOLD = 30; // Smaller threshold for smaller items
    const dist = Math.hypot(
        item.currentLeft - item.targetLeft,
        item.currentTop - item.targetTop,
    );

    if (dist < SNAP_THRESHOLD) {
        item.currentLeft = item.targetLeft;
        item.currentTop = item.targetTop;
        item.isLocked = true;
    } else {
        item.currentLeft = item.initialLeft;
        item.currentTop = item.initialTop;
    }
};
</script>

<template>
    <div
        class="bg-slate-100 min-h-screen flex flex-col justify-center items-center overflow-hidden font-sans"
    >
        <h1 class="mb-4 text-xl font-bold text-slate-700">Pythagorean Mini</h1>

        <div
            class="relative w-[300px] h-[400px] bg-white border rounded-lg shadow-xl overflow-hidden select-none"
        >
            <div
                class="absolute border border-dashed border-slate-300 bg-slate-50 rounded-sm"
                style="width: 150px; height: 150px; left: 75px; top: 30px"
            ></div>

            <div
                v-for="item in triangles"
                :key="'ghost-' + item.id"
                class="absolute w-[100px] h-[50px] bg-slate-200 pointer-events-none transition-colors duration-300"
                :class="{ 'bg-slate-300': item.isDragging }"
                :style="{
                    left: item.targetLeft + 'px',
                    top: item.targetTop + 'px',
                    transform: `rotate(${item.rotation}deg)`,
                    transformOrigin: 'top left',
                    clipPath: 'polygon(0 0, 100% 0, 0 100%)',
                }"
            ></div>

            <div
                v-for="item in triangles"
                :key="item.id"
                @mousedown="(e) => mouseDown(e, item)"
                class="absolute w-[100px] h-[50px] shadow-sm"
                :class="[
                    item.color,
                    item.isLocked
                        ? 'z-20 cursor-default opacity-100'
                        : 'z-50 cursor-grab active:cursor-grabbing opacity-90',
                    item.isDragging
                        ? 'transition-none ring-2 ring-black/10'
                        : 'transition-all duration-300 ease-out',
                ]"
                :style="{
                    left: item.currentLeft + 'px',
                    top: item.currentTop + 'px',
                    transform: `rotate(${item.rotation}deg)`,
                    transformOrigin: 'top left',
                    clipPath: 'polygon(0 0, 100% 0, 0 100%)',
                }"
            ></div>

            <div
                class="absolute bottom-6 w-full text-center text-slate-400 text-xs pointer-events-none px-4"
            >
                Arrange the pieces
            </div>
        </div>
    </div>
</template>
