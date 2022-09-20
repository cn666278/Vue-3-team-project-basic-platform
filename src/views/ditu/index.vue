<template>
    <div class="leaflet_map">
        <div class="device_slide">
            <n-tree
                :data="deviceTree"
                key-field="id"
                label-field="name"
                children-field="deviceList"
                :node-props="treeNodeProps"
                check-strategy="child"
                virtual-scroll
                cascade
                checkable
                @update:checked-keys="onCheckHandle"
                :style="`height: ${mapOptions.height}px`"
            />
        </div>
        <leaflet-map
            ref="leafletMapRef"
            :map-id="mapOptions.id"
            :style="`height: ${mapOptions.height}px`"
        ></leaflet-map>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, nextTick, inject } from "vue";
import { computeMapHeight } from "@/utils/LeafletMap";
import { socketSend } from '@/utils/webSocket';
import { getMapDataList } from "@/api/map";
import { getDeviceMapIndex } from "@/api/device";
import { TreeOption } from "naive-ui";
import LeafletMap from "./LeafletMap.vue";
interface mapOptions {
    id: string;
    height: number;
}
const mapOptions = ref<mapOptions>({
    id: "",
    height: 700,
});
const deviceTree = ref<TreeOption[]>();
const leafletMapRef = ref<any>();
/**获取设备列表 */
const getDeviceList = async () => {
    let data = (await getDeviceMapIndex()).Data;
    console.log(treeDataRecursive(data.groupList));
    deviceTree.value = treeDataRecursive(data.groupList);
};
/**生成地图 */
const getMapInfo = async (id: string) => {
    mapOptions.value.id = id;
    nextTick(() => {
        leafletMapRef.value.initMap();
    });
};
/**获取地图列表 */
const getMapList = async () => {
    let data = (await getMapDataList()).Data;
    data.map((item) => {
        if (item.isDefault) {
            getMapInfo(item.id);
        }
    });
};
/**双循环返回相应树形格式(数据格式不一样没法遍历) */
const treeDataRecursive = (groupList: unAuth.groupList[]): TreeOption[] => {
    return groupList.map((group) => {
        if (group.deviceList.length > 0) {
            return {
                id: group.id,
                name: group.name,
                data: group,
                deviceList: group.deviceList.map((device) => {
                    return {
                        id: device.deviceId,
                        name: device.terminalNo,
                        data: device,
                    };
                }),
            };
        }
        return {
            id: group.id,
            name: group.name,
            data: group,
            deviceList: [],
        };
    }) as unknown as TreeOption[];
};
/**节点属性(多用于事件添加) */
const treeNodeProps = (info: { option: TreeOption }) => {
    return {
        onClick() {
            console.log(info);
        },
    }
}
/**勾选事件1 */
const onCheckHandle = (keys: string | number[]) => {
    console.log(keys);
};
getMapList();
getDeviceList();
/**页面渲染完毕后动态地图高度 */
onMounted(() => {
    mapOptions.value.height = computeMapHeight(leafletMapRef);
    window.addEventListener("resize", () => {
        mapOptions.value.height = computeMapHeight(leafletMapRef);
    });
    socketSend({
        eCoordinateType: 0,
        terminalNoList: [],
        businessCode: 'sys',
    }, 100);
});
</script>
<style lang="scss" scoped>
.leaflet_map {
    display: flex;
    .device_slide {
        flex-basis: 260px;
        height: inherit;
    }
    .Map {
        flex: 1;
    }
}
</style>
