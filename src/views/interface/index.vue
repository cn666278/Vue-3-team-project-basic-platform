<template>
    <div class="form">
        <div class="form_operate">
            <n-space justify="end">
                <n-button text @click="onAddEditModal()">
                    <n-icon :size="22">
                        <AppstoreAddOutlined />
                    </n-icon>
                    新增
                </n-button>
            </n-space>
        </div>
        <n-divider style="margin: 10px 0" />
        <div class="form_search">
            <n-form size="medium" label-placement="left">
                <n-grid :cols="4" :x-gap="10">
                    <n-form-item-gi label="接口名称">
                        <n-input v-model:value="formSearch.name" />
                    </n-form-item-gi>
                    <n-form-item-gi label="控制器名称">
                        <n-select
                            v-model:value="formSearch.controllerName"
                            :options="controllerList"
                        />
                    </n-form-item-gi>
                    <n-form-item-gi label="接口函数名">
                        <n-input v-model:value="formSearch.actionName" />
                    </n-form-item-gi>
                    <n-form-item-gi>
                        <n-button type="primary" @click="getTableData"
                            >查询</n-button
                        >
                    </n-form-item-gi>
                </n-grid>
            </n-form>
        </div>
        <div class="form_table">
            <n-data-table
                :data="tableData"
                :columns="columns"
                :loading="loading"
            />
        </div>
        <div class="form_page">
            <pagination
                    :current-page="pageOption?.currentPage"
                    :page-size="pageOption?.pageSize"
                    :total-page="pageOption?.totalPage"
                    :total-count="pageOption?.totalCount"
                    @page-change="pageHandle"
                    @page-size-change="pageSizeHandle"
                />
        </div>
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
                :select-data="controllerList"
                :form-info="editInfo"
            >
                <template #submit="slotProps">
                    <n-button type="primary" @click="onAddEditSubmit(slotProps)"
                        >确定</n-button
                    >
                    <n-button @click="onAddEditClose">取消</n-button>
                </template>
            </AddEditVue>
        </n-modal>
    </div>
</template>
<script setup lang="ts">
import AddEditVue from "./addEdit.vue";
import { pagination, PaginationType } from '@/components/pagination';
import {
    getCompetenceList,
    getCompetenceControllerList,
    getCompetenceInfo,
    addCompetence,
    updateCompetence,
} from "@/api/setting";
import { ref, h } from "vue";
import {
    DataTableColumn,
    SelectOption,
    NTag,
    NButton,
} from "naive-ui";
import { AppstoreAddOutlined } from "@vicons/antd";
let loading = ref<boolean>(false);
/**页数 */
const pageOption = ref<PaginationType>({
    currentPage: 1,
    pageSize: 20,
});
/**列表搜索值 */
let formSearch = ref<admin.competenceListRequest>({
    currentPage: pageOption.value.currentPage,
    pageSize: pageOption.value.pageSize,
});

/**控制器列表 */
let controllerList = ref<SelectOption[]>([]);

/**列表数据 */
let tableData = ref<admin.competenceList[]>([]);
/**弹出框 */
let editId = ref<string | undefined>("");
let showAddEdit = ref<boolean>(false);
let addEditTitle = ref<string>("新增接口");
let editInfo = ref<any>(undefined);

/**获取表格数据 */
const getTableData = async () => {
    loading.value = true;
    formSearch.value.currentPage = pageOption.value.currentPage;
    formSearch.value.pageSize = pageOption.value.pageSize;
    const Data = (await getCompetenceList(formSearch.value)).Data;
    loading.value = false;
    tableData.value = Data.data;
    let pageData: PaginationType = {
        currentPage: Data.currentPage,
        pageSize: Data.pageSize,
        totalCount: Data.totalCount,
        totalPage: Data.totalPage,
    };
    pageOption.value = pageData;
};

/**获取控制器列表 */
const getControllerList = async () => {
    const Data = (await getCompetenceControllerList()).Data;
    const controllerListData = Data.map((item) => {
        return {
            label: item,
            value: item,
        };
    });
    controllerListData.unshift({
        label: "全部",
        value: null as any,
    });
    controllerList.value = controllerListData;
};

getTableData();
getControllerList();

/**列表格式 */
const columns: DataTableColumn[] = [
    { title: "接口名称", key: "name" },
    { title: "控制器名称", key: "controllerName" },
    { title: "接口函数名", key: "actionName" },
    {
        title: "是否检查",
        key: "needCheck",
        render(row) {
            return h(
                NTag,
                {
                    style: {
                        marginRight: "5px",
                    },
                    type: row.needCheck ? "success" : "error",
                },
                {
                    default: () => (row.needCheck ? "是" : "否"),
                }
            );
        },
    },
    {
        title: "是否启用",
        key: "isEnable",
        render(row) {
            return h(
                NTag,
                {
                    style: {
                        marginRight: "5px",
                    },
                    type: row.isEnable ? "success" : "error",
                },
                {
                    default: () => (row.isEnable ? "已启用" : "未启用"),
                }
            );
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
/**页数改变触发事件 */
const pageHandle = (page: number) => {
    pageOption.value.currentPage = page;
    getTableData();
};
/**页数大小改变触发事件 */
const pageSizeHandle = (pageSize: number) => {
    pageOption.value.pageSize = pageSize;
    getTableData();
};

/**编辑新增弹窗事件 */
const onAddEditModal = async (id?: string) => {
    getControllerList();
    if (id) {
        addEditTitle.value = "编辑接口";
        editId.value = id;
        editInfo.value = (await getCompetenceInfo(id)).Data;
        console.log(editInfo.value);
    }
    showAddEdit.value = true;
};

/**新增或编辑事件 */
const onAddEditSubmit = async (slotProps: any) => {
    const { formData, validate } = slotProps;
    validate((error: any) => {
        if (!error) {
            if (formData?.id) {
                updateCompetence(formData).then((res) => {
                    if (res.State == 1) {
                        getTableData();
                        showAddEdit.value = false;
                    }
                });
            } else {
                addCompetence(formData).then((res) => {
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

/**弹窗关闭事件 */
const onAddEditClose = () => {
    editId.value = undefined;
    editInfo.value = undefined;
    showAddEdit.value = false;
};
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
    .form_page {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-top: 10px;
        margin-bottom: 10px;
    }
}
</style>
