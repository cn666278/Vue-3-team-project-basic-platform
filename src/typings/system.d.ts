declare namespace system {
    interface systemMenuOption {
        key: string;
        label: string;
        icon?: () => import("vue").VNodeChild;
        disabled?: boolean;
        children?: systemMenuOption;
    }
    interface settingTheme {
        darkMode: boolean;
        layoutMode: "vertical" | "horizontal";
        sideInverted: boolean;
        headerInverted: boolean;
    }
}
