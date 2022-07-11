declare namespace system {
    type systemMenuOption = {
        key: string;
        label: string;
        icon?: () => import("vue").VNodeChild;
        disabled?: boolean;
        children?: systemMenuOption;
    };
}
