import { defineStore } from "pinia";
import { getToken, setToken } from "@/utils/auth/index";
import { loginRequest } from "@/api/login";
import { MD5Encrypt } from "@/utils/login";
import { router } from "@/router/index";

interface AuthState {
    // userInfo?: Auth.UserInfo,
    token: string | undefined;
}
export const useAuthStore = defineStore("auth-store", {
    state: (): AuthState => ({
        token: getToken(),
    }),
    actions: {
        async login(userName: string, passWord: string) {
            const loginData: login.loginRequestType = {
                userName,
                passWord: MD5Encrypt(passWord),
            };
            let { token } = await loginRequest(loginData);
            if (token) {
                setToken({ token });
                router.push({ name: "home" });
            }
        },
    },
});
