import { useAuthStore } from "@/store";
import { getToken } from "@/utils/auth";
import { InjectionKey } from "vue";

let socket: WebSocket;
export default async (onMessage: Function) => {
    const authStore = useAuthStore();
    const SocketUrl = authStore.getSocketConfigData?.webSocketURL as string;
    let lockReconnect = false;
    let timer: ReturnType<typeof setTimeout>;
    /**创建socket */
    const createSocket = (url: string) => {
        try {
            socket = new WebSocket(url);
            init();
        } catch (err) {
            console.log("catch:" + err);
            reconnect();
        }
    };

    const reconnect = () => {
        if (lockReconnect) return;
        lockReconnect = true;
        clearTimeout(timer);
        timer = setTimeout(() => {
            createSocket(SocketUrl);
            lockReconnect = false;
        }, 4000);
    };

    const init = () => {
        /**连接成功 */
        socket.onopen = function () {
            console.log("WebSocket: 已连接");
            clearTimeout(timer);
            heartCheck.reset().start();
        };

        /**接收消息回调 */
        socket.onmessage = function (event) {
            // console.log("WebSocket: 收到一条消息", event.data);
            const isHeart = /pong/.test(event.data);
            if (onMessage && !isHeart) {
                // 触发自定义onMessage
                onMessage.call(null, event.data);
            }
            heartCheck.reset().start();
        };

        /**连接发生错误 */
        socket.onerror = function (event) {
            console.log("WebSocket: 发生错误");
            reconnect();
        };

        socket.onclose = function (event) {
            console.log("WebSocket: 已关闭");
            heartCheck.reset().start();
            reconnect();
        };

        /**监听窗口关闭事件 */
        window.onbeforeunload = function () {
            socket.close();
        };
    };
    var heartCheck = {
        timeout: 1000 * 30,
        timeoutObj: setTimeout(() => {}),
        serverTimeoutObj: setTimeout(() => {}),
        reset: function () {
            clearTimeout(this.timeoutObj);
            clearTimeout(this.serverTimeoutObj);
            return this;
        },
        start: function () {
            clearTimeout(this.timeoutObj);
            clearTimeout(this.serverTimeoutObj);
            this.timeoutObj = setTimeout(() => {
                //发送心跳
                socketSend("heartbeat", 99);
                this.serverTimeoutObj = setTimeout(() => {
                    console.log("关闭服务");
                    socket.close();
                }, this.timeout);
            }, this.timeout);
        },
    };
    authStore.getSocketConfig().then(() => {
        let url = authStore.getSocketConfigData?.webSocketURL as string;
        createSocket(url);
    });
};

/**
 * websocket发送订阅数据需求
 * @param {Array} dataList 要订阅的设备号数组
 * @param {number} type webSocket发送数据类型(99为心跳, 100为订阅位置)
 * @param {number} eCoordinateType 后台即将发送的坐标系枚举(WGS84 : 0,GCJ02 : 1,BD09 : 2)
 */
interface sendData {
    eCoordinateType: number;
    terminalNoList: string | string[];
}
export function socketSend(data: sendData | string, type: number) {
    try {
        let sendData = {
            type: type,
            token: getToken(),
            data:
                typeof data === "string"
                    ? data
                    : {
                          businessCode: "sys",
                          ...data,
                      },
        };
        if(socket) socket.send(JSON.stringify(sendData));
    } catch(err) {
        console.log(err);
    }
}

/**导出注入索引key */
export const onMessageListKey: InjectionKey<Function[]> = Symbol();