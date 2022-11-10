<template>
    <n-space vertical>
        <n-input-group>
            <n-input>
                <template #prefix>
                    <n-icon :component="SearchOutlined"></n-icon>
                </template>
            </n-input>
            <n-button type="primary" ghost>搜索</n-button>
        </n-input-group>
        <ul id="commandTree" class="ztree"></ul>
    </n-space>
</template>
<script setup lang="ts">
import "@ztree/ztree_v3/js/jquery-1.4.4.min.js";
import "@ztree/ztree_v3/js/jquery.ztree.core.min.js";
import "@ztree/ztree_v3/js/jquery.ztree.excheck.min.js";
import "@ztree/ztree_v3/js/jquery.ztree.exedit.min.js";
import "@ztree/ztree_v3/js/jquery.ztree.exhide";
// import '@ztree/ztree_v3/css/metroStyle/metroStyle.css'
import "@ztree/ztree_v3/css/zTreeStyle/zTreeStyle.css";
import "jquery";
import { SearchOutlined } from "@vicons/antd";
import { getAssetsFile } from "@/utils/common";
import { onMounted } from "vue";
const emit = defineEmits(["getCommandData"]);
const commandTreeData = [
    {
        name: "终端参数指令",
        icon: getAssetsFile("base", "icon-group.png"),
        children: [
            {
                name: "通讯连接参数",
                icon: getAssetsFile("base", "icon-fence.png"),
                formData: [
                    {
                        name: "param0001",
                        label: "心跳发送间隔(s)",
                        type: "number",
                        value: 0,
                        isEnable: false,
                    },
                    {
                        name: "param0002",
                        label: "TCP消息应答时间(s)",
                        type: "number",
                        value: 0,
                        isEnable: false,
                    },
                    {
                        name: "param0003",
                        label: "TCP消息重传次数",
                        type: "number",
                        value: 0,
                        isEnable: false,
                    },
                    {
                        name: "param0004",
                        label: "UDP消息应答超时时间(s)",
                        type: "number",
                        value: 0,
                        isEnable: false,
                    },
                    {
                        name: "param0005",
                        label: "UDP消息重传次数",
                        type: "number",
                        value: 0,
                        isEnable: false,
                    },
                    {
                        name: "param0006",
                        label: "SMS消息应答超时时间",
                        type: "number",
                        value: 0,
                        isEnable: false,
                    },
                    {
                        name: "param0007",
                        label: "SMS消息重传次数",
                        type: "number",
                        value: 0,
                        isEnable: false,
                    },
                ],
            },
            {
                name: "服务器参数",
                icon: getAssetsFile("base", "icon-fence.png"),
                formData: [
                    {
                        name: "param00010",
                        label: "主服务器APN",
                        type: "string",
                        value: "",
                        isEnable: false,
                    },
                    {
                        name: "param00011",
                        label: "主服务器拨号账户",
                        type: "string",
                        value: "",
                        isEnable: false,
                    },
                    {
                        name: "param00012",
                        label: "主服务器拨号密码",
                        type: "string",
                        value: "",
                        isEnable: false,
                    },
                    {
                        name: "param00013",
                        label: "主服务器地址",
                        type: "string",
                        value: "",
                        isEnable: false,
                    },
                    {
                        name: "param00014",
                        label: "备份服务器APN",
                        type: "string",
                        value: "",
                        isEnable: false,
                    },
                    {
                        name: "param00015",
                        label: "备份服务器拨号账户",
                        type: "string",
                        value: "",
                        isEnable: false,
                    },
                    {
                        name: "param00016",
                        label: "备份服务器拨号密码",
                        type: "string",
                        value: "",
                        isEnable: false,
                    },
                    {
                        name: "param00017",
                        label: "备份服务器地址",
                        type: "string",
                        value: "",
                        isEnable: false,
                    },
                    {
                        name: "param00018",
                        label: "服务器TCP端口",
                        type: "number",
                        value: 0,
                        isEnable: false,
                    },
                    {
                        name: "param00019",
                        label: "服务器UDP端口",
                        type: "number",
                        value: 0,
                        isEnable: false,
                    },
                ],
            },
            {
                name: "电话号码参数",
                icon: getAssetsFile("base", "icon-fence.png"),
                formData: [
                    {
                        name: "param00040",
                        label: "监控平台电话号码",
                        type: "string",
                        value: "",
                        isEnable: false,
                    },
                    {
                        name: "param00041",
                        label: "复位电话号码",
                        type: "string",
                        value: "",
                        isEnable: false,
                    },
                    {
                        name: "param00042",
                        label: "恢复出厂设置电话号码",
                        type: "string",
                        value: "",
                        isEnable: false,
                    },
                    {
                        name: "param00043",
                        label: "监控平台SMS电话号码",
                        type: "string",
                        value: "",
                        isEnable: false,
                    },
                    {
                        name: "param00044",
                        label: "接收终端SMS文本报警",
                        type: "string",
                        value: "",
                        isEnable: false,
                    },
                    {
                        name: "param00046",
                        label: "每次最长通话时间",
                        type: "number",
                        value: 0,
                        isEnable: false,
                    },
                    {
                        name: "param0045",
                        label: "终端电话接听策略",
                        type: "radio",
                        value: 0,
                        props: {
                            options: [
                                { label: "自动接听", value: 0 },
                                { label: "ACC ON 时自动接听", value: 1 },
                                { label: "ACC OFF时手动接听", value: 2 },
                            ],
                        },
                    },
                    {
                        name: "param00047",
                        label: "当月最长通话时间",
                        type: "number",
                        value: 0,
                        isEnable: false,
                    },
                    {
                        name: "param00048",
                        label: "监听电话号码",
                        type: "string",
                        value: "",
                        isEnable: false,
                    },
                    {
                        name: "param00049",
                        label: "监管平台特权短信号码",
                        type: "string",
                        value: "",
                        isEnable: false,
                    },
                ],
            },
            {
                name: "位置汇报参数",
                icon: getAssetsFile("base", "icon-fence.png"),
                formData: [
                    {
                        name: "param00020",
                        label: "位置汇报策略",
                        type: "radio",
                        value: 0,
                        props: {
                            options: [
                                { label: "定时汇报", value: 0 },
                                { label: "定距汇报", value: 1 },
                                { label: "定时定距汇报", value: 2 },
                            ],
                        },
                    },
                    {
                        name: "param00022",
                        label: "驾驶员未登时间间隔",
                        type: "number",
                        value: 0,
                        isEnable: false,
                    },
                    {
                        name: "param00021",
                        label: "位置汇报方案",
                        type: "radio",
                        value: 0,
                        props: {
                            options: [
                                { label: "根据ACC状态", value: 0 },
                                { label: "根据登陆状态和ACC状态", value: 1 },
                            ],
                        },
                    },
                    {
                        name: "param00027",
                        label: "休眠汇报时间间隔(s)",
                        type: "number",
                        value: 0,
                        isEnable: false,
                    },
                    {
                        name: "param00028",
                        label: "紧急报警时间间隔(s)",
                        type: "number",
                        value: 0,
                        isEnable: false,
                    },
                    {
                        name: "param00029",
                        label: "缺省时间汇报间隔(s)",
                        type: "number",
                        value: 0,
                        isEnable: false,
                    },
                    {
                        name: "param00030",
                        label: "拐角补传角度,小于180",
                        type: "number",
                        value: 0,
                        isEnable: false,
                    },
                    {
                        name: "param00031",
                        label: "非法位移阈值",
                        type: "number",
                        value: 0,
                        isEnable: false,
                    },
                ],
            },
            {
                name: "报警参数",
                icon: getAssetsFile("base", "icon-fence.png"),
                formData: [
                    {
                        name: "param00055",
                        label: "最高速度(km/h)",
                        type: "number",
                        value: 0,
                        isEnable: false,
                    },
                    {
                        name: "param00056",
                        label: "超速持续时间(s)",
                        type: "number",
                        value: 0,
                        isEnable: false,
                    },
                    {
                        name: "param00057",
                        label: "连续驾驶时间门限(s)",
                        type: "number",
                        value: 0,
                        isEnable: false,
                    },
                    {
                        name: "param00058",
                        label: "当天累计驾驶时间门限(s)",
                        type: "number",
                        value: 0,
                        isEnable: false,
                    },
                    {
                        name: "param00059",
                        label: "最小休息时间(s)",
                        type: "number",
                        value: 0,
                        isEnable: false,
                    },
                    {
                        name: "param0005A",
                        label: "最长停车时间(s)",
                        type: "number",
                        value: 0,
                        isEnable: false,
                    },
                    {
                        name: "param0005B",
                        label: "超速报警预警差值",
                        type: "number",
                        value: 0,
                        isEnable: false,
                    },
                    {
                        name: "param0005C",
                        label: "疲劳驾驶预警差值",
                        type: "number",
                        value: 0,
                        isEnable: false,
                    },
                    {
                        name: "param0005E",
                        label: "侧翻报警参数设置",
                        type: "number",
                        value: 0,
                        isEnable: false,
                    },
                ],
            },
            {
                name: "道路运输证IC卡认证",
                icon: getAssetsFile("base", "icon-fence.png"),
                formData: [
                    {
                        name: "param0001A",
                        label: "主服务器地址",
                        type: "string",
                        value: "",
                        isEnable: false,
                    },
                    {
                        name: "param0001B",
                        label: "主服务器TCP端口",
                        type: "number",
                        value: 0,
                        isEnable: false,
                    },
                    {
                        name: "param0001C",
                        label: "主服务器UDP端口",
                        type: "number",
                        value: 0,
                        isEnable: false,
                    },
                    {
                        name: "param0001D",
                        label: "备份服务器地址",
                        type: "string",
                        value: "",
                        isEnable: false,
                    },
                ],
            },
            {
                name: "拍照照片参数",
                icon: getAssetsFile("base", "icon-fence.png"),
                formData: [
                    {
                        name: "param00070",
                        label: "图像/视频质量",
                        type: "number",
                        value: 1,
                        isEnable: false,
                        props: {
                            min: 1,
                            max: 10,
                        },
                    },
                    {
                        name: "param00071",
                        label: "亮度",
                        type: "number",
                        value: 0,
                        isEnable: false,
                        props: {
                            min: 0,
                            max: 255,
                        },
                    },
                    {
                        name: "param00072",
                        label: "对比度",
                        type: "number",
                        value: 0,
                        isEnable: false,
                        props: {
                            min: 0,
                            max: 127,
                        },
                    },
                    {
                        name: "param00073",
                        label: "饱和度",
                        type: "number",
                        value: 0,
                        isEnable: false,
                        props: {
                            min: 0,
                            max: 127,
                        },
                    },
                    {
                        name: "param00074",
                        label: "色度",
                        type: "number",
                        value: 0,
                        isEnable: false,
                        props: {
                            min: 0,
                            max: 255,
                        },
                    },
                ],
            },
            {
                name: "车辆参数",
                icon: getAssetsFile("base", "icon-fence.png"),
                formData: [
                    {
                        name: "param00080",
                        label: "车辆里程读数",
                        type: "number",
                        value: 0,
                        isEnable: false,
                    },
                    {
                        name: "param00084",
                        label: "车牌颜色",
                        type: "radio",
                        value: 1,
                        props: {
                            options: [
                                { label: "蓝色", value: 1 },
                                { label: "黄色", value: 2 },
                                { label: "黑色", value: 3 },
                                { label: "白色", value: 4 },
                                { label: "其他", value: 9 },
                            ],
                        },
                    },
                ],
            },
            {
                name: "终端属性查询",
                icon: getAssetsFile("base", "icon-fence.png"),
            },
            {
                name: "GNSS参数",
                icon: getAssetsFile("base", "icon-fence.png"),
                formData: [
                    {
                        name: "param00090",
                        label: "GNSS定位模式",
                        type: "check",
                        value: [2, 4],
                        props: {
                            options: [
                                {
                                    label: "GPS定位",
                                    value: 2,
                                    checkedValue: 2,
                                    unCheckedValue: 1,
                                },
                                {
                                    label: "北斗定位",
                                    value: 4,
                                    checkedValue: 4,
                                    unCheckedValue: 3,
                                },
                                {
                                    label: "GLONASS定位",
                                    value: 6,
                                    checkedValue: 6,
                                    unCheckedValue: 5,
                                },
                                {
                                    label: "Galileo定位",
                                    value: 8,
                                    checkedValue: 8,
                                    unCheckedValue: 7,
                                },
                            ],
                            disabled: true,
                        },
                    },
                    {
                        name: "param00091",
                        label: "波特率",
                        type: "radio",
                        value: '0x00',
                        props: {
                            options: [
                                { label: "4800", value: '0x00' },
                                { label: "9600", value: '0x01' },
                                { label: "19200", value: '0x02' },
                                { label: "38400", value: '0x03' },
                                { label: "57600", value: '0x04' },
                                { label: "115200", value: '0x05' },
                            ],
                        },
                    },
                    {
                        name: "param00092",
                        label: "输出频率",
                        type: "radio",
                        value: '0x01',
                        props: {
                            options: [
                                { label: "500ms", value: '0x00' },
                                { label: "1000ms", value: '0x01' },
                                { label: "2000ms", value: '0x02' },
                                { label: "3000ms", value: '0x03' },
                                { label: "4000ms", value: '0x04' },
                            ],
                        },
                    },
                    {
                        name: "param00093",
                        label: "采集频率",
                        type: "number",
                        value: 1,
                        isEnable: false,
                    },
                    {
                        name: "param00094",
                        label: "上传方式",
                        type: "radio",
                        value: '0x00',
                        props: {
                            options: [
                                { label: "本地存储", value: '0x00' },
                                { label: "时间间隔", value: '0x01' },
                                { label: "距离间隔", value: '0x02' },
                                { label: "累计时间", value: '0x0B' },
                                { label: "累计距离", value: '0x0C' },
                                { label: "累计条数", value: '0x0D' },
                            ],
                        },
                    },
                    {
                        name: "param00095",
                        label: "上传设置",
                        type: "number",
                        value: 0,
                        isEnable: false,
                    },
                ],
            },
            {
                name: "数据下行透传",
                icon: getAssetsFile("base", "icon-fence.png"),
            },
        ],
    },
];
const zTreeOnNodeClick = (event: any, treeId: any, treeNode: any) => {
    emit("getCommandData", treeNode);
};
onMounted(() => {
    let tree: any = $.fn;
    let setting = {
        callback: {
            onClick: zTreeOnNodeClick,
        },
    };
    let treeObj = tree.zTree.init($("#commandTree"), setting, commandTreeData);
    treeObj.expandAll(true);
});
</script>
<style lang="scss" scoped></style>
