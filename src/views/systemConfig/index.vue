<template>
    <div class="systemConfig">
        <ConfigTemplate
            :config-type="systemConfig"
            :data="configData"
            @on-submit="setConfig"
        ></ConfigTemplate>
    </div>
</template>
<script setup lang="ts">
import ConfigTemplate from "@/components/ConfigTemplate/index.vue";
import type { configType } from "@/components/ConfigTemplate/index";
import { getSysConfig, setSysConfig } from "@/api/config";
import { formatDateTime } from "@/utils/common";
let systemConfig: configType[] = [
    {
        title: "系统配置",
        param: [
            {
                label: "接口地址",
                type: "string",
                paramName: "apiSite",
                span: 1,
            },
            {
                label: "Socket地址",
                type: "string",
                paramName: "socketUrl",
                span: 1,
            },
            {
                label: "首页地址",
                type: "string",
                paramName: "indexURL",
                span: 1,
            },
            {
                label: "地图定位刷新时间",
                type: "number",
                paramName: "mapPointCD",
                span: 1,
            },
            {
                label: "登录超时时间(分钟)",
                type: "number",
                paramName: "tokenCD",
                span: 1,
            },
            {
                label: "是否业务登录",
                type: "boolean",
                paramName: "isBusinessLogin",
                span: 1,
            },
            {
                label: "文件上传保存路径",
                type: "string",
                paramName: "filePath",
                span: 1,
            },
            {
                label: "平台名称",
                type: "string",
                paramName: "title",
                span: 1,
            },
            {
                label: "业务参数A",
                type: "string",
                paramName: "paramA",
                span: 3,
                rows: 2,
            },
            {
                label: "业务参数B",
                type: "string",
                paramName: "paramB",
                span: 3,
                rows: 2,
            },
            {
                label: "业务参数C",
                type: "string",
                paramName: "paramC",
                span: 3,
                rows: 2,
            },
        ],
    },
];
const configData = (await getSysConfig()).Data;
const setConfig = (data: config.sysConfig) => {
    data.updateDate = formatDateTime(new Date());
    setSysConfig(data).then(res => {
        getSysConfig();
    });
};
</script>
<style lang="scss" scoped>
    .systemConfig {
        background-color: #fff;
        padding: 10px;
    }
</style>
