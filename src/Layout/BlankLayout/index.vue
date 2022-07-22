<script setup lang="ts">
import "animate.css";
</script>
<template>
    <router-view>
        <template #default="{ Component, route }">
            <transition
                enter-active-class="animate__animated animate__backInRight"
                leave-active-class="animate__animated animate__backOutLeft"
                mode="out-in"
                :duration="400"
                appear
            >
                <component :is="Component" :key="route.fullPath" />
            </transition>
        </template>
    </router-view>
</template>
