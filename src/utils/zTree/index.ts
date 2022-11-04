import { getToken } from "@/utils/auth";
import '@ztree/ztree_v3/js/jquery-1.4.4.min.js';
import '@ztree/ztree_v3/js/jquery.ztree.core.min.js';
import '@ztree/ztree_v3/js/jquery.ztree.excheck.min.js';
import '@ztree/ztree_v3/js/jquery.ztree.exedit.min.js';
import '@ztree/ztree_v3/js/jquery.ztree.exhide';
// import '@ztree/ztree_v3/css/metroStyle/metroStyle.css'
import '@ztree/ztree_v3/css/zTreeStyle/zTreeStyle.css';
import "jquery";

export interface zTreeSetting {
    url: string;
    api: string;
    field?: {
        key?: string;
        parentKey?: string;
        name?: string;
        title?: string;
        children?: string;
    };
    fontCss?: any;
    chkStyle?: "checkbox" | "radio";
    chkBoxType?: any;
    showIcon?: boolean;

    dataFilter: Function;
    render?: any;
    callBack?: any;
}
export const initZTree = (
    domId: string,
    setting: zTreeSetting,
    data?: any
) => {
    let tree: any = $.fn;
    const initSetting = {
        async: {
            url: import.meta.env.VITE_BASE_URL + setting.url,
            type: "post",
            enable: true,
            dataFilter: setting.dataFilter,
            otherParam: {
                action: setting.api,
                token: getToken(),
                data: JSON.stringify(data),
            },
        },
        data: {
            simpleData: {
                enable: true,
                idKey: setting.field?.key ? setting.field?.key : "id",
                pIdKey: setting.field?.parentKey
                    ? setting.field?.parentKey
                    : "pid",
                rootPId: null,
            },
            key: {
                name: setting.field?.name ? setting.field?.name : "name",
                title: setting.field?.title ? setting.field?.title : "eName",
                children: setting.field?.children
                    ? setting.field?.children
                    : "deviceList",
            },
            render: setting.render,
        },
        view: {
            showLine: true,
            showTitle: true,
            fontCss: setting.fontCss
                ? setting.fontCss
                : {
                    "font-size": "14px !important",
                    "height": "auto",
                    "padding": "2px 0",
                },
            showIcon: setting.showIcon == undefined ? true : setting.showIcon,
            expandSpeed: "fast",
            dblClickExpand: true,
            nameIsHTML: true,
        },
        check: {
            enable: setting.chkStyle ? true : false,
            autoCheckTrigger: false,
            chkStyle: setting.chkStyle,
            radioType: "all",
            chkboxType: setting.chkBoxType
                ? setting.chkBoxType
                : {
                      Y: "ps",
                      N: "ps",
                  },
        },
        callback: setting.callBack,
    };
    return tree.zTree.init($(`#${domId}`), initSetting, null) as any;
};
