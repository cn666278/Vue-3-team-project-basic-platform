<template>
    <div>
      <TableListTemplate>
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
            :scroll-x="1500"
          ></BasicTable>
        </template>
        <template #page>
          <!-- <page
            :current-page="pageOption?.currentPage"
            :page-size="pageOption?.pageSize"
            @page-change="pageHandle"
            @page-size-change="pageSizeHandle"
            simple
          /> -->
          <n-pagination
            :page="pageOption?.currentPage"
            :page-size="pageOption?.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :page-count="100"
            @update-page="pageHandle"
            show-size-picker
            show-quick-jumper
            @update-page-size="pageSizeHandle"
            simple
          />
        </template>
      </TableListTemplate>
    </div>
  </template>
  <script setup lang="ts">
  import { h, onMounted, reactive, ref } from "vue";
  import { BasicTable } from "@/components/BasicTable";
  import { BasicForm, FormSchema, useForm } from "@/components/Form/index";
  import TableListTemplate from "@/components/TableListTemplate/index.vue";
  import { getExceptionList } from "@/api/interfaceLog";
  import type { PaginationType } from "@/components/pagination/index";
  import { formatDateTime } from "@/utils/common";
  import moment from "moment";
  const searchData = ref<Exception.Exceptiondata>({});
  const tableData = ref<Exception.ExceptionList[]>([]);
  const beginDate = ref();
  const endDate = ref();
  const columns: any[] = [
    {
      title: "来源",
      key: "source",
      width: 130,
    },
    {
      title: "异常信息",
      key: "exception",
      width: 120,
    },
    {
      title: "发生时间",
      key: "createDate",
      width: 200,
      render(row: { createDate: any }) {
        return formatDateTime(row.createDate);
      },
    },
  ];
  // 搜索数据
  const schemas: FormSchema[] = [
    {
      field: "exception",
      component: "NInput",
      label: "异常信息",
      componentProps: {
        placeholder: "请输入异常信息",
      },
    },
    {
      field: "beginTime",
      component: "NDatePicker",
      label: "开始时间",
      componentProps: {
        type: "datetime",
        format: "yyyy-MM-dd HH:mm:ss",
        defaultFormattedValue: beginDate,
        clearable: true,
        onUpdateFormattedValue: (e: any) => {
          data.selectData.beginTime = e;
        },
      },
    },
    {
      field: "endTime",
      component: "NDatePicker",
      label: "结束时间",
      componentProps: {
        type: "datetime",
        defaultFormattedValue: endDate,
        format: "yyyy-MM-dd HH:mm:ss",
        clearable: true,
        onUpdateFormattedValue: (e: any) => {
          data.selectData.endTime = e;
        },
      },
    },
  ];
  
  // 搜索参数
  const [register, { setFieldsValue }] = useForm({
    gridProps: { cols: "1 s:1 m:2 l:3 xl:4 2xl:4" },
    labelWidth: 90,
    schemas,
  });
  // 搜索查询
  function handleSubmit(values: Recordable) {
    data.selectData.exception = values.exception;
    getTableData();
  }
  // 搜索重置
  function handleReset(values: Recordable) {
    Object.keys(data.selectData).forEach((key) => {
      if (key !== "currentPage" && key !== "pageSize") {
        data.selectData[key] = undefined;
      }
    });
    getTableData();
  }
  // 总页数
  const data = reactive({
    selectData: searchData,
    list: tableData,
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
    beginDate.value = moment().format("YYYY-MM-DD 00:00:00");
    endDate.value = moment().format("YYYY-MM-DD 23:59:59");
    setTimeout(() => {
      data.selectData.beginTime = beginDate.value;
      data.selectData.endTime = endDate.value;
      getTableData();
    }, 10);
  });
  /**获取列表数据 */
  const getTableData = async () => {
    console.log(data.selectData);
    if (data.selectData) {
      data.selectData.currentPage = pageOption.value?.currentPage;
      data.selectData.pageSize = pageOption.value?.pageSize;
    }
    const Data = (
      await getExceptionList(
        data.selectData ? data.selectData : { ...pageOption.value }
      )
    ).Data;
    data.list = Data;
    let pageData: PaginationType = {
      currentPage: pageOption.value?.currentPage,
      pageSize: pageOption.value?.pageSize,
    };
    pageOption.value = pageData;
    return Data;
  };
  </script>
  <style lang="scss">
  .search {
    margin-bottom: 10px;
  }
  </style>
  