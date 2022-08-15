<template>
    <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        :label-width="100"
        label-placement="left"
        require-mark-placement="left"
    >
        <n-form-item label="接口名称" path="name">
            <n-input v-model:value="formData.name" />
        </n-form-item>
        <n-form-item label="控制器名称" path="controllerName">
            <n-select
                v-model:value="formData.controllerName"
                tag
                filterable
                :options="selectData"
            />
        </n-form-item>
        <n-form-item label="接口函数名" path="actionName">
            <n-input v-model:value="formData.actionName" />
        </n-form-item>
        <n-form-item label="是否检查">
            <n-switch v-model:value="formData.needCheck" />
        </n-form-item>
        <n-form-item label="是否启用">
            <n-switch v-model:value="formData.isEnable" />
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
import { Ref, ref, watch } from "vue";
import type { FormRules, FormInst, SelectOption } from "naive-ui";
interface form {
    id?: string;
    formInfo?: Ref<formData>;
    selectData: SelectOption[];
}
interface formData {
    id?: string;
    name?: string;
    controllerName?: string;
    actionName?: string;
    needCheck?: boolean;
    isEnable?: boolean;
}
let formRef: Ref<FormInst | null> = ref(null);
let props = defineProps<form>();
let formData: Ref<formData> = ref({
    isHidden: false,
    isEnable: true,
});
const rules: FormRules = {
    name: {
        required: true,
        message: "请输入接口名称",
        trigger: "blur",
    },
    controllerName: {
        required: true,
        message: "请选择控制器",
        trigger: "blur",
    },
    actionName: {
        required: true,
        message: "请输入接口函数名",
        trigger: "blur",
    },
};
if (props.formInfo) {
    formData.value = props.formInfo as formData;
}
watch(
    () => props,
    (nowProps) => {
        console.log(nowProps.formInfo);
        formData.value = nowProps.formInfo as formData;
    },
    { deep: true }
);
</script>
<style lang="scss" scoped></style>
