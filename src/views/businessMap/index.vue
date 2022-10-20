<template>
    <div class="leaflet_map">
        <n-card class="device_slide" content-style="padding: 0;">
            <n-input-group class="device_search">
                <n-input v-model:value="searchTreeData" placeholder="设备号" />
                <n-button type="primary" @click="zTreeSearchNode()"
                    >搜索</n-button
                >
            </n-input-group>
            <n-scrollbar
                class="device_tree"
                :style="{maxHeight: `${mapOptions.height - 32}px`}"
            >
                <ul id="deviceTree" class="ztree"></ul>
            </n-scrollbar>
            <div class="device_count">
                <span>全部: {{ deviceCount.all }}</span>
                <span @click="onFilterCarStatus('行驶')">
                    <img :src="getAssetsFile('base', 'icon-drive.png')" />
                    行驶: {{ deviceCount.drive }}
                </span>
                <span @click="onFilterCarStatus('静止')">
                    <img :src="getAssetsFile('base', 'icon-stop.png')" />
                    静止: {{ deviceCount.stop }}
                </span>
                <span @click="onFilterCarStatus('离线')">
                    <img :src="getAssetsFile('base', 'icon-offline.png')" />
                    离线: {{ deviceCount.offline }}
                </span>
            </div>
        </n-card>
        <leaflet-map
            ref="leafletMapRef"
            :map-id="mapOptions.id"
            :coordinate-type="mapOptions.coordinateType"
        ></leaflet-map>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, nextTick, inject } from "vue";
import { computeMapHeight } from "@/utils/LeafletMap";
import { socketSend, onMessageListKey } from "@/utils/webSocket";
import { initZTree, zTreeSetting } from "@/utils/zTree";
import { getAssetsFile, mergeArray } from "@/utils/common";
import { getMapDataList, getMapDeviceListInfo } from "@/api/map";
import LeafletMap from "./LeafletMap.vue";
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
const treeObj = ref();
const deviceCount = ref({
    all: 0,
    stop: 0,
    drive: 0,
    offline: 0,
});
const searchTreeData = ref<string>();
/**生成地图 */
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

/**初始化树形节点状态 */
const initNodeStatus = (data: unAuth.deviceList) => {
    if (data.status) {
        switch (data.status) {
            case 1:
                return getAssetsFile("base", "icon-offline.png");
            case 2:
                return getAssetsFile("base", "icon-stop.png");
            case 3:
                return getAssetsFile("base", "icon-drive.png");
            default:
                return getAssetsFile("base", "icon-offline.png");
        }
    }
    return getAssetsFile("base", "icon-offline.png");
};

/**动态更新树形节点状态 */
const updateNodeStatus = (data: any) => {
    let device: any = treeObj.value.getNodeByParam(
        "terminalNo",
        data.d.TN ? data.d.TN : data.d.TerminalNo
    );
    if (data && device) {
        if (data.c === 1) {
            //  行驶
            if (data.d.S > 0) {
                device.status = 3;
                device.icon = getAssetsFile("base", "icon-drive.png");
            } else {
                device.status = 2;
                device.icon = getAssetsFile("base", "icon-stop.png");
            }
        } else if (data.c === 4 || data.c === 5) {
            //  静止或上线
            device.status = 2;
            device.icon = getAssetsFile("base", "icon-stop.png");
        } else if (data.c === 6) {
            //  离线
            device.status = 1;
            device.icon = getAssetsFile("base", "icon-offline.png");
        }
        treeObj.value.updateNode(device);
        deviceCount.value.stop = treeObj.value.getNodesByParam(
            "status",
            2
        ).length;
        deviceCount.value.drive = treeObj.value.getNodesByParam(
            "status",
            3
        ).length;
        deviceCount.value.offline = treeObj.value.getNodesByParam(
            "status",
            1
        ).length;
    }
};

/**zTree初始化 */
const initDeviceZTree = () => {
    let setting: zTreeSetting = {
        api: "GetBusinessMapIndex",
        url: "UnAuth",
        chkStyle: "checkbox",
        dataFilter: zTreeDataFilter,
        callBack: {
            onCheck: zTreeOnNodeChecked,
            onClick: zTreeOnNodeClick,
        },
    };
    treeObj.value = initZTree("deviceTree", setting);
};

/**zTree预渲染 */
const zTreeDataFilter = (
    event: Event,
    treeId: string,
    treeNode: defaultType.responseDefaultType<unAuth.mapTreeList>
) => {
    deviceCount.value = {
        all: treeNode.Data.count,
        offline: treeNode.Data.offLineCount,
        drive:
            treeNode.Data.count -
            treeNode.Data.offLineCount -
            treeNode.Data.stopCount,
        stop:
            treeNode.Data.count -
            treeNode.Data.offLineCount -
            treeNode.Data.driveCount,
    };
    return treeDataRecursive(treeNode.Data);
};

/**树形数据格式化 */
const treeDataRecursive = (data: unAuth.mapTreeList) => {
    let treeData = data.groupList;
    return treeData.map((group) => {
        if (group.deviceList.length > 0) {
            return {
                ...group,
                eName: group.name,
                name: `<span class='device_tree_status'>(<span class='device_tree_online'>${group.onlineCount}</span>/<span class='device_tree_count'>${group.count}</span>)</span>${group.name}`,
                icon: getAssetsFile("base", "icon-group.png"),
                deviceList: group.deviceList.map((device) => {
                    return {
                        ...device,
                        id: device.deviceId,
                        eName: device.terminalNo,
                        name: device.carNumber ? device.carNumber : device.terminalNo,
                        icon: initNodeStatus(device),
                    };
                }),
            };
        }
        return {
            ...group,
            eName: group.name,
            name: `<span class='device_tree_status'>(<span class='device_tree_online'>${group.onlineCount}</span>/<span class='device_tree_count'>${group.count}</span>)</span>${group.name}`,
            icon: getAssetsFile("base", "icon-group.png"),
        };
    });
};

/**树形勾选 */
const zTreeOnNodeChecked = (event: Event, treeId: string, treeNode: any) => {
    let terminalNoList = treeObj.value
        .getCheckedNodes(true)
        .filter((node: unAuth.deviceList) => node.terminalNo)
        .map((node: unAuth.deviceList) => node.terminalNo);
    if (socketSend == undefined) console.log("socketSend:undefined");
    socketSend(
        {
            eCoordinateType: 0,
            terminalNoList: terminalNoList,
        },
        100
    );
    if (treeNode.checked) {
        let deviceIdList = treeObj.value
            .getCheckedNodes(true)
            .filter((node: unAuth.deviceList) => node.deviceId)
            .map((node: unAuth.deviceList) => node.deviceId);
        getTreeCarInfo(deviceIdList);
    } else {
        if (treeNode.deviceList && treeNode.deviceList.length > 0) {
            let removeTerminalNoList = treeObj.value
                .getCheckedNodes(false)
                .filter((node: unAuth.deviceList) => node.terminalNo)
                .map((node: unAuth.deviceList) => node.terminalNo);
            leafletMapRef.value.removeCar(removeTerminalNoList);
        } else {
            leafletMapRef.value.removeCar([treeNode.terminalNo]);
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

/**筛选车辆状态 */
const onFilterCarStatus = (type: '行驶' | '静止' | '离线') => {
}

/**获取车辆详情 */
const getTreeCarInfo = (deviceIdList: string[]) => {
    getMapDeviceListInfo({
        deviceIdList,
        coordinateType: mapOptions.value.coordinateType,
    }).then((res) => {
        leafletMapRef.value.initCar(res.Data);
    });
};

/**本页websocket接收数据处理 */
const onSocketMessage = (res: string) => {
    let data = JSON.parse(res);
    if (data.c != 120) updateNodeStatus(data);
};
getMapList();
/**页面渲染完毕后动态地图高度 */
onMounted(() => {
    /**初始化树 */
    initDeviceZTree();
    mapOptions.value.height = computeMapHeight(leafletMapRef);
    window.addEventListener("resize", () => {
        mapOptions.value.height = computeMapHeight(leafletMapRef);
    });
    socketSend(
        {
            eCoordinateType: 0,
            terminalNoList: [],
        },
        100
    );
    /**接收注入 */
    const onMessageList = inject(onMessageListKey, []);
    onMessageList.push(onSocketMessage);
});
</script>
<style lang="scss" scoped>
.leaflet_map {
    height: 100%;
    display: flex;
    .device_slide {
        flex-basis: 320px;
        height: inherit;
        margin-right: 10px;
        display: flex;
        flex-direction: column;
        .device_search {
            padding: 8px;
            box-sizing: border-box;
        }
        .device_tree {
            flex: 1;
        }
        .device_count {
            flex-basis: 40px;
            width: 100%;
            padding: 0 5px;
            display: flex;
            align-items: center;
            justify-content: space-evenly;
            background-color: #f5f7fa;
            box-sizing: border-box;
            span {
                font-size: 0.7rem;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                img {
                    margin-right: 2px;
                }
            }
        }
        :deep(.n-card__content) {
            display: flex;
            flex-direction: column;
        }
    }
    .Map {
        flex: 1;
    }
}
</style>
