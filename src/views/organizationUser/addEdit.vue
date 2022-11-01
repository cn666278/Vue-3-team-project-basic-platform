<template>
    <n-form ref="formRef" :model="formData" :rules="rules" :label-width="100" label-placement="left" require-mark-placement="left">
        <n-form-item label="姓名" path="nick">
            <n-input v-model:value="formData.nick" placeholder="请输入姓名" />
        </n-form-item>
        <n-form-item label="手机号" path="phone">
            <n-input v-model:value="formData.phone" placeholder="请输入手机号" />
        </n-form-item>
        <n-form-item label="身份证号" path="idCard">
            <n-input v-model:value="formData.idCard" placeholder="请输入身份证号" />
        </n-form-item>
        <n-form-item label="电子邮箱" path="email">
            <n-input v-model:value="formData.email" placeholder="请输入电子邮箱" />
        </n-form-item>
        <n-form-item label="部门" path="department">
            <n-select v-model:value="department" :options="departmentData" label-field="name" value-field="id" @update:value="getSelect" />
        </n-form-item>
        <n-form-item label="职位" path="dpId">
            <n-tree-select
                v-model:value="formData.dpId"
                :options="positionData"
                key-field="dpId"
                label-field="positionName"
                default-expand-all
                :virtual-scroll="false"
            />
        </n-form-item>
        <n-form-item label="性别" path="sex">
            <n-radio-group v-model:value="formData.sex" name="100">
                <n-space>
                    <n-radio v-for="song in radioOptions" :key="song.id" :value="song.id">
                        {{ song.name }}
                    </n-radio>
                </n-space>
            </n-radio-group>
        </n-form-item>
        <n-form-item label="头像" path="img">
            <n-upload :default-upload="false" :show-file-list="false" :on-change="getChange">
                <n-button>上传头像</n-button>
            </n-upload>
        </n-form-item>
        <n-form-item label="预览图片" path="img">
            <n-image width="100" :src="imgUrl" />
        </n-form-item>
        <n-row :gutter="[0, 24]">
            <n-col :span="24">
                <n-space justify="end">
                    <slot name="submit" :iconsFile="iconsFile" :formData="formData" :validate="formRef?.validate"></slot>
                </n-space>
            </n-col>
        </n-row>
    </n-form>
</template>
<script setup lang="ts">
import { onMounted, Ref, ref, watch } from 'vue';
import type { FormRules, FormInst } from 'naive-ui';
import { GetDepartmentList } from '@/api/department';
import { GetDepartmentPositionByDepartmentId } from '@/api/departmentBindPosition';

interface form {
    formInfo?: FormData;
}
interface FormData {
    id?: string;
    phone?: string;
    nick?: string;
    dpId?: string;
    idCard?: string;
    img?: string;
    sex?: number;
    email?: string;
    departmentPosition?: any;
}

onMounted(() => {
    getDepartmentTableData();
});

let department = ref(null);
let departmentData = ref<any>([]);
let positionData = ref<any>([]);

// 获取部门职位列表
const getDepartmentTableData = async () => {
    departmentData.value = (
        await GetDepartmentList({
            name: '',
            currentPage: 1,
            pageSize: 9999,
        })
    ).Data.data;
};

// 选择部门事件
const getSelect = async (value: string) => {
    positionData.value = (await GetDepartmentPositionByDepartmentId(value)).Data;
};

let props = defineProps<form>();

// 性别数据
const radioOptions = [
    {
        id: 1,
        name: '男',
    },
    {
        id: 2,
        name: '女',
    },
];

// 自定义上传附件变量
let iconsFile = ref();

let formRef: Ref<FormInst | null> = ref(null);
let formData: Ref<FormData> = ref({});

// 上传的图片预览
let imgUrl: Ref<string | undefined> = ref('');

// 上传附件
const getChange = (row: any) => {
    console.log(row);
    iconsFile.value = [row.file];
    const reader = new FileReader();
    reader.readAsDataURL(row.file.file);
    reader.onload = (e: any) => {
        imgUrl.value = e.target.result;
    };
};

const rules: FormRules = {
    nick: {
        required: true,
        message: '请输入姓名',
        trigger: 'blur',
    },
    phone: {
        required: true,
        message: '请输入专家职位',
        trigger: 'blur',
    },
};

if (props.formInfo) {
    formData.value = JSON.parse(JSON.stringify(props.formInfo)) as FormData;
    imgUrl.value = props.formInfo.img as string;
    if (props.formInfo && props.formInfo.departmentPosition) {
        department.value = props.formInfo.departmentPosition.departmentId;
        getSelect(props.formInfo.departmentPosition.departmentId);
        formData.value.dpId = props.formInfo.departmentPosition.dpId;
    }
}
watch(
    () => props,
    (nowProps) => {
        formData.value = nowProps.formInfo as FormData;
        if (nowProps.formInfo && nowProps.formInfo.img) {
            imgUrl.value = import.meta.env.VITE_BASE_URL + nowProps.formInfo.img;
        }
        // department.value = nowProps.formInfo?.departmentPosition.departmentId;
        // formData.value.dpId = nowProps.formInfo?.departmentPosition.dpId;
    },
    { deep: true }
);
</script>
<style lang="scss" scoped></style>
