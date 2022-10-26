<template>
  <div>
    <n-tabs type="line" animated>
      <n-tab-pane name="1" tab="设备">
        <div class="tree">
          <div id="treeDemo" class="ztree"></div>
        </div>
      </n-tab-pane>
      <n-tab-pane name="2" tab="业务">
        <div class="tree">
            <div id="businesstree" class="ztree"></div>
        </div>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { initZTree, zTreeSetting } from "@/utils/zTree";
import { onMounted, ref } from "vue";
import { getDeviceTypeList } from "@/api/deviceType";
import { addDeviceTransmit, getSelectDeviceList } from "@/api/deviceTransmit";
const treeObj = ref();
onMounted(() => {
  getTypeList();
});
const getTypeList = async () => {
  initDeviceZTree();
};
/**zTree初始化 */
const initDeviceZTree = () => {
  let data = {
    name: "",
    currentPage: 1,
    pageSize: 999999,
  };
  let setting: zTreeSetting = {
    api: "GetDeviceTypeList",
    url: "Admin",
    fontCss: {
      //字体样式
      "font-size": "14px !important",
      height: "25px",
    },
    chkStyle: "checkbox",
    dataFilter: zTreeDataFilter,
  };
  treeObj.value = initZTree("treeDemo", setting, data);
};
/**zTree预渲染 */
const zTreeDataFilter = (
  event: Event,
  treeId: string,
  treeNode: defaultType.responseDefaultType<defaultType.responseList<deviceType.deviceTypeList>>
) => {
  return treeNode.Data.data;
};
</script>

<style lang="scss" scoped>
.tree {
  height: 65vh;
  overflow-y: auto;
}
</style>

function getTypeList() { throw new Error("Function not implemented."); }
