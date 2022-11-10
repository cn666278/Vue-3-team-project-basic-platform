<template>
    <n-form
        label-placement="left"
        label-width="auto"
        :show-feedback="false"
        size="small"
    >
        <n-grid
            cols="1 s:1 m:1 l:2 xl:3 2xl:3"
            responsive="screen"
            :x-gap="10"
            :y-gap="10"
        >
            <n-form-item-gi
                v-for="(form, index) in propsData?.formData"
                :key="index"
                :label="form.label"
                :span="form.type == 'radio' || form.type == 'check'  ? 2 : 1"
            >
                <component
                    :is="componentNameFormat(form)"
                    v-model:value="form.value"
                    v-bind="propsFormat(form)"
                >
                    <template
                        v-for="(item, itemIndex) in form.props.options"
                        :key="itemIndex"
                    >
                        <n-radio
                            v-if="form.type === 'radio'"
                            :label="item.label"
                            :value="item.value"
                        />
                        <n-checkbox
                            v-if="form.type === 'check'"
                            :label="item.label"
                            :value="item.value"
                        />
                    </template>
                    <template v-if="form.type != 'radio' && form.type != 'check'" #suffix>
                        <n-checkbox
                            v-model:checked="form.isEnable"
                        ></n-checkbox>
                    </template>
                </component>
            </n-form-item-gi>
        </n-grid>
    </n-form>
</template>
<script setup lang="ts">
import { ref } from "vue";
interface Props {
    formData?: formData[];
}
interface formData {
    name: string;
    label: string;
    type: "string" | "number" | "radio" | "check";
    value: string | number | string | number[];
    props?: any;
    isEnable?: boolean;
}
const props = defineProps<Props>();
const propsData = ref<Props>(props);
const emit = defineEmits(["getCommandParam"]);
const componentNameFormat = (data: formData) => {
    if (data.type == "number") {
        return "NInputNumber";
    } else if (data.type == "radio") {
        return "NRadioGroup";
    } else if (data.type == "check") {
        return "NCheckboxGroup";
    } else {
        return "NInput";
    }
};
const propsFormat = (data: formData) => {
    if (data.type == "number") {
        return {
            showButton: false,
            ...data.props,
        };
    } else if (data.type == "radio" || data.type == 'check') {
        return data.props;
    } else {
        return data.props;
    }
};
const getFormData = () => {
    let data = {};
    propsData.value.formData?.forEach((item) => {
        if (item.type == "radio" || item.type == "check" || item.isEnable) data[item.name] = item.value;
    });
    emit("getCommandParam", { ...data });
};
defineExpose({ getFormData });
</script>
<style lang="scss" scoped></style>
