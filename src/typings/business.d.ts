declare namespace Auth {
    interface Token {
        token: string | undefined;
    }
    /**用户信息 */
    interface UserInfo {
        account: string;
        nick: string;
        phone: string;
        roleIdList?: any[];
    }
}
