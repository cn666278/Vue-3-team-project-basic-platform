<template>
    <n-loading-bar-provider>
        <n-dialog-provider>
            <n-notification-provider>
                <n-message-provider>
                    <GlobalAPIContent />
                    <slot></slot>
                </n-message-provider>
            </n-notification-provider>
        </n-dialog-provider>
    </n-loading-bar-provider>
</template>
<script setup lang="ts">
import GlobalAPIContent from './globalAPIContent.vue';
</script>
<style lang="scss"></style>
