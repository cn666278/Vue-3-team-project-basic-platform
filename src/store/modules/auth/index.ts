import { defineStore } from "pinia";
import { getToken, setToken, removeToken } from "@/utils/auth/index";
import { loginRequest } from "@/api/login";
import { MD5Encrypt } from "@/utils/login";
import { router } from "@/router";

interface AuthState {
    // userInfo?: Auth.UserInfo,
    token: Auth.Token;
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
            // let { token } = await loginRequest(loginData);
            let { Data } = await loginRequest(loginData);
            if (Data) {
                setToken(Data);
                this.token = Data;
                location.reload();
            }
        },
        async logout() {
            const route = router.currentRoute.value;
            removeToken();
            location.reload();
        },
    },
});
