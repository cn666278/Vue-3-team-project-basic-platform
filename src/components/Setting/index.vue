<template>
    <div class="setting_control">
        <div class="setting_avatar">
            <n-avatar round size="medium">Admin</n-avatar>
        </div>
        <n-dropdown trigger="hover" :options="options" @select="handleSelect">
            <h4>超级管理员</h4>
        </n-dropdown>
    </div>
</template>
<script setup lang="ts">
import { useAuthStore } from "@/store";
import type { DropdownOption } from "naive-ui";
const { logout } = useAuthStore();
const options: DropdownOption[] = [
    {
        key: "clearCache",
        label: "清除缓存",
    },
    {
        type: "divider",
        key: "d1",
    },
    {
        key: "Login",
        label: "退出登录",
    },
];
const handleSelect = (key: string | number, option: DropdownOption) => {
    switch (key) {
        case "Login":
            logout();
            break;
        default:
            break;
    }
};
</script>
<style lang="scss" scoped>
.setting_control {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .setting_avatar {
        display: inherit;
        padding: 0 5px;
    }
    h4 {
        cursor: pointer;
    }
}
</style>
