declare namespace defaultType {
    interface requestDefaultType {
        targetAPI: string;
        token?: string;
        data?: object | string;
    }
    interface responseDefaultType {
        State: number;
        Message: string;
        HasData: boolean;
        Data: Object;
    }
}
declare namespace login {
    import type { Ref } from "vue";
    interface loginRequestType extends ref {
        userName: string | Ref<string>;
        passWord: string | Ref<string>;
    }
    interface loginResponseType extends defaultType.responseDefaultType {
        Data: Auth.Token,
    }
}
