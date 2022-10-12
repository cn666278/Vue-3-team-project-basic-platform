import type { GlobalThemeOverrides } from "naive-ui";
import './css/index.scss';
export const lightTheme: GlobalThemeOverrides = {
    common: {
        primaryColor: "#00828D",
        primaryColorHover: "#00828D",
        primaryColorPressed: "#002371",
        primaryColorSuppl: "#002371",
        tableColorHover: '#00828D1A',
        cardColor: "#ffffff",
        bodyColor: "#ffffff",
    },
    Menu: {
        itemTextColorHorizontal: '#ffffff',
        itemTextColorHoverHorizontal: '#FCE051',
        itemTextColorActiveHorizontal: '#FCE051',
        itemTextColorActiveHoverHorizontal: '#FCE051',
        borderColorHorizontal: '#FCE051',
    }
}