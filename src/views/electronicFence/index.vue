<template>
    <div class="electronicFence">
        <n-layout has-sider>
            <n-layout-sider
                :width="300"
                :collapsed-width="0"
                collapse-mode="transform"
                show-trigger="arrow-circle"
            >
                <ul id="fenceTree" class="ztree"></ul>
            </n-layout-sider>
            <n-layout has-sider sider-placement="right">
                <n-layout-content>
                    <leaflet-map
                        ref="leafletMapRef"
                        :map-id="mapOptions.id"
                        :coordinate-type="mapOptions.coordinateType"
                    />
                </n-layout-content>
                <n-layout-sider
                    :width="300"
                    :collapsed-width="0"
                    collapse-mode="transform"
                    show-trigger="arrow-circle"
                ></n-layout-sider>
            </n-layout>
        </n-layout>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { getMapDataList } from "@/api/map";
import { initZTree, zTreeSetting } from "@/utils/zTree";
import LeafletMap from "./leafletMap.vue";
import { getAssetsFile, recUpdate } from "@/utils/common";
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
const fenceData = ref<MapFenceRecord.MapFenceTree[]>();
/**生成地图 */
const getMapInfo = async (data: map.mapDataList) => {
    mapOptions.value.id = data.id;
    mapOptions.value.coordinateType = data.eCoordinateType;
    nextTick(() => {
        leafletMapRef.value.initMap().then(() => {
            leafletMapRef.value.initFence(fenceData.value);
        });
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
/**生成电子围栏树 */
const initMapFenceTree = () => {
    let setting: zTreeSetting = {
        api: "GetMapFenceTree",
        url: "Admin",
        chkStyle: "checkbox",
        field: {
            children: "children",
        },
        dataFilter: zTreeDataFilter,
    };
    let data = {
        isEnable: true,
    };
    treeObj.value = initZTree("fenceTree", setting, data);
};
/**zTree预渲染 */
const zTreeDataFilter = (
    event: Event,
    treeId: string,
    treeNode: defaultType.responseDefaultType<MapFenceRecord.MapFenceTree[]>
) => {
    fenceData.value = treeNode.Data;
    return treeDataRecursive(treeNode.Data);
};
/**树形数据格式化 */
const treeDataRecursive = (
    data: MapFenceRecord.MapFenceTree[]
): MapFenceRecord.MapFenceTree[] => {
    return data.map((fence) => {
        return recUpdate(
            fence,
            () => ({ icon: getAssetsFile("base", "icon-fence.png") }),
            () => ({ icon: getAssetsFile("base", "icon-fence.png") })
        );
    });
};
onMounted(() => {
    getMapList();
    initMapFenceTree();
});
</script>
<style lang="scss" scoped>
.electronicFence {
    height: 100%;
    :deep(.n-layout) {
        height: inherit;
    }
}
</style>
