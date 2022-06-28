<template>
    <n-loading-bar-provider>
        <n-dialog-provider>
            <n-notification-provider>
                <n-message-provider>
                    <diy-layout>
                        <suspense>
                            <slot></slot>
                        </suspense>
                    </diy-layout>
                </n-message-provider>
            </n-notification-provider>
        </n-dialog-provider>
    </n-loading-bar-provider>
</template>
<script setup lang="ts">
import DiyLayout from "@/components/Layout/index.vue";
</script>
<style lang="scss"></style>
