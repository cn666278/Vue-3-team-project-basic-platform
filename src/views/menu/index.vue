<template>
    <table-list-template>
        <template #operate>
            <n-button text @click="onAddEditModal()">
                <n-icon :size="22">
                    <AppstoreAddOutlined />
                </n-icon>
                新增
            </n-button>
        </template>
        <template #search>
            <n-form inline size="medium" label-placement="left">
                <n-form-item label="菜单名称">
                    <n-input v-model:value="searchMenuName" />
                </n-form-item>
                <n-form-item>
                    <n-button type="primary" @click="getTableData"
                        >查询</n-button
                    >
                </n-form-item>
            </n-form>
        </template>
        <template #table>
            <n-data-table
                remote
                striped
                :data="menuDataList"
                :row-key="rowKey"
                :columns="columns"
                :pagination="page"
                :expanded-row-keys="expendKeys"
                @update-expanded-row-keys="expendKeysHandle"
            />
        </template>
        <template #modal>
            <n-modal
                v-model:show="showAddEdit"
                preset="card"
                :title="addEditTitle"
                style="width: 600px"
                size="huge"
                bordered
                auto-focus
                @before-leave="onAddEditClose"
            >
                <AddEditVue
                    :id="editId"
                    :menu-tree="menuTree"
                    :form-info="editInfo"
                >
                    <template #submit="slotProps">
                        <n-button
                            type="primary"
                            @click="onAddEditSubmit(slotProps)"
                            >确定</n-button
                        >
                        <n-button @click="onAddEditClose">取消</n-button>
                    </template>
                </AddEditVue>
            </n-modal>
        </template>
    </table-list-template>
</template>
<script setup lang="ts">
import AddEditVue from "./addEdit.vue";
import { TableListTemplate } from "@/components/TableListTemplate";
import {
    getMenusList,
    getMenusTree,
    addMenu,
    updateMenu,
    getMenuInfo,
    menuTree as MenuTree
} from "@/api/setting";
import { transformTozTreeFormat, recUpdate } from "@/utils/common";
import {
    NTag,
    DataTableColumn,
    DataTableRowKey,
    PaginationProps,
    TreeSelectOption,
    NButton,
} from "naive-ui";
import { h, Ref, ref, onMounted } from "vue";
import { AppstoreAddOutlined } from "@vicons/antd";
let searchMenuName: Ref<string> = ref("");
let tableCurrentPage: Ref<number> = ref(1);
let tablePageSize: Ref<number> = ref(9999);
let showAddEdit: Ref<boolean> = ref(false);
let addEditTitle: Ref<string> = ref("新增菜单");
let editId: Ref<string | undefined> = ref(undefined);
let editInfo: Ref<any> = ref(undefined);
const Data = (
    await getMenusList({
        title: searchMenuName.value,
        currentPage: tableCurrentPage.value,
        pageSize: tablePageSize.value,
    })
).Data;
const loading: Ref<boolean> = ref(false);
const menuData: Ref<defaultType.responseList<admin.menuList[]> | undefined> =
    ref(Data);
const menuDataList: Ref<any> = ref(transformTozTreeFormat(Data.data));
let menuTree: Ref<TreeSelectOption[]> = ref([
    {
        id: null,
        title: "根目录菜单",
        children: [],
    },
]);

/**获取列表数据 */
const getTableData = async () => {
    loading.value = true;
    getMenusList({
        title: searchMenuName.value,
        currentPage: tableCurrentPage.value,
        pageSize: tablePageSize.value,
    })
        .then((res) => {
            menuData.value = res.Data;
            menuDataList.value = transformTozTreeFormat(res.Data.data);
        })
        .finally(() => {
            loading.value = false;
        });
};

const getMenuTreeList = async () => {
    const { Data } = await getMenusTree();
    menuTree.value[0].children = (treeDataRecursive(Data)) as unknown as TreeSelectOption[];
};

/**树形数据格式化 */
const treeDataRecursive = (data: MenuTree[]): MenuTree[] => {
    return data.map((menu) => recUpdate(menu, () => ({isLeaf: false}), () => ({isLeaf: true})));
};

/**编辑新增弹窗事件 */
const onAddEditModal = async (id?: string) => {
    getMenuTreeList();
    if (id) {
        addEditTitle.value = "编辑菜单";
        editId.value = id;
        editInfo.value = (await getMenuInfo(id)).Data;
    }
    showAddEdit.value = true;
};

/**弹窗关闭事件 */
const onAddEditClose = () => {
    editId.value = undefined;
    editInfo.value = ref({});
    showAddEdit.value = false;
};

/**新增或编辑事件 */
const onAddEditSubmit = (slotProps: any) => {
    const { formData, validate } = slotProps;
    validate((error: any) => {
        if (!error) {
            formData.webName = formData.webComponent;
            formData.webPath = formData.url;
            if (formData?.id) {
                updateMenu(formData).then((res) => {
                    if (res.State == 1) {
                        getTableData();
                        showAddEdit.value = false;
                    }
                });
            } else {
                addMenu(formData).then((res) => {
                    if (res.State == 1) {
                        getTableData();
                        showAddEdit.value = false;
                    }
                });
            }
            console.log(formData);
        } else {
            console.log("校验没通过");
        }
    });
};

/**列表格式 */
const columns: DataTableColumn[] = [
    {
        title: "菜单名称",
        key: "title",
    },
    {
        title: "Url地址",
        key: "url",
    },
    {
        title: "序号",
        key: "sort",
        width: 75,
        align: "center",
    },
    {
        title: "是否启用",
        key: "isEnable",
        align: "center",
        render(row) {
            if (row.isEnable) {
                return h(
                    NTag,
                    {
                        style: {
                            marginRight: "5px",
                        },
                        type: "success",
                    },
                    {
                        default: () => "已启用",
                    }
                );
            } else {
                return h(
                    NTag,
                    {
                        style: {
                            marginRight: "5px",
                        },
                        type: "error",
                    },
                    {
                        default: () => "未启用",
                    }
                );
            }
        },
    },
    {
        title: "需要授权",
        key: "needAuth",
        align: "center",
        render(row) {
            if (row.needAuth) {
                return h(
                    NTag,
                    {
                        style: {
                            marginRight: "5px",
                        },
                        type: "success",
                    },
                    {
                        default: () => "是",
                    }
                );
            } else {
                return h(
                    NTag,
                    {
                        style: {
                            marginRight: "5px",
                        },
                        type: "error",
                    },
                    {
                        default: () => "否",
                    }
                );
            }
        },
    },
    {
        title: "操作",
        key: "id",
        align: "center",
        render(row) {
            return h(
                NButton,
                {
                    type: "info",
                    dashed: true,
                    size: "small",
                    onClick: () =>
                        onAddEditModal(row?.id as string | undefined),
                },
                {
                    default: () => "编辑",
                }
            );
        },
    },
];
/**分页数据 */
const page: PaginationProps = {
    itemCount: menuData.value?.totalCount,
    pageCount: menuData.value?.totalPage,
    pageSize: menuData.value?.pageSize,
    pageSizes: [10, 20, 50, 100, 9999],
    pageSlot: 5,
    showSizePicker: true,
};
/**行Key设置 */
const rowKey = (row: admin.menuList) => row.id;
const expendKeys: Ref<DataTableRowKey[]> = ref([]);
const expendKeysHandle = (keys: DataTableRowKey[]) => {
    expendKeys.value = keys;
};
onMounted(() => {
    getMenuTreeList();
});
</script>
<style lang="scss" scoped>
.form {
    .form_operate {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 5px 0;
    }
    .form_table {
        height: 100%;
    }
}
</style>
