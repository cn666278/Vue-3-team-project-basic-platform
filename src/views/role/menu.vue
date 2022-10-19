<template>
  <div>
    <n-form inline size="medium" label-placement="left">
      <n-form-item label="菜单名称">
        <n-input v-model:value="menuName" @input="getSearchMenu" />
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="getRefreshMenu">刷新</n-button>
      </n-form-item>
      <n-form-item>
        <n-space>
          <slot name="submit" :formData="menuRoleInfoData"></slot>
        </n-space>
      </n-form-item>
    </n-form>

    <n-scrollbar class="device_tree" :style="`height: ${700 - 41}px`">
      <ul id="menuTree" class="ztree"></ul>
    </n-scrollbar>
  </div>
</template>
<script setup lang="ts">
import { h, onMounted, reactive, ref, Ref } from "vue";
import { initZTree, zTreeSetting } from "@/utils/zTree";
import { getAssetsFile, transformTozTreeFormat } from "@/utils/common";
import { getRoleBindMenu } from "@/api/role";
interface form {
  roleId?: string;
}

const props = defineProps<form>();

// 查询参数
let menuName: Ref<string> = ref("");

let menuData = ref();
let menuRoleInfoData = ref();

// 定义树形参数
const treeObj = ref();

onMounted(() => {
  initDeviceZTree();
});

/**zTree初始化 */
const initDeviceZTree = () => {
  let setting: zTreeSetting = {
    api: "GetMenuList",
    url: "Admin",
    chkStyle: "checkbox",
    field: {
      children: "children",
    },
    chkBoxType: {
      Y: "ps",
      N: "ps",
    },
    dataFilter: zTreeDataFilter,
    callBack: {
      onCheck: zTreeOnNodeChecked,
      onAsyncSuccess: zTreeOnAsyncSuccess,
    },
  };
  treeObj.value = initZTree("menuTree", setting, {
    pageSize: 9999,
    currentPage: 1,
  });
};
/**zTree预渲染 */
const zTreeDataFilter = (event: Event, treeId: string, treeNode: any) => {
  let data: object[] = [];
  treeDataRecursive(treeNode.Data.data).forEach((item) => {
    if (item.isEnable) {
      data.push(item);
    }
  });
  return data;
};

/**树形数据格式化 */
const treeDataRecursive = (data: admin.menuList[]) => {
  let treeData = data;
  return treeData.map((menu) => {
    return {
      ...menu,
      id: menu.id,
      eName: menu.title,
      name: menu.title,
      icon: getAssetsFile("base", "icon-group.png"),
    };
  });
};

// zTree渲染完成
const zTreeOnAsyncSuccess = () => {
  treeObj.value.expandAll(true);
  getRoleBindMenuList();
};

/**树形勾选 */
const zTreeOnNodeChecked = (event: Event, treeId: string, treeNode: any) => {
  let node = treeObj.value.getCheckedNodes(true);
  menuRoleInfoData.value = node.map((item: any) => item.id);
};

// 获取分配菜单的详情
const getRoleBindMenuList = async () => {
  menuData.value = (await getRoleBindMenu(props.roleId)).Data;
  let data = menuData.value;
  data.forEach((item: any, index: number) => {
    let node = treeObj.value.getNodeByParam("id", item.id);
    treeObj.value.checkNode(node, true);
    let pidNode = treeObj.value.getNodeByParam("pid", node.pid);
    treeObj.value.checkNode(pidNode, true, true);
  });
  menuRoleInfoData.value = treeObj.value.getCheckedNodes(true).map((item: any) => item.id);
};

// 搜索菜单
const getSearchMenu = () => {
  let nodes = treeObj.value.getNodesByParamFuzzy("title", menuName.value, null);
  if (nodes.length > 0) {
    treeObj.value.selectNode(nodes[0]);
  }
};

// 刷新数据
const getRefreshMenu = () => {
  treeObj.value.reAsyncChildNodes(null, "refresh");
};
</script>
<style lang="scss">
.space {
  margin: 10px 20px;
}
</style>
