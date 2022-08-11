<template>
    <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        :label-width="100"
        label-placement="left"
        require-mark-placement="left"
    >
        <n-form-item label="父级菜单" path="pId">
            <n-tree-select
                v-model:value="formData.pid"
                :options="menuTree"
                key-field="id"
                label-field="title"
                default-expand-all
                :virtual-scroll="false"
            />
        </n-form-item>
        <n-form-item label="菜单名称" path="title">
            <n-input v-model:value="formData.title" />
        </n-form-item>
        <n-form-item label="跳转地址" path="url">
            <n-input v-model:value="formData.url" />
        </n-form-item>
        <n-form-item label="组件地址" path="webComponent">
            <n-input v-model:value="formData.webComponent" />
        </n-form-item>
        <n-form-item label="菜单图标">
            <n-input v-model:value="formData.icon" />
        </n-form-item>
        <n-form-item label="是否启用">
            <n-switch v-model:value="formData.isEnable" />
        </n-form-item>
        <n-form-item label="是否显示">
            <n-switch v-model:value="formData.isHidden" />
        </n-form-item>
        <n-form-item label="是否需要授权">
            <n-switch v-model:value="formData.needAuth" />
        </n-form-item>
        <n-form-item label="排序">
            <n-input-number v-model:value="formData.sort" />
        </n-form-item>
        <n-row :gutter="[0, 24]">
            <n-col :span="24">
                <n-space justify="end">
                    <slot
                        name="submit"
                        :formData="formData"
                        :validate="formRef?.validate"
                    ></slot>
                </n-space>
            </n-col>
        </n-row>
    </n-form>
</template>
<script setup lang="ts">
import { onMounted, Ref, ref, watch } from "vue";
import type { FormRules, FormInst, TreeSelectOption } from "naive-ui";
interface form {
    id?: string;
    formInfo?: Ref<formData>;
    menuTree: TreeSelectOption[];
}
interface formData {
    id?: string;
    pid?: string;
    title?: string;
    webComponent?: string;
    url?: string;
    icon?: string;
    sort?: number;
    isHidden?: boolean;
    isEnable?: boolean;
    needAuth?: boolean;
}
// interface formData {
//     id?: string;
//     pid?: string;
//     webName?: string;
//     webComponent?: string;
//     webPath?: string;
//     icon?: string;
//     sort?: number;
//     isHidden?: boolean;
//     isEnable?: boolean;
//     needAuth?: boolean;
// }
let formRef: Ref<FormInst | null> = ref(null);
let props = defineProps<form>();
let formData: Ref<formData> = ref({
    isHidden: false,
    isEnable: true,
});
const rules: FormRules = {
    title: {
        required: true,
        message: "请输入菜单名称",
        trigger: "blur",
    },
    url: {
        required: true,
        message: "请输入跳转地址",
        trigger: "blur",
    },
    component: {
        required: true,
        message: "请输入组件地址",
        trigger: "blur",
    },
};
if(props.formInfo) {
    formData.value = props.formInfo as formData;
}
watch(
    () => props,
    (nowProps) => {
        console.log(nowProps.formInfo);
        formData.value = nowProps.formInfo as formData;
    },
    {deep: true}
)
</script>
<style lang="scss" scoped></style>
