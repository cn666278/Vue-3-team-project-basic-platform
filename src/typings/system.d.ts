declare namespace system {
    interface settingTheme {
        darkMode: boolean;
        layoutMode: "vertical" | "horizontal" | "mix";
        sideInverted: boolean;
        headerInverted: boolean;
        sideWidth: number;
        logoWidth: number;
    }
    interface webSocketConfig {
        webSocketURL: string;
        mapPointCD: number;
    }
}
