<template>
    <n-layout class="real_video" has-sider>
        <n-layout-sider
            :width="300"
            :collapsed-width="0"
            collapse-mode="transform"
            show-trigger="arrow-circle"
            @after-enter="cvNetVideoResize"
            @after-leave="cvNetVideoResize"
        >
            <ul id="groupTree" class="ztree"></ul>
        </n-layout-sider>
        <n-layout-content class="real_video_container">
            <div class="real_video_content">
                <div id="CvNetVideoContainer" class="cv_net_video_container">
                    <div id="CvNetVideo" class="cv_net_video"></div>
                </div>
                <div class="cv_net_video_control">
                    <n-tabs type="segment">
                        <n-tab-pane name="play" tab="播放">
                            <n-select
                                v-model:value="videoStreamType"
                                :options="videoStreamTypeOption"
                            />
                        </n-tab-pane>
                        <n-tab-pane name="intercom" tab="对讲"></n-tab-pane>
                        <n-tab-pane name="monitor" tab="监听"></n-tab-pane>
                        <n-tab-pane name="broadcast" tab="广播"></n-tab-pane>
                        <n-tab-pane name="PTZ" tab="云台"></n-tab-pane>
                    </n-tabs>
                </div>
            </div>
            <leaflet-map
                ref="leafletMapRef"
                :map-id="mapOptions.id"
                :coordinate-type="mapOptions.coordinateType"
            ></leaflet-map>
        </n-layout-content>
    </n-layout>
</template>
<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { getMapDataList, getMapDeviceListInfo } from "@/api/map";
import { initZTree, zTreeSetting } from "@/utils/zTree";
import { getAssetsFile, mergeArray } from "@/utils/common";
import { socketSend, onMessageListKey } from "@/utils/webSocket";
import LeafletMap from "./LeafletMap.vue";
import "@/utils/CvNetVideo";
interface mapOptions {
    id: string;
    height: number;
    coordinateType: number;
}
const mapOptions = ref<mapOptions>({
    id: "",
    height: 700,
    coordinateType: 0,
});
const leafletMapRef = ref<any>();
const cvNetVideoData = ref();
const treeObj = ref();
const searchTreeData = ref<string>();
const videoStreamType = ref(1);
const videoStreamTypeOption = [
    {
        label: "清晰(主码流)",
        value: 0,
    },
    {
        label: "流畅(子码流)",
        value: 1,
    },
];
/**获取地图详情 */
const getMapInfo = async (data: map.mapDataList) => {
    mapOptions.value.id = data.id;
    mapOptions.value.coordinateType = data.eCoordinateType;
    nextTick(() => {
        leafletMapRef.value.initMap();
    });
};

/**获取地图列表 */
const getMapList = async () => {
    let data = (await getMapDataList()).Data;
    data.map((item) => {
        if (item.isDefault) {
            getMapInfo(item);
        }
    });
};

/**zTree初始化 */
const initDeviceZTree = () => {
    let setting: zTreeSetting = {
        api: "GetDeviceVideoTree",
        url: "Admin",
        chkStyle: "checkbox",
        dataFilter: zTreeDataFilter,
        callBack: {
            onCheck: zTreeOnNodeChecked,
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

/**树形勾选 */
const zTreeOnNodeChecked = (event: Event, treeId: string, treeNode: any) => {
    if (treeNode.checked) {
        let deviceList = treeObj.value
            .getCheckedNodes(true)
            .filter((node: admin.deviceList) => node.deviceId);
        let deviceIdList = deviceList.map((node: admin.deviceList) => node.deviceId);
        let terminalNoList = deviceList.map((node: admin.deviceList) => node.terminalNo);
        socketSend(
            {
                eCoordinateType: 0,
                terminalNoList: terminalNoList,
            },
            100
        );
        getTreeCarInfo(deviceIdList);
        cvNetVideoStartRealVide(deviceList);
    } else {
        if(treeNode.isParent) {
            let deviceList = treeObj.value.getNodesByFilter((node: any) => {
                return node.deviceId
            }, null, treeNode);
            let terminalNoList = deviceList.map((node: admin.deviceList) => node.terminalNo);
            leafletMapRef.value.removeCar(terminalNoList);
            console.log(deviceList);
            cvNetVideoCloseRealVide(deviceList);
        } else {
            console.log(treeNode);
            leafletMapRef.value.removeCar([treeNode.terminalNo]);
            if(treeNode.isOnline) cvNetVideoCloseRealVide([treeNode]);
        }
    }
};

/**树形点击 */
const zTreeOnNodeClick = (event: Event, treeId: string, treeNode: any) => {
    if (treeNode.deviceList == undefined) {
        getMapDeviceListInfo({
            deviceIdList: [treeNode.deviceId],
            coordinateType: mapOptions.value.coordinateType,
        }).then((res) => {
            leafletMapRef.value.carPosTo(treeNode.terminalNo);
            leafletMapRef.value.changeCarPopup(res.Data);
        });
    }
};

/**前端树形搜索 */
const zTreeSearchNode = (data?: string) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (!data) data = searchTreeData.value;
            if (data && data != "") {
                treeObj.value.hideNodes(
                    treeObj.value.transformToArray(treeObj.value.getNodes())
                );
                let nodes = treeObj.value.getNodesByParamFuzzy("name", data);
                let newNodes: any[] = nodes.map((item: any) => {
                    return mergeArray<any>(item.getPath(), nodes);
                });
                if (newNodes.length <= 300) {
                    newNodes.forEach((item) => {
                        treeObj.value.showNodes(item);
                    });
                    treeObj.value.expandAll(true);
                } else {
                    let allNodes = treeObj.value.transformToArray(
                        treeObj.value.getNodes()
                    );
                    treeObj.value.showNodes(allNodes);
                }
            } else {
                let allNodes = treeObj.value.transformToArray(
                    treeObj.value.getNodes()
                );
                treeObj.value.showNodes(allNodes);
                treeObj.value.expandAll(false);
                // let expandNodes = treeObj.value.getNodes();
                // expandNodes.forEach((item: any) => {
                //     treeObj.value.expandNode(item, true);
                // });
            }
            resolve(true);
        }, 0);
    });
};

/**初始化树形节点状态 */
const initNodeStatus = (data: admin.deviceList) => {
    if (data.isOnline) return getAssetsFile("base", "icon-drive.png");
    return getAssetsFile("base", "icon-offline.png");
};

/**获取车辆详情 */
const getTreeCarInfo = (deviceIdList: string[]) => {
    getMapDeviceListInfo({
        deviceIdList,
        coordinateType: mapOptions.value.coordinateType,
    }).then((res) => {
        leafletMapRef.value.initCar(res.Data);
    });
};

/**CvNetVideoInit */
const initCvNetVideo = () => {
    cvNetVideoData.value = CvNetVideo.Init(
        document.querySelector("#CvNetVideo"),
        8,
        {
            clusterHost: "111.59.30.30",
            clusterPort: "20090",
            protocol: 0,
        }
    );
};

/**视频发起实时播放 */
const cvNetVideoStartRealVide = (data: admin.deviceList[]) => {
    data.map((device) => {
        device.channelList.map((channel, index) => {
            cvNetVideoData.value.StartRealTimeVideo(
                device.terminalNo,
                channel,
                videoStreamType,
                true,
                channel,
                {
                    clusterHost: '111.59.30.30',
                    clusterPort: '20090',
                    protocol: 0,
                }
            );
        });
    });
};

/**视频关闭实时播放 */
const cvNetVideoCloseRealVide = (data: admin.deviceList[]) => {
    data.map((device) => {
        device.channelList.map((channel) => {
            cvNetVideoData.value.AVTransferControl(
                device.terminalNo,
                channel,
                0,
                videoStreamType,
                0,
                channel,
                {
                    clusterHost: '111.59.30.30',
                    clusterPort: '20090',
                    protocol: 0,
                }
            )
            cvNetVideoData.value.Stop(channel);
        });
    });
};

/**视频组件自适应宽高 */
const cvNetVideoResize = () => {
    let videoWidth = document.getElementById(
        "CvNetVideoContainer"
    )?.offsetWidth;
    let videoHeight = document.getElementById(
        "CvNetVideoContainer"
    )?.offsetHeight;
    cvNetVideoData.value.Resize(videoWidth, videoHeight);
};
onMounted(() => {
    initCvNetVideo();
    getMapList();
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
.real_video {
    width: 100%;
    height: 100%;
    .real_video_container {
        width: inherit;
        height: inherit;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        .real_video_content {
            flex: 1;
            margin-bottom: 6px;
            box-sizing: inherit;
            display: flex;
            .cv_net_video_container {
                flex: 2;
                // width: 100px;
                // height: 100px;
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
            .cv_net_video_control {
                flex: 1;
            }
        }
        .Map {
            flex: 1;
            margin-top: 6px;
            box-sizing: inherit;
        }
    }
}
</style>
