<template>
    <n-button
        type="primary"
        :class="[
            'setting_drawer_button',
            app.settingDrawerVisible
                ? 'setting_drawer_button_show'
                : 'setting_drawer_button_hidden',
        ]"
        @click="app.toggleSettingDrawerVisible"
    >
        <n-icon size="18">
            <close-outlined v-if="app.settingDrawerVisible" />
            <setting-twotone v-else />
        </n-icon>
    </n-button>
</template>
<script setup lang="ts">
import { SettingTwotone, CloseOutlined } from "@vicons/antd";
import { useAppStore } from "@/store";
const app = useAppStore();
</script>
<style lang="scss" scoped>
.setting_drawer_button {
    position: absolute;
    top: 50%;
    transition: all 300ms;
    z-index: 10000;
}
.setting_drawer_button_show {
    right: 300px;
}
.setting_drawer_button_hidden {
    right: 0px;
}
</style>
