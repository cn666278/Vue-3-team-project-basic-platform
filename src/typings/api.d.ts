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
    interface loginRequestType {
        userName: string;
        passWord: string;
    }
    interface loginResponseType extends defaultType.responseDefaultType {
        Data: {
            token: string,
        },
    }
}
