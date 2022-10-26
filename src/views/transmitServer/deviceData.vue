<template>
  <div>
    <n-tabs
      type="line"
      animated
      :value="tabName"
      @update:value="handleUpdateValue"
    >
      <n-tab-pane name="1" tab="设备">
        <div class="tree">
          <ul id="treeDemo" class="ztree"></ul>
        </div>
      </n-tab-pane>
      <n-tab-pane name="2" tab="业务">
        <div class="tree">
          <ul id="businesstree" class="ztree"></ul>
        </div>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { initZTree, zTreeSetting } from "@/utils/zTree";
import { onMounted, ref, nextTick } from "vue";
import { addDeviceTransmit, getSelectDeviceList } from "@/api/deviceTransmit";
import { getAssetsFile } from "@/utils/common";
import { useMessage, useDialog } from "naive-ui";
const message = useMessage();
const props = defineProps({
  transmitServerId: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["closeDialog"]);
const treeObj = ref();
const treeObj1 = ref();
const tabName = ref("1");
// 设备id集合
const deviceIdList = ref<any[]>([]);
// 设备id集合
const businessIdList = ref<any[]>([]);
onMounted(() => {
  getTypeList();
});
const getTypeList = async () => {
  initDeviceZTree();
  //   initBusinessZTree();
};
// 提交数据
const onSubmit = async () => {
  let idlist = deviceIdList.value.concat(businessIdList.value);
//   console.log(idlist);
  if (idlist.length === 0) {
    message.error("请选择设备！");
  } else {
    let data = {
        deviceIdList: idlist,
        transmitServerId: props.transmitServerId,
      };
    addDeviceTransmit(data).then((res) => {
        emit('closeDialog',false)
    });
  }
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
    showIcon: false,
    chkStyle: "checkbox",
    dataFilter: zTreeDataFilter,
    callBack: {
      onCheck: DevicezTreeChecked,
    },
  };
  treeObj.value = initZTree("treeDemo", setting, data);
};
/**zTree预渲染 */
const zTreeDataFilter = (
  event: Event,
  treeId: string,
  treeNode: defaultType.responseDefaultType<
    defaultType.responseList<deviceType.deviceTypeList>
  >
) => {
  return treeNode.Data.data;
};
const DevicezTreeChecked = (event: Event, treeId: string, treeNode: any) => {
  if (treeNode.checked) {
    let deviceIdList1 = treeObj.value
      .getCheckedNodes(true)
      .filter((node: any) => node.id)
      .map((node: any) => node.id);
    deviceIdList.value = deviceIdList1;
  } else {
    let val = deviceIdList.value.indexOf(treeNode.id);
    if (val != -1) {
      deviceIdList.value.splice(val, 1);
    }
  }
  //   console.log(deviceIdList.value);
};
/**zTree初始化 */
const initBusinessZTree = () => {
  let data = {
    name: "",
    currentPage: 1,
    pageSize: 999999,
  };
  let setting: zTreeSetting = {
    api: "GetBusinessMapIndex",
    url: "UnAuth",
    fontCss: {
      //字体样式
      "font-size": "14px !important",
      height: "25px",
    },
    chkStyle: "checkbox",
    dataFilter: businesszTreeDataFilter,
    callBack: {
      onCheck: zTreeOnNodeChecked,
    },
  };
  treeObj1.value = initZTree("businesstree", setting);
};
/**zTree预渲染 */
const businesszTreeDataFilter = (
  event: Event,
  treeId: string,
  treeNode: defaultType.responseDefaultType<unAuth.mapTreeList>
) => {
  return treeDataRecursive(treeNode.Data);
};
/**树形勾选 */
const zTreeOnNodeChecked = (event: Event, treeId: string, treeNode: any) => {
  if (treeNode.checked) {
    let deviceIdList2 = treeObj1.value
      .getCheckedNodes(true)
      .filter((node: unAuth.deviceList) => node.deviceId)
      .map((node: unAuth.deviceList) => node.deviceId);
    businessIdList.value = deviceIdList2;
  } else {
    let val = businessIdList.value.indexOf(treeNode.deviceId);
    if (val != -1) {
      businessIdList.value.splice(val, 1);
    }
  }
};
/**树形数据格式化 */
const treeDataRecursive = (data: unAuth.mapTreeList) => {
  let treeData = data.groupList;
  return treeData.map((group) => {
    if (group.deviceList.length > 0) {
      return {
        ...group,
        eName: group.name,
        name: `<span class='device_tree_status'></span>${group.name}`,
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
      name: `<span class='device_tree_status'></span>${group.name}`,
      icon: getAssetsFile("base", "icon-group.png"),
    };
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
const handleUpdateValue = async (value: string) => {
  tabName.value = value;
  if (value === "1") {
    nextTick(() => {
      initDeviceZTree();
    });
  } else {
    nextTick(() => {
      initBusinessZTree();
    });
  }
};
/**导出方法以供父级ref使用 */
defineExpose({ onSubmit });
</script>

<style lang="scss" scoped>
.tree {
  height: 65vh;
  overflow-y: auto;
}
</style>
