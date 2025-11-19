<script setup lang="ts">
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import PytaSpeech from "@/components/PytaSpeech.vue";
</script>

<template>
    <div class="min-h-screen bg-[#FAFAFA] p-8 md:p-20">
        <div class="max-w-2xl mx-auto space-y-16">
            <div class="text-center">
                <h1 class="font-recoleta text-5xl font-bold text-zinc-900 mb-4">
                    Component Lab
                </h1>
                <p class="text-zinc-500">
                    Testing styles, typography, and components.
                </p>
            </div>

            <section class="space-y-4">
                <h2
                    class="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-200 pb-2"
                >
                    Typography
                </h2>
                <div class="space-y-2">
                    <p class="font-recoleta text-4xl text-zinc-900">
                        Recoleta Display - 4xl
                    </p>
                    <p class="font-recoleta text-2xl text-zinc-800">
                        Recoleta Heading - 2xl
                    </p>
                    <p class="text-base text-zinc-600 leading-relaxed">
                        Inter (Default Sans) - This is the body text used for
                        explanations, quiz questions, and general content. It
                        should be legible and clean.
                    </p>
                </div>
            </section>

            <section class="space-y-4">
                <h2
                    class="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-200 pb-2"
                >
                    Buttons
                </h2>

                <div class="space-y-2">
                    <p class="text-xs text-emerald-600 font-bold">
                        Green Theme (Home/Materi)
                    </p>
                    <div class="flex gap-3 flex-wrap">
                        <Button
                            label="Primary Action"
                            class="!bg-emerald-500 !border-emerald-500 !rounded-full"
                        />
                        <Button
                            label="Text Button"
                            variant="text"
                            class="!text-emerald-600 hover:!bg-emerald-50 !font-bold !rounded-full"
                        />
                    </div>
                </div>

                <div class="space-y-2">
                    <p class="text-xs text-violet-600 font-bold">
                        Violet Theme (Quiz/Contoh)
                    </p>
                    <div class="flex gap-3 flex-wrap">
                        <Button
                            label="Selected Option"
                            class="!bg-violet-500 !border-violet-500 !rounded-xl"
                        />
                        <Button
                            label="Navigation (Black)"
                            variant="text"
                            class="!text-zinc-900 hover:!bg-zinc-50 !font-bold !rounded-full"
                        />
                    </div>
                </div>
            </section>

            <section class="space-y-4">
                <h2
                    class="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-200 pb-2"
                >
                    Inputs (Admin)
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputText
                        placeholder="Standard Input"
                        class="w-full !bg-white !border-zinc-200 !rounded-xl"
                    />
                    <InputText
                        placeholder="Filled Input"
                        class="w-full !bg-zinc-50 !border-zinc-200 !rounded-xl"
                    />
                </div>
            </section>

            <section class="space-y-4">
                <h2
                    class="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-200 pb-2"
                >
                    Pyta Speech
                </h2>
                <div class="flex flex-col gap-4">
                    <PytaSpeech
                        text="Halo! Aku Pyta varian Emerald untuk materi belajar."
                        variant="emerald"
                    />
                    <PytaSpeech
                        text="Dan aku Pyta varian Violet untuk soal dan kuis!"
                        variant="violet"
                    />
                </div>
            </section>
        </div>
    </div>
</template>
