declare namespace defaultType {
    interface requestDefaultType {
        targetAPI: string;
        token?: string;
        data?: object | string;
    }
    
    interface responseDefaultType<T = any> {
        State: number;
        Message: string;
        HasData: boolean;
        Data: T;
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
