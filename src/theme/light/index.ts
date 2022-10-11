import type { GlobalThemeOverrides } from "naive-ui";
import './css/index.scss';
export function lightTheme () {
    return {
        common: {
            primaryColor: "#00828D",
            primaryColorHover: "#00828D",
            primaryColorPressed: "#002371",
            primaryColorSuppl: "#002371",
            tableColorHover: '#00828D1A',
        },
        Table: {
    
        },
        Menu: {
            borderColorHorizontal: '#FCE051',
        }
    }
}