<template>
    <div class="instruction_issued">
        <n-layout has-sider>
            <n-layout-sider
                :width="300"
                :collapsed-width="0"
                collapse-mode="transform"
                show-trigger="arrow-circle"
                content-style="padding-right: 10px;box-sizing: border-box"
                bordered
            >
                <commandTree @get-command-data="getCommandData" />
            </n-layout-sider>
            <n-layout has-sider sider-placement="right">
                <n-layout-content>
                    <n-card
                        class="instruction_issued_card"
                        title="终端连接参数"
                        :segmented="{ content: true }"
                        content-style="padding: 0;"
                    >
                        <template #header-extra>
                            <n-button
                                type="primary"
                                v-if="commandData"
                                @click="formRef?.getFormData"
                                >发送指令</n-button
                            >
                        </template>
                        <TableListTemplate>
                            <template #operate>
                                <dynamicForm
                                    ref="formRef"
                                    :form-data="commandData"
                                    @get-command-param="getCommandParam"
                                />
                            </template>
                            <template #search>
                                <tableSearch
                                    :columns="searchColumns"
                                    @get-table-data="getTableData"
                                />
                            </template>
                            <template #table>
                                <BasicTable
                                    :columns="tableColumn"
                                    :dataSource="tableData"
                                    :pagination="false"
                                    :pageOption="pageOption"
                                    :scroll-x="1200"
                                ></BasicTable>
                            </template>
                            <template #page>
                                <pagination
                                    :current-page="pageOption?.currentPage"
                                    :page-size="pageOption?.pageSize"
                                    :total-count="pageOption?.totalCount"
                                    :total-page="pageOption?.totalPage"
                                    @page-change="pageHandle"
                                    @page-size-change="pageSizeHandle"
                                />
                            </template>
                            <template #modal>
                                <Dialog
                                    v-model:showModal="showModal"
                                    :option="dialogOption"
                                    :btn-show="false"
                                    @close="onModelClose"
                                >
                                    <div
                                        style="
                                            white-space: pre-wrap;
                                            line-height: 30px;
                                            overflow: auto;
                                        "
                                        v-html="jsonCheck"
                                    ></div>
                                </Dialog>
                            </template>
                        </TableListTemplate>
                    </n-card>
                </n-layout-content>
                <n-layout-sider
                    :width="300"
                    :collapsed-width="0"
                    collapse-mode="transform"
                    show-trigger="arrow-circle"
                    bordered
                >
                    <n-tabs
                        v-model:value="treeTab"
                        type="segment"
                        @update-value="onChangeTree"
                        animated
                        style="height: 100%"
                    >
                        <n-tab-pane name="deviceTree" tab="设备分组">
                            <ul id="deviceTree" class="ztree"></ul>
                        </n-tab-pane>
                        <n-tab-pane name="businessTree" tab="业务分组">
                            <ul id="businessTree" class="ztree"></ul>
                        </n-tab-pane>
                    </n-tabs>
                </n-layout-sider>
            </n-layout>
        </n-layout>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, h } from "vue";
import { getAssetsFile, formatDateTime } from "@/utils/common";
import {
    jT808Command8103,
    getDeviceCommandList,
    requestDeviceCommandList,
} from "@/api/deviceCommand";
import { getJTJsonWriter } from '@/api/interfaceLog';
import { initZTree, zTreeSetting } from "@/utils/zTree";
import {
    PaginationType,
    TableListTemplate,
    tableSearch,
    Dialog,
} from "@/components/TableListTemplate";
import { BasicTable } from "@/components/BasicTable";
import { DataTableColumn, NTag } from "naive-ui";
import { searchColumns } from "./columns";
import commandTree from "./commandTree.vue";
import dynamicForm from "./dynamicForm.vue";
const treeTab = ref("deviceTree");
const treeObj = ref();
const commandData = ref();
const tableData = ref<deviceCommand.deviceCommandList[]>([]);
const formRef = ref();
const deviceIdList = ref<string[]>([]);
const pageOption = ref<PaginationType>({
    currentPage: 1,
    pageSize: 20,
});
const showModal = ref(false);
const dialogOption = reactive({
    title: "查看",
});
const jsonCheck = ref("");
/**获取表格数据 */
const getTableData = async (jsonData?: requestDeviceCommandList) => {
    if (jsonData) {
        jsonData = Object.assign(jsonData, pageOption.value);
    }
    const Data = (
        await getDeviceCommandList(
            jsonData ? jsonData : { ...pageOption.value }
        )
    ).Data;
    let pageData: PaginationType = {
        currentPage: Data.currentPage,
        pageSize: Data.pageSize,
        totalCount: Data.totalCount,
        totalPage: Data.totalPage,
    };
    pageOption.value = pageData;
    tableData.value = Data.data;
};
/**搜索列表数据并返回到第一页 */
const onSearch = () => {
    pageOption.value.currentPage = 1;
    getTableData();
};
/**分页页数监听 */
const pageHandle = (page: number) => {
    pageOption.value.currentPage = page;
    getTableData();
};
/**每页页数监听 */
const pageSizeHandle = (pageSize: number) => {
    pageOption.value.pageSize = pageSize;
    onSearch();
};
/**切换树形事件 */
const onChangeTree = () => {
    deviceIdList.value.length == 0;
    nextTick(() => {
        initDeviceZTree();
    });
};
/**zTree初始化 */
const initDeviceZTree = () => {
    let setting: zTreeSetting = {
        api:
            treeTab.value == "deviceTree"
                ? "GetDeviceMapIndex"
                : "GetBusinessMapIndex",
        url: "UnAuth",
        chkStyle: "checkbox",
        dataFilter: zTreeDataFilter,
        callBack: {
            onCheck: zTreeOnNodeChecked,
        },
    };
    nextTick(() => {
        treeObj.value = initZTree(treeTab.value, setting);
    });
};
/**zTree预渲染 */
const zTreeDataFilter = (
    event: Event,
    treeId: string,
    treeNode: defaultType.responseDefaultType<unAuth.mapTreeList>
) => {
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
                        name: device.terminalNo,
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
/**树形勾选 */
const zTreeOnNodeChecked = (event: Event, treeId: string, treeNode: any) => {
    deviceIdList.value = treeObj.value
        .getCheckedNodes(true)
        .filter((node: unAuth.deviceList) => node.deviceId)
        .map((node: unAuth.deviceList) => node.deviceId);
};
/**获取指令数据 */
const getCommandData = (data: any) => {
    commandData.value = data.formData;
};
/**获取发送的指令字段 */
const getCommandParam = (data: any) => {
    console.log(data, deviceIdList.value);
    // if (deviceIdList.value.length > 0) {
    //     jT808Command8103({ ...data, deviceIdList: deviceIdList.value });
    // }
};
/**弹窗关闭方法 */
const onModelClose = () => {
    showModal.value = false;
};
/**参数字段点击事件 */
const onShowParam = async (jsonData: string) => {
    showModal.value = true;
    jsonCheck.value = (await getJTJsonWriter(jsonData)).Data;
};
/**表格格式 */
const tableColumn: DataTableColumn[] = [
    { title: "序列", key: "key", width: 90, align: "center" },
    { title: "设备号", key: "terminalNo" },
    {
        title: "下发指令内容",
        key: "commandText",
        cellProps: (rowData: any) => {
            return {
                style: "cursor: pointer;",
                onClick: () => onShowParam(rowData.commandText),
            };
        },
    },
    {
        title: "是否下发",
        key: "isSend",
        align: "center",
        render: (row) => {
            return h(
                NTag,
                {
                    type: row.isEnable ? "success" : "info",
                    size: "small",
                },
                {
                    default: () => (row.isEnable ? "是" : "否"),
                }
            );
        },
    },
    {
        title: "下发时间",
        key: "sendDate",
        render: (row) => formatDateTime(row.sendDate as string),
    },
    {
        title: "创建日期",
        key: "createDate",
        render: (row) => formatDateTime(row.createDate as string),
    },
    { title: "操作人", key: "memberName" },
];
onMounted(() => {
    initDeviceZTree();
});
</script>
<style lang="scss" scoped>
.instruction_issued {
    height: 100%;
    .instruction_issued_card {
        height: 100%;
    }
    :deep(.n-layout) {
        height: inherit;
    }
}
</style>
