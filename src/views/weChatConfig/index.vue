<template>
    <div class="systemConfig">
        <ConfigTemplate :config-type="systemConfig" :data="configData" @on-submit="setConfig"></ConfigTemplate>
    </div>
</template>
<script setup lang="ts">
import ConfigTemplate from '@/components/ConfigTemplate/index.vue';
import type { configType } from '@/components/ConfigTemplate/index';
import { getSysConfig, setSysConfig, getDeviceConfig, setDeviceConfig } from '@/api/config';
let systemConfig: configType[] = [
    {
        title: '公众号配置',
        param: [
            {
                label: '公众号appid',
                type: 'number',
                paramName: 'checkCD',
                span: 1,
            },
            {
                label: '公众号token',
                type: 'number',
                paramName: 'onlineCD',
                span: 2,
            },
            {
                label: '公众号开发者密码',
                type: 'string',
                paramName: 'locationMapfenceCode',
                span: 1,
                // rows: 2,
            },
            {
                label: '公众号消息体密钥',
                type: 'number',
                paramName: 'speed',
                span: 2,
            },
            {
                label: '授权后重定向地址',
                type: 'number',
                paramName: 'speed',
                span: 1,
            },
        ],
    },
    {
        title: '支付配置',
        param: [
            {
                label: '商户id',
                type: 'string',
                paramName: 'ftpServerIp',
                span: 1,
            },
            {
                label: '商户APIv3密钥',
                type: 'number',
                paramName: 'ftpPort',
                span: 2,
            },
            {
                label: '商户API证书序列号',
                type: 'string',
                paramName: 'ftpUser',
                span: 1,
            },
            {
                label: '商户API证书序绝对路径',
                type: 'string',
                paramName: 'ftpPassWord',
                span: 2,
            },
            {
                label: '支付通知地址',
                type: 'string',
                paramName: 'ftpPath',
                span: 1,
            },
        ],
    },
];
const configData = (await getDeviceConfig()).Data;
const setConfig = (data: config.deviceConfig) => {
    data.locationMapfenceCode == null ? [] : data.locationMapfenceCode?.split(',');
    setDeviceConfig(data).then((res) => {
        getDeviceConfig();
    });
};
</script>
<style lang="scss" scoped>
.systemConfig {
    // background-color: #fff; // 设置后深色模式就只能看见白色背景
    padding: 50px;
}
</style>
