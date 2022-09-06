<template>
    <div>
      <TableListTemplate>
        <template #operate>
          <n-space justify="end">
            <n-button text @click="addTable">
              <n-icon :size="20">
                <AppstoreAddOutlined />
              </n-icon>
              新增
            </n-button>
          </n-space>
        </template>
        <template #search>
          <BasicForm
            @register="register"
            @submit="handleSubmit"
            @reset="handleReset"
          >
          </BasicForm>
        </template>
        <template #table>
          <BasicTable
            :columns="columns"
            :pagination="false"
            :dataSource="data.list"
            ref="actionRef"
            :actionColumn="actionColumn"
            :scroll-x="1500"
          ></BasicTable>
        </template>
        <template #page>
          <page
            :current-page="pageOption?.currentPage"
            :page-size="pageOption?.pageSize"
            :total-page="pageOption?.totalPage"
            :total-count="pageOption?.totalCount"
            @page-change="pageHandle"
            @page-size-change="pageSizeHandle"
          />
        </template>
      </TableListTemplate>
      <Dialog
        v-model:showModal="showModal"
        :option="dialogoption"
        @close="close"
        @confirm="confirm"
      >
        <BasicForm @register="addregister" @submit="addSubmit"> </BasicForm>
      </Dialog>
    </div>
  </template>
  <script setup lang="ts">
  import { h, onMounted, reactive, ref } from "vue";
  import { columns } from "./columns";
  import { BasicTable, TableAction } from "@/components/BasicTable";
  import { BasicForm, FormSchema, useForm } from "@/components/Form/index";
  import TableListTemplate from "@/components/TableListTemplate/index.vue";
  import Dialog from "@/components/dialog/index.vue";
  import page from "@/components/pagination/index.vue";
  import {
    getDeviceTypeList,
    addDeviceType,
    getDeviceTypeInfo,
    UpdateDeviceType,
  } from "@/api/deviceType";
  import type { PaginationType } from "@/components/pagination/index";
  import { AppstoreAddOutlined } from "@vicons/antd";
  const searchData = ref<defaultType.requestList>({});
  const tableData = ref<deviceType.deviceTypeList[]>([]);
  // 新增弹窗显示
  const showModal = ref(false);
  const dialogTitle = ref("");
  // 新增弹窗的变量
  const dialogoption = reactive({
    ConfirmBtnText: "保存",
    title: dialogTitle,
  });
  // 点击新增按钮
  function addTable() {
    showModal.value = true;
    dialogTitle.value = "新增";
    let resdata={
        isEnable:true
    }
    setTimeout(() => {
      setFieldsValue(resdata);
    }, 10);
  }
  // 关闭新增弹窗
  function close() {
    showModal.value = false;
  }
  // 保存新增弹窗
  function confirm() {
    // showModal.value = false;
    submit();
  }
  const addschemas: FormSchema[] = [
    {
      field: "id",
      label: "",
      giProps: {
        span: 0,
      },
    },
    {
      field: "name",
      component: "NInput",
      label: "设备类型",
      componentProps: {
        placeholder: "请输入设备类型",
        onInput: (e: any) => {},
      },
      rules: [{ required: true, message: "请输入设备类型", trigger: ["blur"] }],
    },
    {
      field: "manufacturer",
      component: "NInput",
      label: "厂家",
      componentProps: {
        placeholder: "请输入厂家",
        onInput: (e: any) => {},
      },
    },
    {
      field: "deviceModel",
      component: "NInput",
      label: "设备型号",
      componentProps: {
        placeholder: "请输入设备型号",
        onInput: (e: any) => {},
      },
      rules: [{ required: true, message: "请输入设备型号", trigger: ["blur"] }],
    },
    {
      field: "version",
      component: "NInput",
      label: "版本号",
      componentProps: {
        placeholder: "请输入版本号",
        onInput: (e: any) => {},
      },
    },
    {
      field: "memo",
      component: "NInput",
      label: "备注说明",
      componentProps: {
        placeholder: "请输入备注说明",
        onInput: (e: any) => {},
      },
    },
    {
      field: "isEnable",
      component: "NSwitch",
      label: "是否启用",
      componentProps: {},
    },
  ];
  // 新增表单
  const [addregister, { setFieldsValue, submit, updateSchema }] = useForm({
    gridProps: { cols: 1 },
    collapsedRows: 3,
    labelWidth: 100,
    layout: "horizontal",
    showActionButtonGroup: false,
    schemas: addschemas,
  });
  async function addSubmit(values: Recordable) {
    if (values.id === undefined) {
      // let res = await addDeviceType(values);
      addDeviceType(values).then((res) => {
        showModal.value = false;
        // message.success("新建成功");
        getTableData();
      });
    } else {
      UpdateDeviceType(values).then((res) => {
        showModal.value = false;
        // message.success("编辑成功");
        getTableData();
      });
    }
  }

  const actionColumn = reactive({
    title: "操作",
    key: "action",
    width: 220,
    fixed: "right",
    render(record: Recordable<any>) {
      return h(TableAction as any, {
        style: "text",
        actions: [
          {
            label: "编辑",
            onClick: handleEdit.bind(null, record),
            ifShow: () => {
              return true;
            },
          },
          
        ],
      });
    },
  });
  
  async function handleEdit(record: Recordable) {
    // console.log("点击了编辑用户", record);
    showModal.value = true;
    dialogTitle.value = "编辑";
    let resdata = (await getDeviceTypeInfo(record.id)).Data;
    setTimeout(() => {
      setFieldsValue(resdata);
    }, 10);
  }
  
  // 搜索数据
  const schemas: FormSchema[] = [
    {
      field: "name",
      component: "NInput",
      label: "设备类型名称",
      componentProps: {
        placeholder: "请输入设备类型名称",
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
  ];
  // 搜索参数
  const [register, {}] = useForm({
    gridProps: { cols: "1 s:1 m:2 l:3 xl:4 2xl:4" },
    labelWidth: 120,
    schemas,
  });
  // 搜索查询
  function handleSubmit(values: Recordable) {
    data.selectData.name = values.name;
    getTableData();
  }
  // 搜索重置
  function handleReset(values: Recordable) {
    Object.keys(data.selectData).forEach((key) => {
      if (key !== "currentPage" && key !== "pageSize") {
        console.log(key);
        data.selectData[key] = undefined;
      }
    });
    getTableData();
  }
  // 总页数
  const data = reactive({
    selectData:searchData,
    list:tableData,
  });
  const pageOption = ref<PaginationType>({
    currentPage: 1,
    pageSize: 10,
  });
  const pageHandle = (page: number) => {
    pageOption.value.currentPage = page;
    getTableData();
  };
  const pageSizeHandle = (pageSize: number) => {
    pageOption.value.pageSize = pageSize;
    getTableData();
  };
  onMounted(() => {
    getTableData();
  });
  /**获取列表数据 */
  const getTableData = async () => {
    console.log(data.selectData);
    if (data.selectData) {
      data.selectData.currentPage = pageOption.value?.currentPage;
      data.selectData.pageSize = pageOption.value?.pageSize;
    }
    const Data = (
      await getDeviceTypeList(
        data.selectData ? data.selectData : { ...pageOption.value }
      )
    ).Data;
    data.list = Data.data;
    let pageData: PaginationType = {
      currentPage: Data.currentPage,
      pageSize: Data.pageSize,
      totalCount: Data.totalCount,
      totalPage: Data.totalPage,
    };
    pageOption.value = pageData;
    return Data.data;
  };
  </script>
  <style lang="scss">
  .search {
    margin-bottom: 10px;
  }
  </style>
  