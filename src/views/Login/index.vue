<script setup lang="ts">
import login_bg from "@/assets/base/login-background2.png";
import logo from "@/assets/base/Yatinova-logo2.png";
import { useRoute } from 'vue-router';
import { useAuthStore } from "@/store/modules";
import { ref } from "vue";
let login_bg_theme = {
    backgroundImage: `url(${login_bg})`,
    backgroundSize: "100% 100%",
};
let userName = ref<string>("");
let passWord = ref<string>("");
const auth = useAuthStore();
const { login } = auth;
const onSubmit = () => {
    login(userName.value, passWord.value);
};
</script>
<template>
    <div class="login">
        <n-card
            class="login_form"
            content-style="width: 100%;padding: 30px 48px"
        >
            <template #header>
                <img :src="logo" class="logo" alt="logo" />
            </template>
            <n-grid :y-gap="24" :cols="1">
                <n-grid-item>
                    <n-input
                        v-model:value="userName"
                        type="text"
                        placeholder="用户名"
                        autofocus
                        @keyup.enter="onSubmit"
                        size="large"
                    ></n-input>
                </n-grid-item>
                <n-grid-item>
                    <n-input
                        v-model:value="passWord"
                        type="password"
                        placeholder="密码"
                        @keyup.enter="onSubmit"
                        size="large"
                    ></n-input>
                </n-grid-item>
                <n-grid-item>
                    <n-button @click="onSubmit" type="primary" block>
                        立即登录
                    </n-button>
                </n-grid-item>
            </n-grid>
        </n-card>
        <div class="login_bg" :style="login_bg_theme"></div>
    </div>
</template>
<style lang="scss" scoped>
.login {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    .login_form {
        width: 426px;
        margin: 0 auto;
        display: flex;
        align-items: inherit;
        justify-content: inherit;
        .logo {
            max-width: 200px;
            max-height: 30px;
            // margin: 60px auto;
        }
    }
    .login_bg {
        width: inherit;
        height: inherit;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        img {
            width: inherit;
            height: inherit;
        }
    }
}
</style>
