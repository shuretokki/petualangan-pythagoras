<script setup lang="ts">
const router = useRouter();
const form = reactive({
    text: "",
    pass: "",
    area: "",
    radio: 0,
    toggle: false,
});

const palette = [
    {
        label: "Emerald",
        hex: "#10b981",
        bg: "bg-emerald-500",
        text: "text-emerald-600",
    },
    {
        label: "Violet",
        hex: "#8b5cf6",
        bg: "bg-violet-500",
        text: "text-violet-600",
    },
    {
        label: "Amber",
        hex: "#f59e0b",
        bg: "bg-amber-500",
        text: "text-amber-600",
    },
    { label: "Rose", hex: "#f43f5e", bg: "bg-rose-500", text: "text-rose-600" },
    { label: "Zinc", hex: "#18181b", bg: "bg-zinc-900", text: "text-zinc-900" },
];
</script>

<template>
    <div
        class="fixed inset-0 bg-zinc-50 font-sans text-slate-900 flex justify-center overflow-hidden"
    >
        <div
            class="w-full max-w-md bg-[#FAFAFA] h-full shadow-2xl shadow-zinc-200/50 flex flex-col relative"
        >
            <header
                class="flex-none z-30 bg-white/90 backdrop-blur-md border-b border-zinc-100 px-5 h-14 flex items-center gap-4"
            >
                <button
                    @click="router.push({ name: 'home' })"
                    class="p-2 -ml-2 text-zinc-400 hover:text-zinc-900 rounded-full transition-colors"
                >
                    <i-lucide-arrow-left class="w-5 h-5" />
                </button>
                <div>
                    <h1
                        class="font-recoleta text-lg font-bold text-zinc-900 leading-none"
                    >
                        Design System
                    </h1>
                    <p
                        class="text-[10px] text-zinc-400 font-medium tracking-wide uppercase"
                    >
                        v1.0
                    </p>
                </div>
            </header>

            <div
                class="flex-1 overflow-y-auto overscroll-contain p-6 pb-safe space-y-12 no-scrollbar"
            >
                <section class="space-y-4">
                    <div
                        class="flex items-center gap-2 pb-2 border-b border-zinc-100"
                    >
                        <i-lucide-type class="w-3 h-3 text-zinc-400" />
                        <h2
                            class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest"
                        >
                            Typography
                        </h2>
                    </div>
                    <div class="space-y-4">
                        <div>
                            <p class="font-recoleta text-4xl text-zinc-900">
                                Display 4xl
                            </p>
                            <p class="text-[10px] text-zinc-400 font-mono mt-1">
                                Recolata / Bold / Zinc-900
                            </p>
                        </div>
                        <div>
                            <p class="font-recoleta text-2xl text-zinc-800">
                                Heading 2xl
                            </p>
                            <p class="text-[10px] text-zinc-400 font-mono mt-1">
                                Recolata / Bold / Zinc-800
                            </p>
                        </div>
                        <div>
                            <p class="text-sm text-zinc-600 leading-relaxed">
                                <span class="font-bold text-zinc-900"
                                    >Body Text (Inter):</span
                                >
                                Designed for maximum legibility on mobile
                                devices. Uses a relaxed line-height (1.6) and
                                softer contrast colors to reduce eye strain
                                during reading.
                            </p>
                        </div>
                    </div>
                </section>

                <section class="space-y-4">
                    <div
                        class="flex items-center gap-2 pb-2 border-b border-zinc-100"
                    >
                        <i-lucide-palette class="w-3 h-3 text-zinc-400" />
                        <h2
                            class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest"
                        >
                            Palette
                        </h2>
                    </div>
                    <div class="grid grid-cols-5 gap-3">
                        <div
                            v-for="c in palette"
                            :key="c.label"
                            class="flex flex-col items-center gap-2 group cursor-default"
                        >
                            <div
                                class="w-10 h-10 rounded-xl shadow-sm transition-transform group-hover:scale-110"
                                :class="c.bg"
                            ></div>
                            <div class="text-center">
                                <p
                                    class="text-[9px] font-bold uppercase text-zinc-500"
                                >
                                    {{ c.label }}
                                </p>
                                <p class="text-[8px] font-mono text-zinc-300">
                                    {{ c.hex }}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="space-y-6">
                    <div
                        class="flex items-center gap-2 pb-2 border-b border-zinc-100"
                    >
                        <i-lucide-mouse-pointer-click
                            class="w-3 h-3 text-zinc-400"
                        />
                        <h2
                            class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest"
                        >
                            Interactive
                        </h2>
                    </div>

                    <div class="space-y-3">
                        <p
                            class="text-[10px] text-emerald-600 font-bold uppercase tracking-wider"
                        >
                            Emerald Theme
                        </p>
                        <div class="flex gap-2 flex-wrap">
                            <Button
                                label="Primary"
                                class="!bg-emerald-500 !border-emerald-500 !rounded-xl !text-sm !px-5 !py-2.5 !font-bold !shadow-sm"
                            />
                            <Button
                                label="Soft"
                                class="!bg-emerald-50 !text-emerald-600 !border-emerald-50 !rounded-xl !text-sm !px-5 !py-2.5 !font-bold hover:!bg-emerald-100"
                            />
                            <Button
                                icon="pi pi-check"
                                class="!bg-emerald-500 !border-emerald-500 !rounded-full !w-10 !h-10 !p-0"
                            />
                        </div>
                    </div>

                    <div class="space-y-3">
                        <p
                            class="text-[10px] text-violet-600 font-bold uppercase tracking-wider"
                        >
                            Violet Theme
                        </p>
                        <div class="flex gap-2 flex-wrap">
                            <Button
                                label="Action"
                                class="!bg-violet-500 !border-violet-500 !rounded-xl !text-sm !px-5 !py-2.5 !font-bold !shadow-sm"
                            />
                            <Button
                                label="Outline"
                                variant="outlined"
                                class="!text-violet-600 !border-violet-200 !rounded-xl !text-sm !px-5 !py-2.5 !font-bold hover:!bg-violet-50"
                            />
                            <Button
                                label="Loading"
                                loading
                                class="!bg-violet-500 !border-violet-500 !rounded-xl !text-sm !px-5 !py-2.5"
                            />
                        </div>
                    </div>

                    <div class="space-y-3">
                        <p
                            class="text-[10px] text-zinc-400 font-bold uppercase tracking-wider"
                        >
                            System & Utility
                        </p>
                        <div class="flex gap-2 flex-wrap">
                            <Button
                                label="Destructive"
                                class="!bg-white !text-rose-500 !border-rose-100 !rounded-xl !text-sm !px-5 !py-2.5 !font-bold hover:!bg-rose-50 !shadow-sm"
                            />
                            <Button
                                label="Disabled"
                                disabled
                                class="!bg-zinc-100 !text-zinc-400 !border-zinc-100 !rounded-xl !text-sm !px-5 !py-2.5 !font-bold"
                            />
                            <Button
                                label="Ghost Link"
                                variant="text"
                                class="!text-zinc-500 hover:!bg-zinc-100 !rounded-xl !text-sm !px-4"
                            />
                        </div>
                    </div>
                </section>

                <section class="space-y-4">
                    <div
                        class="flex items-center gap-2 pb-2 border-b border-zinc-100"
                    >
                        <i-lucide-text-cursor-input
                            class="w-3 h-3 text-zinc-400"
                        />
                        <h2
                            class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest"
                        >
                            Data Entry
                        </h2>
                    </div>

                    <div class="grid gap-5">
                        <div class="space-y-1.5 group">
                            <label
                                class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider pl-1 group-focus-within:text-violet-500 transition-colors"
                                >Username</label
                            >
                            <InputText
                                v-model="form.text"
                                placeholder="Type something..."
                                class="w-full !bg-white !border-zinc-200 !rounded-xl !text-sm !p-3.5 focus:!border-violet-500 focus:!ring-1 focus:!ring-violet-200 !shadow-sm transition-all"
                            />
                        </div>

                        <div class="space-y-1.5 group">
                            <label
                                class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider pl-1 group-focus-within:text-violet-500 transition-colors"
                                >Secure Pass</label
                            >
                            <Password
                                v-model="form.pass"
                                :feedback="false"
                                toggleMask
                                placeholder="••••••••"
                                inputClass="w-full !pl-4 !bg-zinc-50 !border-zinc-200 !rounded-xl !text-sm !p-3.5 focus:!bg-white focus:!border-violet-500 focus:!ring-1 focus:!ring-violet-200 !shadow-inner transition-all"
                                class="w-full"
                            />
                        </div>

                        <div class="space-y-2">
                            <label
                                class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider pl-1"
                                >Preferences</label
                            >
                            <div class="flex flex-col gap-2">
                                <div
                                    v-for="i in 2"
                                    :key="i"
                                    @click="form.radio = i"
                                    class="flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer"
                                    :class="
                                        form.radio === i
                                            ? 'bg-violet-50 border-violet-500 ring-1 ring-violet-200'
                                            : 'bg-white border-zinc-200 hover:border-zinc-300'
                                    "
                                >
                                    <div
                                        class="w-4 h-4 rounded-full border flex items-center justify-center"
                                        :class="
                                            form.radio === i
                                                ? 'border-violet-500 bg-violet-500'
                                                : 'border-zinc-300'
                                        "
                                    >
                                        <div
                                            class="w-1.5 h-1.5 bg-white rounded-full"
                                            v-if="form.radio === i"
                                        ></div>
                                    </div>
                                    <span
                                        class="text-sm font-medium"
                                        :class="
                                            form.radio === i
                                                ? 'text-violet-700'
                                                : 'text-zinc-600'
                                        "
                                        >Option {{ i }}</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="space-y-4">
                    <div
                        class="flex items-center gap-2 pb-2 border-b border-zinc-100"
                    >
                        <i-lucide-layout-template
                            class="w-3 h-3 text-zinc-400"
                        />
                        <h2
                            class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest"
                        >
                            Components
                        </h2>
                    </div>

                    <div class="flex gap-2 flex-wrap">
                        <span
                            class="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1"
                        >
                            <i-lucide-check-circle class="w-3 h-3" /> SUCCESS
                        </span>
                        <span
                            class="bg-amber-50 text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded-md border border-amber-200 flex items-center gap-1"
                        >
                            <i-lucide-alert-triangle class="w-3 h-3" /> WARNING
                        </span>
                        <span
                            class="bg-rose-50 text-rose-700 text-[10px] font-bold px-2.5 py-1 rounded-md border border-rose-200 flex items-center gap-1"
                        >
                            <i-lucide-x-circle class="w-3 h-3" /> ERROR
                        </span>
                    </div>

                    <div
                        class="bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm"
                    >
                        <div
                            class="flex justify-between text-[10px] font-bold text-zinc-400 uppercase mb-2"
                        >
                            <span>Loading Assets</span>
                            <span class="text-violet-600">75%</span>
                        </div>
                        <div
                            class="w-full h-2 bg-zinc-100 rounded-full overflow-hidden"
                        >
                            <div
                                class="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 w-3/4 rounded-full"
                            ></div>
                        </div>
                    </div>

                    <div
                        class="bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm flex gap-4 items-start"
                    >
                        <div
                            class="w-12 h-12 shrink-0 bg-gradient-to-br from-emerald-100 to-teal-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl border border-emerald-100"
                        >
                            <i-lucide-book-open />
                        </div>
                        <div>
                            <h4
                                class="font-recoleta text-lg font-bold text-zinc-800"
                            >
                                Topic Card
                            </h4>
                            <p
                                class="text-xs text-zinc-500 mt-1 leading-relaxed"
                            >
                                A generic content container with iconic
                                representation and descriptive text.
                            </p>
                        </div>
                    </div>
                </section>

                <section class="space-y-4 pb-8">
                    <div
                        class="flex items-center gap-2 pb-2 border-b border-zinc-100"
                    >
                        <i-lucide-smile class="w-3 h-3 text-zinc-400" />
                        <h2
                            class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest"
                        >
                            Mascot Integration
                        </h2>
                    </div>
                    <div class="flex flex-col gap-4">
                        <PytaSpeech
                            text="Halo! Aku Pyta varian Emerald untuk materi."
                            variant="emerald"
                        />
                        <PytaSpeech
                            text="Aku varian Violet untuk kuis!"
                            variant="violet"
                        />
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pb-safe {
    padding-bottom: env(safe-area-inset-bottom, 20px);
}

/* Scrollbar Hiding */
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
