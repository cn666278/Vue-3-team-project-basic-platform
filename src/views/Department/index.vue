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
            <n-form ref="formRef" inline label-placement="left" :label-width="100" :model="formValue">
                <n-form-item label="部门名称：" path="name">
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
        <!-- 关联职位 -->
        <n-modal
                v-model:show="showBindPosition"
                preset="card"
                :title="bindPositionTitle"
                style="width: 30%"
                size="huge"
                bordered
                auto-focus
                @before-leave="onBindPositionClose"
        >
            <n-form ref="formOfRef" :model="formBindData" :label-width="100" label-placement="left" require-mark-placement="left">
                <n-form-item label="部门">
                    <n-tree-select
                            v-model:value="formBindData.departmentId"
                            :options="departmentData"
                            key-field="id"
                            label-field="name"
                            default-expand-all
                            :virtual-scroll="false"
                    />
                </n-form-item>
                <n-form-item label="上级职位">
                    <n-tree-select
                            v-model:value="formBindData.pId"
                            :options="bindPositionData"
                            key-field="dpId"
                            label-field="positionName"
                            default-expand-all
                            :virtual-scroll="false"
                    />
                </n-form-item>
                <n-form-item
                        label="职位"
                        path="positionId"
                        :rule="{
                            required: true,
                            message: '请选择',
                            trigger: ['change', 'blur']
                         }"
                >
                    <n-tree-select
                            v-model:value="formBindData.positionId"
                            :options="positionData"
                            key-field="id"
                            label-field="name"
                            default-expand-all
                            :virtual-scroll="false"
                    />
                </n-form-item>
                <n-form-item label="排序">
                    <n-input-number v-model:value="formBindData.sort" type="textarea"/>
                </n-form-item>
                <n-form-item>
                    <n-row :gutter="[0, 24]">
                        <n-col :span="24">
                            <n-space justify="end">
                                <n-button attr-type="button" @click="onBindPositionClose">
                                    取消
                                </n-button>
                                <n-button type="primary" attr-type="button" @click="handleBindPositionClick">
                                    保存
                                </n-button>
                            </n-space>

                        </n-col>
                    </n-row>
                </n-form-item>
            </n-form>
        </n-modal>
        <!-- 显示已关联的职位 -->
        <n-modal
                v-model:show="showBindPositionList"
                preset="card"
                :title="'已关联职位'"
                style="width: 60%"
                size="huge"
                bordered
                auto-focus
        >
            <div class="form_operate">
                <n-space justify="end">
                    <n-button text @click="handleSelect(3,nowDepartmentId)">
                        <n-icon :size="22">
                            <AppstoreAddOutlined />
                        </n-icon>
                        新增
                    </n-button>
                </n-space>
            </div>
            <n-data-table
                    :loading="loading"
                    remote
                    striped
                    :columns="bindColumns"
                    :data="bindPositionListData"
                    :row-key="BindRowKey"
                    :pagination="page"
                    :expanded-row-keys="expendKeys"
                    @update:expanded-row-keys="expendKeysHandle"
            />
            <n-row :gutter="[0, 24]">
                <n-col :span="24">
                    <n-space justify="end">
                        <n-button type="info" @click="showBindPositionList = false" style="margin: 20px 0px 0px 0px">
                            确定
                        </n-button>
                    </n-space>
                </n-col>
            </n-row>
        </n-modal>
    </div>
</template>
<script setup lang="ts">
    import { reactive, Ref, ref, h } from 'vue';
    import { FormInst, useMessage, PaginationProps, NButton, NDropdown, NSelect, useDialog } from 'naive-ui';
    import type { DataTableColumns, DataTableRowKey } from 'naive-ui';
    import { AppstoreAddOutlined, ReloadOutlined } from '@vicons/antd';
    import { transformTozTreeFormat2, formatDateTime } from '@/utils/common';

    import { AddDepartment, UpdateDepartment, DeleteDepartment, GetDepartmentInfo, GetDepartmentList } from '@/api/department';
    import { GetPositionList } from '@/api/position';
    import { GetDepartmentPositionByDepartmentId, DepartmentBindPosition, DeleteDepartmentPosition } from '@/api/departmentBindPosition';
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
    const formOfRef = ref<FormInst | null>(null);

    // 新增编辑
    let showAddEdit: Ref<boolean> = ref(false);
    let showBindPosition: Ref<boolean> = ref(false);
    let showBindPositionList: Ref<boolean> = ref(false);
    let addEditTitle: Ref<string> = ref('新增');
    let bindPositionTitle: Ref<string> = ref('关联职位');
    let editId: Ref<string | undefined> = ref(undefined);
    let editInfo: Ref<any> = ref(undefined);
    let bindInfo: Ref<any> = ref(undefined);

    // 列表loading状态
    let loading: Ref<boolean> = ref(false);

    // 消息提示
    const message = useMessage();
    // 对话框
    const dialog = useDialog();

    let tableData: Ref<any> = ref([]);
    let memberTreeData: Ref<any> = ref([]);
    let departmentData: Ref<any> = ref([]);
    let positionData: Ref<any> = ref([]);
    let bindPositionListData: Ref<any> = ref([]);
    let bindPositionData: Ref<any> = ref([{
        positionId: '',
        positionName: '顶级职位',
    }]);

    //当前选中部门id
    let nowDepartment: Ref<any> = ref([]);
    // 当前部门id
    let nowDepartmentId: Ref<any> = ref(null);
    // 下拉菜单选项
    const options = ref([
        {
            label: '查看',
            key: '1',
        },
        // {
        //     label: '添加',
        //     key: "2"
        // },
    ]);
    // 列表查询点击事件
    const getTableData = async () => {
        loading.value = true;
        GetDepartmentList(formValue.value)
            .then((res) => {
                tableData.value = transformTozTreeFormat2(res.Data.data);
            })
            .finally(() => {
                loading.value = false;
            });
        if (showBindPositionList.value) {
            handleSelect(1,nowDepartment as any)
        }
    };

    // 新增数据点击事件
    const onAddEditModal = async (id?: string) => {
        // GetDepartmentList(formValue.value)
        //     .then((res) => {
        //         memberTreeData.value = transformTozTreeFormat2(res.Data.data);
        //     })
        memberTreeData.value = tableData.value;
        if (id) {
            addEditTitle.value = '编辑';
            editId.value = id;
            editInfo.value = (await GetDepartmentInfo(id)).Data;
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
                    UpdateDepartment(formData).then((res) => {
                        if (res.State == 1) {
                            getTableData();
                            showAddEdit.value = false;
                        }
                    });
                } else {
                    AddDepartment(formData).then((res) => {
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

    /*
    * 关联职位
    * */
    interface bindPositionFormData {
        dpId?: string,
        departmentId?: string,
        pId ?: string,
        positionId ?: string,
        sort ?: number,
    }

    let formBindData: Ref<bindPositionFormData> = ref({});
    // 下拉菜单点击
    const handleSelect = (key: string | number,row: any) => {
        formBindData.value = {};
        nowDepartmentId.value = row;
        if (key == 1) { // 1：查看;2:添加
            // 通过部门Id获取部门职位列表
            nowDepartment = row;
            GetDepartmentPositionByDepartmentId(row.id)
                .then((res) => {
                    bindPositionListData.value = res.Data as any;
                })
                .finally(() => {
                    loading.value = false;
                });
            showBindPositionList.value = true;
        } else if(key == 2 || key == 3) {
            // 获取部门列表
            GetDepartmentList(formValue.value)
                .then((res) => {
                    departmentData.value = transformTozTreeFormat2(res.Data.data);
                })
                .finally(() => {
                    loading.value = false;
                });
            // 获取职位列表
            GetPositionList(formValue.value)
                .then((res) => {
                    positionData.value = transformTozTreeFormat2(res.Data.data);
                })
                .finally(() => {
                    loading.value = false;
                });
            // 通过部门Id获取部门职位列表
            bindPositionData.value = [{
                positionId: '',
                positionName: '顶级职位',
            }]
            let idState = row.departmentId;
            if (row.departmentId === undefined || row.departmentId === null) {
                idState = row.id;
            }
            GetDepartmentPositionByDepartmentId(idState)
                .then((res) => {
                    let thisData = res.Data as any;
                    thisData.forEach((item: any) => {
                        bindPositionData.value.push(item)
                    })

                })
                .finally(() => {
                    loading.value = false;
                });
            formBindData.value.departmentId = row.id;
            if (row.dpId != undefined && row.dpId != null && row.dpId != '' && key == 2) {
                formBindData.value.dpId = row.dpId;
                formBindData.value.pId = row.pId;
                formBindData.value.positionId = row.positionId;
                formBindData.value.departmentId = row.departmentId;
                formBindData.value.sort = row.sort;
            } else if (row.dpId != undefined && row.dpId != null && row.dpId != '' && key == 3) {
                formBindData.value.departmentId = row.departmentId;
            }
            showBindPosition.value = true;
        }
    };

    // 关联职位保存事件
    const handleBindPositionClick = () => {
        formOfRef.value?.validate((errors) => {
            if (!errors) {
                DepartmentBindPosition(formBindData.value).then((res) => {
                    if (res.State == 1) {
                        getTableData();
                        showBindPosition.value = false;
                        formBindData.value = {};
                    }
                });
            } else {
                console.log('校验未通过')
            }
        })

        // if (formBindData.value.dpId) {
        //     UpdateDepartment(formBindData.value).then((res) => {
        //         if (res.State == 1) {
        //
        //             getTableData();
        //             showAddEdit.value = false;
        //         }
        //     });
        // } else {
        //     DepartmentBindPosition(formBindData.value).then((res) => {
        //         if (res.State == 1) {
        //             getTableData();
        //             showAddEdit.value = false;
        //         }
        //     });
        // }
    };
    /**弹窗关闭事件 */
    const onAddEditClose = () => {
        editId.value = undefined;
        editInfo.value = ref({});
        showAddEdit.value = false;
    };
    /**关联职位弹窗关闭事件 */
    const onBindPositionClose = () => {
        editId.value = undefined;
        editInfo.value = ref({});
        showBindPosition.value = false;
    };

    // 获取列表数据函数执行
    getTableData();

    // 初始化列表数据类型
    type RowData = {
        id: string,
        name: string,
        pId: string,
        pName: string,
        createDate: string,
    };

    // 设置列表表头
    const createColumns: DataTableColumns<RowData> = [
        // {
        //     type: 'selection',
        // },
        {
            title: '标题',
            key: 'name',
        },
        {
            title: '父级名称',
            key: 'pName',
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
                            size: 'small',
                            onClick: () => onAddEditModal(row?.id as string | undefined),
                        },
                        {
                            default: () => '编辑',
                        }
                    ),
                    h(
                        NDropdown,
                        {
                            trigger: 'click',
                            options: options.value,
                            onSelect: (key) => handleSelect(key,row as any),
                        },
                        {
                            default: () => {
                                return h(
                                    NButton,
                                    {
                                        type: 'info',
                                        dashed: true,
                                        size: 'small',
                                        style: 'margin: 0 10px',
                                    },
                                    {
                                        default: () => '岗位',
                                    }
                                )
                            },
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

    // 初始化列表已关联职位
    type BindRowData = {
        pId: string,
        dpId: string,
        positionId: string,
        departmentId: string,
        positionName: string,
        departmentName: string,
        sort: number,
    };
    //已关联职位列表表头
    const bindColumns: DataTableColumns<BindRowData> = [
        // {
        //     type: 'selection',
        // },
        {
            title: '职位',
            key: 'positionName',
        },
        {
            title: '部门职位',
            key: 'departmentName',
        },
        {
            title: '操作',
            key: 'positionId',
            align: 'center',
            width: 300,
            render(row) {
                return h('div', [
                    h(
                        NButton,
                        {
                            type: 'info',
                            size: 'small',
                            onClick: () => handleSelect(2,row as any),
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
                            onClick: () => deleteDataById(row as any),
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
        // console.log(row);
        dialog.warning({
            title: '警告',
            content: '你是否要删除名称为"' + row.name + '"的数据？',
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: () => {
                let data: any = {
                    id: row.id,
                };
                DeleteDepartment(data).then((res) => {
                    if (res.State == 1) {
                        getTableData();
                    }
                });
            },
            onNegativeClick: () => {},
        });
    };

    // 删除部门关联的职位点击事件
    const deleteDataById = (row: any) => {
        // console.log(row);
        dialog.warning({
            title: '警告',
            content: '你是否要删除名称为"' + row.positionName + '"的数据？',
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: () => {
                let data: any = {
                    id: row.dpId,
                };
                DeleteDepartmentPosition(data.id).then((res) => {
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
    // 部门列表
    const rowKey = (row: RowData) => row.id;
    // 已关联职位列表
    const BindRowKey = (row: BindRowData) => row.dpId;
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
