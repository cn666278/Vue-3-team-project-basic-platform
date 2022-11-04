<template>
    <n-form ref="formRef" :model="formData" :rules="rules" :label-width="100" label-placement="left" require-mark-placement="left">
        <n-form-item label="新密码" path="newPwd">
            <n-input v-model:value="formData.newPwd" placeholder="请输入新密码" />
        </n-form-item>
        <n-row :gutter="[0, 24]">
            <n-col :span="24">
                <n-space justify="end">
                    <slot name="submit" :formData="formData" :validate="formRef?.validate"></slot>
                </n-space>
            </n-col>
        </n-row>
    </n-form>
</template>
<script setup lang="ts">
import { onMounted, Ref, ref, watch } from 'vue';
import type { FormRules, FormInst } from 'naive-ui';
interface form {
    editId?: string;
}
interface FormData {
    id?: string;
    newPwd?: string;
}
let props = defineProps<form>();

let formRef: Ref<FormInst | null> = ref(null);
let formData: Ref<FormData> = ref({});

const rules: FormRules = {
    newPwd: {
        required: true,
        message: '请输入新密码',
        trigger: 'blur',
    },
};

if (props.editId) {
    formData.value.id = props.editId;
}
watch(
    () => props,
    (nowProps) => {
        formData.value.id = nowProps.editId as string;
    },
    { deep: true }
);
</script>
<style lang="scss" scoped></style>
