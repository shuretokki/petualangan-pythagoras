<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const currentPage = ref(0);

const pages = [
    {
        title: "Selamat Datang!",
        subtitle: "Petualangan Matematika Dimulai",
        description:
            "Halo! Namaku Pyta. Aku akan menemanimu menjelajahi keajaiban di balik Teorema Pythagoras.",
        highlight: "Mari kita berpetualang bersama!",
    },
    {
        title: "Segitiga Siku-Siku",
        subtitle: "Tiga Sisi yang Istimewa",
        description:
            "Sebuah segitiga siku-siku memiliki tiga komponen penting yang saling terkait:",
        components: [
            {
                label: "Sisi Miring (c)",
                desc: "Sisi terpanjang, berhadapan dengan sudut siku-siku",
            },
            { label: "Tinggi (b)", desc: "Sisi vertikal yang tegak lurus" },
            { label: "Alas (a)", desc: "Sisi horizontal sebagai dasar" },
        ],
    },
    {
        title: "Mari Mulai!",
        subtitle: "Waktunya Menjelajah",
        description:
            "Kamu sudah siap untuk memahami rahasia matematika yang telah menakjubkan dunia selama ribuan tahun.",
        highlight: "Mari temukan keajaiban Teorema Pythagoras!",
    },
];

const currentPageData = computed(() => pages[currentPage.value]);

const nextPage = () => {
    if (currentPage.value < pages.length - 1) {
        currentPage.value++;
    } else {
        router.push({ name: "materi" });
    }
};

const previousPage = () => {
    if (currentPage.value > 0) {
        currentPage.value--;
    }
};
</script>

<template>
    <div class="flex flex-col items-center justify-center">
        <div
            class="min-h-100dvh sm:min-h-[calc(100vh-10rem)] lg:min-h-[calc(100vh-12rem)] flex flex-col justify- max-w-sm"
        >
            <!-- Main Content Area -->
            <div
                class="flex-1 flex flex-col justify-center items-center mb-16 mt-4"
            >
                <!-- Page 0: Welcome -->
                <div v-if="currentPage === 0" class="text-center space-y-8">
                    <!-- Mascot -->
                    <div
                        class="inline-block mb-6"
                        v-motion
                        :initial="{ opacity: 0, y: 30 }"
                        :enter="{
                            opacity: 1,
                            y: 0,
                            transition: { duration: 300, delay: 200 },
                        }"
                    >
                        <div class="text-9xl filter drop-shadow-lg">🐍</div>
                    </div>

                    <!-- Title -->
                    <div
                        v-motion
                        :initial="{ opacity: 0, y: 30 }"
                        :enter="{
                            opacity: 1,
                            y: 0,
                            transition: { duration: 400, delay: 200 },
                        }"
                    >
                        <h1
                            class="font-recoleta text-6xl font-bold text-zinc-900 mb-2 leading-14"
                    >
                        {{ currentPageData?.title }}
                    </h1>
                    <p class="text-xl text-zinc-600 font-light"
                    >
                        {{ currentPageData?.subtitle }}
                        </p>
                    </div>

                    <!-- Description -->
                    <div class="container mx-auto"
                        v-motion
                        :initial="{ opacity: 0, y: 30 }"
                        :enter="{
                            opacity: 1,
                            y: 0,
                            transition: { duration: 500, delay: 200 },}"
                        >
                        <p class="text-lg text-zinc-700 leading-relaxed mb-8">
                            {{ currentPageData?.description }}
                        </p>
                        <p class="text-xl font-medium text-emerald-600">
                            {{ currentPageData?.highlight }}
                        </p>
                    </div>
                </div>

                <!-- Page 1: Triangle Components -->
                <div v-if="currentPage === 1">
                    <!-- Title Section -->
                    <div class="text-center space-y-3">
                        <h1
                            class="font-recoleta text-5xl font-bold text-zinc-900"
                        >
                            {{ currentPageData?.title }}
                        </h1>
                        <p class="text-xl text-zinc-600 font-light">
                            {{ currentPageData?.subtitle }}
                        </p>
                    </div>

                    <div class="flex flex-col gap-6 items-center mb-6">
                        <!-- Triangle Illustration -->
                        <div
                            v-motion
                            :initial="{ opacity: 0, x: -50 }"
                            :enter="{
                                opacity: 1,
                                x: 0,
                                transition: { duration: 800, delay: 200 },
                            }"
                        >
                            <div class="p-12">
                                <svg
                                    viewBox="0 0 300 250"
                                    class="w-full h-auto"
                                >
                                    <!-- Right Triangle -->
                                    <defs>
                                        <linearGradient
                                            id="triangleGradient"
                                            x1="0%"
                                            y1="0%"
                                            x2="100%"
                                            y2="100%"
                                        >
                                            <stop
                                                offset="0%"
                                                style="
                                                    stop-color: #50c878;
                                                    stop-opacity: 0.3;
                                                "
                                            />
                                            <stop
                                                offset="100%"
                                                style="
                                                    stop-color: #34d399;
                                                    stop-opacity: 0.2;
                                                "
                                            />
                                        </linearGradient>
                                    </defs>
                                    <polygon
                                        points="50,200 50,50 250,200"
                                        fill="url(#triangleGradient)"
                                        stroke="#34d399"
                                        stroke-width="3"
                                    />

                                    <!-- Labels with elegant styling -->
                                    <text
                                        x="150"
                                        y="225"
                                        text-anchor="middle"
                                        class="fill-black font-medium text-sm"
                                    >
                                        a (alas)
                                    </text>
                                    <text
                                        x="25"
                                        y="130"
                                        text-anchor="middle"
                                        class="fill-black font-medium text-sm"
                                        transform="rotate(-90 25 130)"
                                    >
                                        b (tinggi)
                                    </text>
                                    <text
                                        x="160"
                                        y="110"
                                        text-anchor="middle"
                                        class="fill-black font-semibold text-sm"
                                        transform="rotate(40 160 110)"
                                    >
                                        c (miring)
                                    </text>

                                    <!-- Right angle indicator -->
                                    <rect
                                        x="50"
                                        y="180"
                                        width="20"
                                        height="20"
                                        fill="none"
                                        stroke="#34d399"
                                        stroke-width="2"
                                    />
                                </svg>
                            </div>
                        </div>

                        <!-- Components List -->
                        <div
                            class="flex flex-col gap-6"
                            v-motion
                            :initial="{ opacity: 0, x: 50 }"
                            :enter="{
                                opacity: 1,
                                x: 0,
                                transition: { duration: 800, delay: 200 },
                            }"
                        >
                            <p class="text-sm text-zinc-700 mb-2">
                                {{ currentPageData?.description }}
                            </p>

                            <div class="flex flex-col gap-2">
                                <div
                                    v-for="(
                                        component, index
                                    ) in currentPageData?.components"
                                    :key="index"
                                    class="transition-all duration-300"
                                >
                                    <h3
                                        class="w-full font-recoleta text-xl font-semibold text-zinc-900"
                                    >
                                        {{ component.label }}
                                    </h3>
                                    <p
                                        class="w-full text-sm text-zinc-600 leading-relaxed"
                                    >
                                        {{ component.desc }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Page 2: Let's Start -->
                <div v-if="currentPage === 2" class="text-center space-y-12">
                    <!-- Icon -->
                    <div
                        v-motion
                        :initial="{ scale: 0, rotate: 45 }"
                        :enter="{
                            scale: 1,
                            rotate: 0,
                            transition: { duration: 800, delay: 200 },
                        }"
                        class="inline-block"
                    >
                        <div
                            class="w-32 h-32 mx-auto bg-gradient-to-br from-gray-50 to-emerald-200 border border-zinc-100 text-black rounded-4xl flex items-center justify-center text-6xl shadow-2xl shadow-emerald-300/50 transform rotate-6"
                        >
                            ✨
                        </div>
                    </div>

                    <!-- Title -->
                    <div
                        v-motion
                        :initial="{ opacity: 0, y: 30 }"
                        :enter="{
                            opacity: 1,
                            y: 0,
                            transition: { duration: 600, delay: 200 },
                        }"
                    >
                        <h1
                            class="font-recoleta text-6xl font-bold text-zinc-900 mb-2"
                        >
                            {{ currentPageData?.title }}
                        </h1>
                        <p class="text-xl text-zinc-600 font-light">
                            {{ currentPageData?.subtitle }}
                        </p>
                    </div>

                    <!-- Description -->
                    <div
                        v-motion
                        :initial="{ opacity: 0, y: 20 }"
                        :enter="{
                            opacity: 1,
                            y: 0,
                            transition: { duration: 600, delay: 600 },
                        }"
                        class="flex flex-col max-w-2xl mx-auto"
                    >
                        <p class="text-lg text-zinc-700 leading-relaxed mb-8">
                            {{ currentPageData?.description }}
                        </p>
                        <div
                            class="inline-block bg-gradient-to-r from-emerald-50 to-purple-50 rounded-full border border-emerald-200"
                        >
                            <p
                                class="text-xl font-recoleta font-semibold text-emerald-600"
                            >
                                {{ currentPageData?.highlight }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="fixed bg-gray-50 bottom-0 left-0 overflow-hidden max-w-sm h-16 inset-x-0 mx-auto z-50 flex items-center justify-between"
                v-motion
                :initial="{ opacity: 0, y: 30 }"
                :enter="{
                    opacity: 1,
                    y: 0,
                    transition: { duration: 600, delay: 800 },
                }"
            >
                <!-- Previous Button -->
                <Button
                    v-if="currentPage > 0"
                    @click="previousPage"
                    variant="text"
                    class="group flex items-center gap-2 px-6 py-3 rounded-full bg-white border-2 border-zinc-200 text-zinc-700 font-medium transition-all duration-300"
                >
                    <svg
                        class="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 19l-7-7 7-7"
                        ></path>
                    </svg>
                    Kembali
                </Button>
                <div v-else class="w-32"></div>

                <div class="flex gap-3">
                    <button
                        v-for="(_page, index) in pages"
                        :key="index"
                        @click="currentPage = index"
                        class="transition-all duration-300 rounded-full"
                        :class="
                            currentPage === index
                                ? 'w-12 h-3 bg-emerald-500'
                                : 'w-3 h-3 bg-emerald-300 hover:bg-emerald-200'
                        "
                    ></button>
                </div>

                <Button
                    @click="nextPage"
                    class="group flex items-center gap-2 px-6 py-3 rounded-full bg-white border-2 border-zinc-200 text-zinc-700 font-medium transition-all duration-300"
                    variant="text"
                >
                    {{
                        currentPage === pages.length - 1
                            ? "Mulai Belajar"
                            : "Lanjut"
                    }}
                    <svg
                        class="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 5l7 7-7 7"
                        ></path>
                    </svg>
                </Button>
            </div>
        </div>
    </div>
</template>
