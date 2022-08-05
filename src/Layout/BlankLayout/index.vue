<script setup lang="ts">
import "animate.css";
</script>
<template>
    <router-view>
        <template #default="{ Component, route }">
            <transition
                enter-active-class="animate__animated animate__fadeInRight"
                leave-active-class="animate__animated animate__fadeOutLeft"
                mode="out-in"
                :duration="400"
                appear
            >
                <!-- <keep-alive> -->
                    <component :is="Component" :key="route.fullPath" />
                <!-- </keep-alive> -->
            </transition>
        </template>
    </router-view>
</template>
