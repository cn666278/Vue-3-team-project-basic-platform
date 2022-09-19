import { defineStore } from "pinia";
import { getToken, setToken, removeToken } from "@/utils/auth/index";
import { loginRequest, useInfoRequest, getConfig } from "@/api/login";
import { MD5Encrypt } from "@/utils/login";

interface AuthState {
    userInfo?: Auth.UserInfo;
    token: Auth.Token;
    socketConfig?: system.webSocketConfig;
}
export const useAuthStore = defineStore("auth-store", {
    state: (): AuthState => ({
        token: getToken(),
        userInfo: undefined,
        socketConfig: undefined,
    }),
    getters: {
        getSocketConfigData: (state) => {
            return state.socketConfig;
        },
    },
    actions: {
        /**登陆 */
        async login(userName: string, passWord: string) {
            const loginData: login.loginRequestType = {
                userName,
                passWord: MD5Encrypt(passWord),
            };
            let { Data } = await loginRequest(loginData);
            if (Data) {
                setToken(Data);
                this.token = Data;
                location.reload();
            }
        },
        /**登出 */
        async logout() {
            removeToken();
            location.reload();
        },
        /**获取用户信息 */
        async getUserSession() {
            const { Data } = await useInfoRequest();
            this.userInfo = Data;
        },
        /**获取socket配置信息 */
        async getSocketConfig() {
            const { Data } = await getConfig();
            this.socketConfig = Data;
        },
    },
});
