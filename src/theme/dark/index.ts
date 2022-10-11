import type { GlobalThemeOverrides } from "naive-ui";
import './css/index.scss';
export function darkTheme () {
    let themeOverrides: GlobalThemeOverrides = {
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
    return themeOverrides
}