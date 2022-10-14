<template>
    <div class="systemConfig">
        <ConfigTemplate :config-type="systemConfig" :data="configData" @on-submit="setConfig"></ConfigTemplate>
    </div>
</template>
<script setup lang="ts">
import ConfigTemplate from '@/components/ConfigTemplate/index.vue';
import type { configType } from '@/components/ConfigTemplate/index';
import { getSysConfig, setSysConfig, getDeviceConfig, setDeviceConfig } from '@/api/config';
import { formatDateTime } from '@/utils/common';
let systemConfig: configType[] = [
    {
        title: '设备配置',
        param: [
            {
                label: '设备检测任务间隔时间（分钟）',
                type: 'string',
                paramName: 'checkCD',
                span: 1,
            },
            {
                label: '设备离线超时时间（分钟）',
                type: 'string',
                paramName: 'onlineCD',
                span: 1,
            },
            {
                label: '设备行驶状态超时时间（分钟）',
                type: 'string',
                paramName: 'driveCD',
                span: 1,
            },
            {
                label: '有效区域围栏编号（逗号隔开）',
                type: 'string',
                paramName: 'locationMapfenceCode',
                span: 1,
                rows: 2,
            },
            {
                label: '速度过滤',
                type: 'string',
                paramName: 'speed',
                span: 1,
            },
            {
                label: '连续轨迹过滤',
                type: 'boolean',
                paramName: 'trailFilter',
                span: 1,
            },
        ],
    },
    {
        title: '视频配置',
        param: [
            {
                label: 'FTP服务器IP',
                type: 'string',
                paramName: 'ftpServerIp',
                span: 1,
            },
            {
                label: 'FTP服务器端口号',
                type: 'string',
                paramName: 'ftpPort',
                span: 1,
            },
            {
                label: 'FTP用户名称',
                type: 'string',
                paramName: 'ftpUser',
                span: 1,
            },
            {
                label: 'FTP服务器密码',
                type: 'string',
                paramName: 'ftpPassWord',
                span: 1,
            },
            {
                label: 'FTP文件上传路径',
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
    background-color: #fff;
    padding: 10px;
}
</style>
