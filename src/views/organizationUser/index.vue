<template>
    <div class="form">
        <div class="form_operate">
            <n-space justify="end">
                <n-upload :default-upload="false" :show-file-list="false" :on-change="getChange">
                    <n-button text>
                        <n-icon :size="22">
                            <CloudDownloadOutlined />
                        </n-icon>
                        导入员工
                    </n-button>
                </n-upload>
                <n-button text @click="onAddEditModal()">
                    <n-icon :size="22">
                        <AppstoreAddOutlined />
                    </n-icon>
                    新增
                </n-button>
                <n-button text @click="getTableData()">
                    <n-icon :size="22">
                        <ReloadOutlined />
                    </n-icon>
                    刷新
                </n-button>
            </n-space>
        </div>
        <n-divider style="margin: 10px 0" />
        <div class="form_search">
            <n-form ref="formRef" inline label-placement="left" :label-width="100" :model="formValue">
                <n-form-item label="专家名称：" path="name">
                    <n-input v-model:value="formValue.name" placeholder="请输入专家名称" />
                </n-form-item>
                <n-form-item>
                    <n-button attr-type="button" @click="getTableData"> 查询 </n-button>
                </n-form-item>
            </n-form>
        </div>
        <div class="form_table">
            <n-data-table
                :loading="loading"
                remote
                striped
                :columns="createColumns"
                :data="tableTreeData"
                :row-key="rowKey"
                :expanded-row-keys="expendKeys"
                @update:expanded-row-keys="expendKeysHandle"
            />
        </div>
        <!-- 分页 -->
        <pagination
            style="justify-content: flex-end; margin: 10px 0"
            :current-page="pageOption?.currentPage"
            :page-size="pageOption?.pageSize"
            :total-page="pageOption?.totalPage"
            :total-count="pageOption?.totalCount"
            @page-change="pageHandle"
            @page-size-change="pageSizeHandle"
        />
        <!-- 新增编辑弹出层 -->
        <n-modal
            v-model:show="showAddEdit"
            preset="card"
            :title="addEditTitle"
            style="width: 30%"
            size="huge"
            bordered
            auto-focus
            @before-leave="onAddEditClose"
        >
            <AddEditVue :table-tree-data="tableTreeData" :form-info="editInfo">
                <template #submit="slotProps">
                    <n-button type="primary" @click="onAddEditSubmit(slotProps)">确定</n-button>
                    <n-button @click="onAddEditClose">取消</n-button>
                </template>
            </AddEditVue>
        </n-modal>
        <!-- 修改密码弹出层 -->
        <n-modal
            v-model:show="showEditorPassword"
            preset="card"
            :title="addEditTitle"
            style="width: 30%"
            size="huge"
            bordered
            auto-focus
            @before-leave="onAddEditClose"
        >
            <Password :edit-id="editId">
                <template #submit="slotProps">
                    <n-button type="primary" @click="onPasswordSubmit(slotProps)">确定</n-button>
                    <n-button @click="onAddEditClose">取消</n-button>
                </template>
            </Password>
        </n-modal>
    </div>
</template>
<script setup lang="ts">
import { reactive, Ref, ref, h } from 'vue';
import { FormInst, useMessage, PaginationProps, NButton, NImage, useDialog } from 'naive-ui';
import type { DataTableColumns, DataTableRowKey } from 'naive-ui';
import { AppstoreAddOutlined, ReloadOutlined, CloudDownloadOutlined } from '@vicons/antd';
// 数组转树形、时间转换格式方法
import { transformTozTreeFormat2, formatDateTime } from '@/utils/common';

import { getUserList, getUserInfo, addUser, updateUser, updateUserPwd, setUserIsEnable, importUserForExcel } from '@/api/organizationUser';
// 上传附件
import { uploadFiles } from '@/api/upload';
// 新增或编辑页面
import AddEditVue from './addEdit.vue';
// 修改密码页面
import Password from './password.vue';
// 引入分页类型
import { pagination, PaginationType } from '@/components/TableListTemplate';

interface formType {
    name?: string;
}
interface fileUrlList {
    id: string;
    url: string;
}
// 分页
const pageOption = ref<PaginationType>({
    currentPage: 1,
    pageSize: 10,
});
let formValue = ref<formType>({
    name: '',
});
const formRef = ref<FormInst | null>(null);

// 新增编辑
let showAddEdit: Ref<boolean> = ref(false);
let addEditTitle: Ref<string> = ref('新增');
let editId: Ref<string | undefined> = ref(undefined);
let editInfo: Ref<any> = ref(undefined);
// 修改密码
let showEditorPassword: Ref<boolean> = ref(false);

// 列表loading状态
let loading: Ref<boolean> = ref(false);

// 消息提示
const message = useMessage();
// 对话框
const dialog = useDialog();

let tableData: Ref<any> = ref([]);
let tableTreeData: Ref<any> = ref([]);

// 列表查询点击事件
const getTableData = async () => {
    loading.value = true;
    getUserList(Object.assign(formValue.value, pageOption.value))
        .then((res) => {
            tableData.value = res.Data.data;
            tableTreeData.value = transformTozTreeFormat2(res.Data.data);
            let pageData: PaginationType = {
                currentPage: res.Data.currentPage,
                pageSize: res.Data.pageSize,
                totalCount: res.Data.totalCount,
                totalPage: res.Data.totalPage,
            };
            pageOption.value = pageData;
        })
        .finally(() => {
            loading.value = false;
        });
};

// 新增或编辑点击事件
const onAddEditModal = async (id?: string) => {
    addEditTitle.value = '新增';
    if (id) {
        addEditTitle.value = '编辑';
        editId.value = id;
        editInfo.value = (await getUserInfo(id)).Data;
        console.log(editInfo.value);
    }
    showAddEdit.value = true;
};
// 修改密码点击事件
const onPassWordModal = async (id?: string) => {
    addEditTitle.value = '修改密码';
    editId.value = id;
    showEditorPassword.value = true;
};
// 是否禁用或启用点击事件
const onDisableModal = async (row?: RowData) => {
    console.log(row);
    dialog.warning({
        title: `编辑`,
        content: `您是否要${row?.isEnable ? '禁用' : '启用'}数据姓名为${row?.nick}的数据？`,
        positiveText: '确定',
        onPositiveClick: () => {
            let isEnable = row?.isEnable;
            isEnable = !isEnable;
            let data = {
                id: row?.id,
                isEnable: isEnable,
            };
            setUserIsEnable(data).then((res: any) => {
                console.log(res);
                getTableData();
            });
        },
    });
};

// 保存新增编辑事件
const onAddEditSubmit = async (slotProps: any) => {
    const { formData, validate, iconsFile } = slotProps;
    console.log(iconsFile);
    let data: any = {
        eFileType: 100,
    };
    let files: any = {};
    if (iconsFile != null) {
        files = iconsFile.map((fileData: any) => {
            return fileData.file;
        });
        let fileUrlList = (await uploadFiles(data, files)).Data.fileList;
        formData.img = fileUrlList[0].url;
    }
    validate((error: any) => {
        if (!error) {
            if (formData?.id) {
                updateUser(formData).then((res) => {
                    if (res.State == 1) {
                        getTableData();
                        showAddEdit.value = false;
                    }
                });
            } else {
                addUser(formData).then((res) => {
                    if (res.State == 1) {
                        getTableData();
                        showAddEdit.value = false;
                    }
                });
            }
        } else {
            console.log('校验没通过');
        }
    });
};

// 保存密码事件
const onPasswordSubmit = async (slotProps: any) => {
    const { formData } = slotProps;
    let data = (await updateUserPwd(formData)).State;
    if (data == 1) {
        showEditorPassword.value = false;
    }
};

// 导入员工
const getChange = async (row: any) => {
    let data: any = {
        eFileType: 7,
    };
    let fileUrlList = await uploadFiles(data, [row.file.file]);
    if (fileUrlList.State == 1) {
        importUserForExcel(fileUrlList.Data.fileList[0].id).then((res: any) => {
            if (res.State == 1) {
                message.success('操作成功');
            }
        });
    }
};

/**弹窗关闭事件 */
const onAddEditClose = () => {
    editId.value = undefined;
    editInfo.value = ref({});
    showAddEdit.value = false;
    showEditorPassword.value = false;
};

// 获取列表数据函数执行
getTableData();

// 初始化列表数据类型
type RowData = {
    id: string;
    nick: string;
    img: string;
    phone: string;
    departmentPosition: any;
    isEnable: boolean;
    createDate: string;
};

// 设置列表表头
const createColumns: DataTableColumns<RowData> = [
    {
        title: '序列',
        key: 'key',
        width: 90,
        render: (_: any, index: number) => {
            return `${index + 1}`;
        },
    },
    {
        title: '姓名',
        key: 'nick',
    },
    {
        title: '头像',
        key: 'img',
        width: '150',
        render(row) {
            return h(
                NImage,
                {
                    width: '60',
                    height: '40',
                    src: row.img,
                },
                {}
            );
        },
    },
    {
        title: '手机号',
        key: 'phone',
        width: '180',
    },
    {
        title: '部门职位',
        key: 'departmentPosition',
        render(row) {
            return h(
                'span',
                {},
                {
                    default: () =>
                        `${row.departmentPosition != null ? row.departmentPosition.departmentName + '(' + row.departmentPosition.positionName + ')' : ''}`,
                }
            );
        },
    },
    {
        title: '创建时间',
        key: 'createDate',
        width: '180',
        render(row) {
            return h(
                'span',
                {},
                {
                    default: () => formatDateTime(row.createDate as unknown as Date),
                }
            );
        },
    },
    {
        title: '操作',
        key: 'id',
        align: 'center',
        width: 300,
        render(row) {
            return h('div', [
                h(
                    NButton,
                    {
                        type: 'info',
                        dashed: true,
                        size: 'small',
                        quaternary: true,
                        onClick: () => onAddEditModal(row?.id as string | undefined),
                    },
                    {
                        default: () => '编辑',
                    }
                ),
                h(
                    NButton,
                    {
                        type: 'info',
                        dashed: true,
                        size: 'small',
                        quaternary: true,
                        onClick: () => onPassWordModal(row?.id as string | undefined),
                    },
                    {
                        default: () => '修改密码',
                    }
                ),
                h(
                    NButton,
                    {
                        type: row.isEnable ? 'error' : 'success',
                        dashed: true,
                        size: 'small',
                        quaternary: true,
                        onClick: () => onDisableModal(row),
                    },
                    {
                        default: () => (row.isEnable ? '禁用' : '启用'),
                    }
                ),
            ]);
        },
    },
];

/**分页页数监听 */
const pageHandle = (page: number) => {
    console.log(page);
    pageOption.value.currentPage = page;
    getTableData();
};
/**每页页数监听 */
const pageSizeHandle = (pageSize: number) => {
    console.log(pageSize);
    pageOption.value.pageSize = pageSize;
    pageOption.value.currentPage = 1;
    getTableData();
};

// 行Key设置
const rowKey = (row: RowData) => row.id;
const expendKeys: Ref<DataTableRowKey[]> = ref([]);
const expendKeysHandle = (keys: DataTableRowKey[]) => {
    expendKeys.value = keys;
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
}
</style>
