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
                    <n-form-item-gi label="附件名称">
                        <n-input v-model:value="formSearch.name" />
                    </n-form-item-gi>
                    <n-form-item-gi label="文件类型">
                        <n-select
                            v-model:value="formSearch.eFileType"
                            :options="eFileTypeOption"
                            value-field="id"
                            label-field="text"
                        />
                    </n-form-item-gi>
                    <n-form-item-gi>
                        <n-button type="primary" @click="getTableData()">查询</n-button>
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
            <page
                :current-page="formSearch.currentPage"
                :page-size="formSearch.pageSize"
                :total-count="pageOption.totalCount"
                :total-page="pageOption.totalPage"
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
            <addEditVue
                :file-type-list="eFileTypeOption"
            >
                <template #submit="slotProps">
                    <n-button type="primary" @click="onAddEditSubmit(slotProps)"
                        >确定</n-button
                    >
                    <n-button @click="onAddEditClose">取消</n-button>
                </template>
            </addEditVue>
        </n-modal>
    </div>
</template>
<script setup lang="ts">
import { ref, h } from "vue";
import { AppstoreAddOutlined } from "@vicons/antd";
import { DataTableColumn, UploadFileInfo , NTag } from "naive-ui";
import page from "@/components/pagination/index.vue";
import addEditVue from "./addEdit.vue";
import type { PaginationType } from "@/components/pagination";
import { getEnumType } from "@/api/login";
import { getUploadFileList, uploadFiles } from "@/api/upload";
import { formatDateTime } from "@/utils/common";
let loading = ref<boolean>(false);
/**列表搜索值 */
let formSearch = ref<updateFile.uploadFileListRequest>({
    currentPage: 1,
    pageSize: 10,
});
let tableData = ref<updateFile.uploadFileList[]>([]);
let showAddEdit = ref(false);
let addEditTitle = ref('新增附件');
let eFileTypeOption = ref<login.enumType[]>([]);
const columns: DataTableColumn[] = [
    { title: "附件类型", key: "fileType" },
    { title: "附件名称", key: "fileName" },
    {
        title: "上传日期",
        key: "createDate",
        render: (row) =>
            h(
                "span",
                {},
                { default: () => formatDateTime(row.createDate as string) }
            ),
    },
    {
        title: "是否可用",
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
                    default: () => (row.isEnable ? "是" : "否"),
                }
            );
        },
    },
];
const pageOption = ref<PaginationType>({
    currentPage: 1,
    pageSize: 20,
});
/**获取表格数据 */
const getTableData = async () => {
    const Data = (await getUploadFileList(formSearch.value)).Data;
    pageOption.value = {
        currentPage: Data.currentPage,
        pageSize: Data.pageSize,
        totalCount: Data.totalCount,
        totalPage: Data.totalPage,
    };
    tableData.value = Data.data;
};
/**获取附件类型枚举 */
const getFileType = async () => {
    const Data = (await getEnumType("EFileType")).Data;
    eFileTypeOption.value = Data;
};
/**新增弹窗事件 */
const onAddEditModal = async () => {
    getFileType();
    showAddEdit.value = true;
};
/**关闭弹窗事件 */
const onAddEditClose = () => {
    showAddEdit.value = false;
};
/**新增或编辑事件 */
const onAddEditSubmit = async (slotProps: any) => {
    let { formData, fileList } = slotProps;
    let files = fileList.map((item: UploadFileInfo) => item.file)
    uploadFiles(formData, files).then(res => {
        if(res.State == 1) {
            window.$message?.success('附件上传成功');
            showAddEdit.value = false;
            getTableData();
        }
    });
}
const pageHandle = (page: number) => {
    formSearch.value.currentPage = page;
    getTableData();
}
const pageSizeHandle = (pageSize: number) => {
    formSearch.value.pageSize = pageSize;
    getTableData();
}
getFileType();
getTableData();
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
        justify-content: flex-end;
        align-items: center;
    }
}
</style>
