<template>
    <n-layout class="video_play_back" has-sider>
        <n-layout-sider
            :width="300"
            :collapsed-width="0"
            collapse-mode="transform"
            show-trigger="arrow-circle"
            @after-enter="cvNetVideoResize"
            @after-leave="cvNetVideoResize"
        >
            <div class="video_group_sider">
                <!-- <n-input-group class="device_search">
                    <n-input v-model:value="searchTreeData" placeholder="设备号" />
                    <n-button type="primary" @click="zTreeSearchNode()"
                        >搜索</n-button
                    >
                </n-input-group> -->
                <n-scrollbar class="video_group_tree">
                    <ul id="groupTree" class="ztree"></ul>
                </n-scrollbar>
                <div class="video_search">
                    <n-form
                        size="small"
                        label-placement="left"
                        label-width="auto"
                        :show-feedback="false"
                    >
                        <n-form-item label="开始时间">
                            <n-date-picker
                                v-model:formatted-value="
                                    searchVideoData.beginTime
                                "
                                type="datetime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                clearable
                            ></n-date-picker>
                        </n-form-item>
                        <n-form-item label="结束时间">
                            <n-date-picker
                                v-model:formatted-value="
                                    searchVideoData.endTime
                                "
                                type="datetime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                clearable
                            ></n-date-picker>
                        </n-form-item>
                        <n-form-item label="存储类型">
                            <n-select
                                v-model:value="searchVideoData.storageType"
                                :options="videoStorageTypeOption"
                            />
                        </n-form-item>
                        <n-form-item label="音视频类型">
                            <n-select
                                v-model:value="searchVideoData.mediaType"
                                :options="videoMediaTypeOption"
                            />
                        </n-form-item>
                        <n-form-item label="通道号">
                            <n-select
                                v-model:value="searchVideoData.channelNo"
                                :options="videoChannelOption"
                                label-field="text"
                                value-field="id"
                            />
                        </n-form-item>
                        <n-form-item label="视频码流">
                            <n-select
                                v-model:value="searchVideoData.streamType"
                                :options="videoStreamTypeOption"
                            />
                        </n-form-item>
                        <n-form-item>
                            <n-button
                                type="primary"
                                block
                                @click="onSearchVideoList"
                                >查询</n-button
                            >
                        </n-form-item>
                    </n-form>
                </div>
            </div>
        </n-layout-sider>
        <n-layout-content class="video_play_container">
            <div id="videoPlayViewContainer" class="video_play_view_container">
                <div id="CvNetVideo" class="cv_net_video"></div>
            </div>
            <div class="video_play_list">
                <n-data-table
                    :data="videoFileListData"
                    :columns="tableColumns"
                    :loading="videoListLoading"
                    :max-height="160"
                    :scroll-x="1100"
                    size="small"
                />
            </div>
        </n-layout-content>
    </n-layout>
</template>
<script setup lang="ts">
import { ref, onMounted, nextTick, h } from "vue";
import { SelectOption, DataTableColumn, NButton, NPopconfirm } from "naive-ui";
import { initZTree, zTreeSetting } from "@/utils/zTree";
import { PlayCircleOutlined, CloudUploadOutlined } from "@vicons/antd";
import {
    getAssetsFile,
    getHoursDistance,
    formatDateTime,
    formatMilliseconds,
} from "@/utils/common";
import { getEnumType } from "@/api/login";
import { getFtpUploadParam } from '@/api/config';
import "@/utils/CvNetVideo";
const cvNetVideoData = ref();
const treeObj = ref();
const searchTreeData = ref<string>();
const searchVideoData = ref({
    terminalNo: "",
    beginTime: getHoursDistance(new Date(), 1),
    endTime: formatDateTime(new Date()),
    storageType: 0,
    mediaType: 0,
    channelNo: 1,
    streamType: 0,
});
const videoStreamTypeOption = [
    { label: "全部", value: 0 },
    { label: "清晰(主码流)", value: 1 },
    { label: "流畅(子码流)", value: 2 },
];
const videoStorageTypeOption = [
    { label: "主或灾备存储器", value: 0 },
    { label: "主存储器", value: 1 },
    { label: "灾备存储器", value: 2 },
];
const videoMediaTypeOption = [
    { label: "音视频", value: 0 },
    { label: "音频", value: 1 },
    { label: "视频", value: 2 },
    { label: "音频或视频", value: 3 },
];
const videoOption = {
    clusterHost: "111.59.30.30",
    clusterPort: "20090",
    protocol: 0,
};
const videoChannelOption = (await getEnumType("EJT1078ChannelNo"))
    .Data as unknown as SelectOption[];
const videoFTPConfig = (await getFtpUploadParam()).Data;
const videoListLoading = ref(false);
const tableColumns: DataTableColumn<video.videoFileList>[] = [
    {
        title: "序号",
        key: "No",
        fixed: "left",
        width: 60,
        align: "center",
        render: (_, index) => index + 1,
    },
    {
        title: "操作",
        key: "operate",
        fixed: "left",
        width: 160,
        render: (row, index) => {
            return [
                h(
                    NButton,
                    {
                        quaternary: true,
                        size: "small",
                        onClick: () => onVideoPlay(row),
                    },
                    {
                        icon: () => h(PlayCircleOutlined, {}, {}),
                    }
                ),
                h(
                    NPopconfirm,
                    {
                        onPositiveClick: () => onVideoFTPUpload(row),
                    },
                    {
                        trigger: () =>
                            h(
                                NButton,
                                {
                                    quaternary: true,
                                    size: "small",
                                },
                                {
                                    icon: () => h(CloudUploadOutlined, {}, {}),
                                }
                            ),
                        default: () => "是否进行视频文件上传到服务器？",
                    }
                ),
            ];
        },
        align: "center",
    },
    {
        title: "通道号",
        key: "Channel",
        ellipsis: { tooltip: true },
        render: (row) => channelNoFormat(row.Channel),
    },
    {
        title: "存储器类型",
        key: "StorageType",
        render: (row) => storageTypeFormat(row.StorageType),
        align: "center",
    },
    {
        title: "音视频类型",
        key: "MediaType",
        render: (row) => mediaTypeFormat(row.MediaType),
        align: "center",
    },
    {
        title: "视频码流",
        key: "StreamType",
        render: (row) => streamTypeFormat(row.StreamType),
        align: "center",
    },
    {
        title: "开始时间",
        key: "StartTime",
        render: (row) => dateFormat(row.StartTime),
        width: 160,
        align: "center",
    },
    {
        title: "结束时间",
        key: "EndTime",
        render: (row) => dateFormat(row.EndTime),
        width: 160,
        align: "center",
    },
    {
        title: "录像时长",
        key: "VideoTime",
        render: (row) => videoDurationFormat(row),
        align: "center",
    },
    {
        title: "录像大小",
        key: "FileSize",
        ellipsis: { tooltip: true },
        render: (row) => videoBitFormat(row.FileSize),
        align: "center",
    },
];
const videoFileListData = ref<video.videoFileList[]>([]);

/**zTree初始化 */
const initDeviceZTree = () => {
    let setting: zTreeSetting = {
        api: "GetDeviceVideoTree",
        url: "Admin",
        dataFilter: zTreeDataFilter,
        callBack: {
            // onCheck: zTreeOnNodeChecked,
            onClick: zTreeOnNodeClick,
        },
    };
    treeObj.value = initZTree("groupTree", setting);
};

/**zTree预渲染 */
const zTreeDataFilter = (
    event: Event,
    treeId: string,
    treeNode: defaultType.responseDefaultType<admin.deviceVideoTree[]>
) => {
    return treeDataRecursive(treeNode.Data);
};

/**树形数据格式化 */
const treeDataRecursive = (data: admin.deviceVideoTree[]) => {
    let treeData = data;
    return treeData.map((group) => {
        if (group.deviceList.length > 0) {
            return {
                ...group,
                eName: group.name,
                name: group.name,
                icon: getAssetsFile("base", "icon-group.png"),
                deviceList: group.deviceList.map((device) => {
                    return {
                        ...device,
                        id: device.deviceId,
                        eName: device.terminalNo,
                        name: device.name ? device.name : device.terminalNo,
                        icon: initNodeStatus(device),
                    };
                }),
            };
        }
        return {
            ...group,
            eName: group.name,
            name: group.name,
            icon: getAssetsFile("base", "icon-group.png"),
        };
    });
};

/**树形点击 */
const zTreeOnNodeClick = (event: Event, treeId: string, treeNode: any) => {
    if (treeNode.deviceList == undefined)
        searchVideoData.value.terminalNo = treeNode.terminalNo;
};

/**初始化树形节点状态 */
const initNodeStatus = (data: admin.deviceList) => {
    if (data.isOnline) return getAssetsFile("base", "icon-drive.png");
    return getAssetsFile("base", "icon-offline.png");
};

/**CvNetVideoInit */
const initCvNetVideo = () => {
    cvNetVideoData.value = CvNetVideo.Init(
        document.querySelector("#CvNetVideo"),
        8,
        videoOption
    );
};

/**查询视频列表 */
const onSearchVideoList = () => {
    if (searchVideoData.value.terminalNo != "") {
        videoListLoading.value = true;
        cvNetVideoData.value.QueryVideoFileList(
            searchVideoData.value.terminalNo,
            searchVideoData.value.channelNo,
            dateParseFormat(searchVideoData.value.beginTime),
            dateParseFormat(searchVideoData.value.endTime),
            "0",
            searchVideoData.value.mediaType,
            searchVideoData.value.streamType,
            searchVideoData.value.storageType,
            getVideoFileList,
            0,
            videoOption,
            1
        );
    } else {
        window.$message?.info("请选择设备!");
    }
};

/**查询视频列表回调函数 */
const getVideoFileList = (data: video.videoListInfo) => {
    console.log(data);
    videoListLoading.value = false;
    videoFileListData.value = data.FileList;
};

/**视频播放 */
const onVideoPlay = (video: video.videoFileList) => {
    cvNetVideoData.value.PlaybackVideo(
        searchVideoData.value.terminalNo,
        video.Channel,
        video.MediaType,
        video.StreamType,
        video.StorageType,
        0,
        1,
        Time1078ToTime(video.StartTime),
        Time1078ToTime(video.EndTime),
        0,
        videoOption,
        null,
        0,
        1
    );
};

/**指定视频文件上传至服务器 */
const onVideoFTPUpload = (video: video.videoFileList) => {
    if(searchVideoData.value.terminalNo != '') {
        cvNetVideoData.value.FtpVideoFileUpload(
            searchVideoData.value.terminalNo,
            video.Channel,
            videoFTPConfig.ftpServerIp,
            videoFTPConfig.ftpPort,
            videoFTPConfig.ftpUser,
            videoFTPConfig.ftpPassWord,
            `${videoFTPConfig.ftpPath}/${searchVideoData.value.terminalNo}`,
            Time1078ToTime(video.StartTime),
            Time1078ToTime(video.EndTime),
            '0',
            video.MediaType,
            video.StreamType,
            video.StorageType,
            7,
            null,
            0,
            videoOption
        );
        window.$notification?.success({
            content: '正在上传视频到FTP服务器',
            duration: 1500,
        })
    }
};

/**视频组件自适应宽高 */
const cvNetVideoResize = () => {
    let videoWidth = document.getElementById(
        "videoPlayViewContainer"
    )?.offsetWidth;
    let videoHeight = document.getElementById(
        "videoPlayViewContainer"
    )?.offsetHeight;
    cvNetVideoData.value.Resize(videoWidth, videoHeight);
};

/**视频需要的时间字段解析 */
const dateParseFormat = (date: string) => {
    return Date.parse(new Date(date) as any) / 1000;
};

/**通道号格式化 */
const channelNoFormat = (channel: number) => {
    let channelList = videoChannelOption as unknown as login.enumType[];
    let channelIndex = channelList.findIndex((item) => item.id == channel);
    return channelList[channelIndex].text;
};

/**存储器类型格式化 */
const storageTypeFormat = (storage: number) => {
    switch (storage) {
        case 0:
            return "主或灾备存储器";
        case 1:
            return "主存储器";
        case 2:
            return "灾备存储器";
    }
};

/**音视频类型格式化 */
const mediaTypeFormat = (media: number) => {
    switch (media) {
        case 0:
            return "音视频";
        case 1:
            return "音频";
        case 2:
            return "视频";
        case 2:
            return "音频或视频";
    }
};

/**视频码流类型格式化 */
const streamTypeFormat = (stream: number) => {
    switch (stream) {
        case 1:
            return "主码流";
        case 2:
            return "子码流";
    }
};

/**时间格式化 */
const dateFormat = (date: string) => {
    let time = formatDateTime(date);
    if (time != "1970-01-01 08:00:00") {
        return formatDateTime(Time1078ToTime(date));
    }
};

/**视频时长格式化 */
const videoDurationFormat = (data: video.videoFileList) => {
    let start = Time1078ToTime(data.StartTime).getTime();
    let end = Time1078ToTime(data.EndTime).getTime();
    let time = new Date(end - start).getTime();
    return formatMilliseconds(time);
};

/**视频大小单位格式化 */
const videoBitFormat = (bytes: number) => {
    let size = bytes / 1024 / 1024;
    if (size > 1024) {
        return `${(bytes / 1024 / 1024 / 1024).toFixed(2)}GB`;
    }
    return `${size.toFixed(2)}MB`;
};

/**视频时间格式转Date */
const Time1078ToTime = (time1078: string) => {
    return new Date(
        "20" +
            time1078.substring(0, 2) +
            "-" +
            time1078.substring(2, 4) +
            "-" +
            time1078.substring(4, 6) +
            " " +
            time1078.substring(6, 8) +
            ":" +
            time1078.substring(8, 10) +
            ":" +
            time1078.substring(10, 12)
    );
};

onMounted(() => {
    initCvNetVideo();
    initDeviceZTree();
    window.addEventListener("resize", () => {
        cvNetVideoResize();
    });
    nextTick(() => {
        cvNetVideoResize();
    });
});
</script>
<style lang="scss" scoped>
.video_play_back {
    width: 100%;
    height: 100%;
    .video_group_sider {
        height: 100%;
        padding: 5px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        .video_group_tree {
            flex: 2;
        }
        .video_search {
            flex: 1;
        }
    }
    .video_play_container {
        width: inherit;
        height: inherit;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        .video_play_view_container {
            flex: 3;
            position: relative;
            .cv_net_video {
                position: absolute;
                top: 0;
                left: 0;
            }
            :deep(.video-container) {
                .video-box-body {
                    z-index: 0 !important;
                }
            }
        }
        .video_play_list {
            flex: 1;
        }
    }
}
</style>
