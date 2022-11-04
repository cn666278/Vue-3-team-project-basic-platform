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
            <n-form ref="formRef" inline label-placement="left" :label-width="80" :model="formValue">
                <n-form-item label="职位名称：" path="name">
                    <n-input v-model:value="formValue.name" placeholder="输入名称" />
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
                    :data="tableData"
                    :row-key="rowKey"
                    :pagination="page"
                    :expanded-row-keys="expendKeys"
                    @update:expanded-row-keys="expendKeysHandle"
            />
        </div>
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
            <AddEditVue :member-tree-data="memberTreeData" :form-info="editInfo">
                <template #submit="slotProps">
                    <n-button type="primary" @click="onAddEditSubmit(slotProps)">确定</n-button>
                    <n-button @click="onAddEditClose">取消</n-button>
                </template>
            </AddEditVue>
        </n-modal>
    </div>
</template>
<script setup lang="ts">
    import { reactive, Ref, ref, h } from 'vue';
    import { FormInst, useMessage, PaginationProps, NButton, useDialog } from 'naive-ui';
    import type { DataTableColumns, DataTableRowKey } from 'naive-ui';
    import { AppstoreAddOutlined, ReloadOutlined } from '@vicons/antd';
    import { transformTozTreeFormat2, formatDateTime } from '@/utils/common';

    import { AddPosition, UpdatePosition, DeletePosition, GetPositionInfo, GetPositionList } from '@/api/position';
    import AddEditVue from './addEdit.vue';

    interface formType {
        name?: string;
        pageSize: number;
        currentPage: number;
    }
    let formValue = ref<formType>({
        name: '',
        currentPage: 1,
        pageSize: 10,
    });
    const formRef = ref<FormInst | null>(null);

    // 新增编辑
    let showAddEdit: Ref<boolean> = ref(false);
    let addEditTitle: Ref<string> = ref('新增');
    let editId: Ref<string | undefined> = ref(undefined);
    let editInfo: Ref<any> = ref(undefined);

    // 列表loading状态
    let loading: Ref<boolean> = ref(false);

    // 消息提示
    const message = useMessage();
    // 对话框
    const dialog = useDialog();

    let tableData: Ref<any> = ref([]);
    let memberTreeData: Ref<any> = ref([]);

    // 列表查询点击事件
    const getTableData = async () => {
        loading.value = true;
        GetPositionList(formValue.value)
            .then((res) => {
                tableData.value = res.Data.data;
            })
            .finally(() => {
                loading.value = false;
            });
    };

    // 新增数据点击事件
    const onAddEditModal = async (id?: string) => {
        if (id) {
            addEditTitle.value = '编辑';
            editId.value = id;
            editInfo.value = (await GetPositionInfo(id)).Data;
        } else {
            editInfo.value = {};
        }
        showAddEdit.value = true;
    };

    // 保存新增编辑事件
    const onAddEditSubmit = (slotProps: any) => {
        const { formData, validate } = slotProps;
        validate((error: any) => {
            if (!error) {
                if (formData?.id) {
                    UpdatePosition(formData).then((res) => {
                        if (res.State == 1) {
                            getTableData();
                            showAddEdit.value = false;
                        }
                    });
                } else {
                    AddPosition(formData).then((res) => {
                        if (res.State == 1) {
                            getTableData();
                            showAddEdit.value = false;
                        }
                    });
                }
                console.log(formData);
            } else {
                console.log('校验没通过');
            }
        });
    };

    /**弹窗关闭事件 */
    const onAddEditClose = () => {
        editId.value = undefined;
        editInfo.value = ref({});
        showAddEdit.value = false;
    };

    // 获取列表数据函数执行
    getTableData();

    // 初始化列表数据类型
    type RowData = {
        id: string,
        name: string,
        createDate: string,
    };

    // 设置列表表头
    const createColumns: DataTableColumns<RowData> = [
        {
            title: '序列',
            key: 'key',
            width: 90,
            render: (_: any, index: number) => {
            return `${index + 1}`
            }
        },
        // {
        //     type: 'selection',
        // },
        {
            title: '职位名称',
            key: 'name',
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
                            onClick: () => onAddEditModal(row?.id as string | undefined),
                        },
                        {
                            default: () => '编辑',
                        }
                    ),
                    h(
                        NButton,
                        {
                            type: 'error',
                            dashed: true,
                            size: 'small',
                            style: 'margin: 0 10px',
                            onClick: () => deleteData(row as any),
                        },
                        {
                            default: () => '删除',
                        }
                    ),
                ]);
            },
        },
    ];

    // 删除按钮点击事件
    const deleteData = (row: any) => {
        console.log(row);
        dialog.warning({
            title: '警告',
            content: '你是否要删除名称为"' + row.name + '"的数据？',
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: () => {
                let data: any = {
                    id: row.id,
                };
                DeletePosition(data).then((res) => {
                    if (res.State == 1) {
                        getTableData();
                    }
                });
            },
            onNegativeClick: () => {},
        });
    };

    /**分页数据 */
    const page: PaginationProps = {
        itemCount: tableData.value?.totalCount,
        pageCount: tableData.value?.totalPage,
        pageSize: tableData.value?.pageSize,
        pageSizes: [10, 20, 50, 100],
        pageSlot: 5,
        showSizePicker: true,
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
