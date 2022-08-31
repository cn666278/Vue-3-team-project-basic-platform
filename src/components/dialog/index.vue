<template>
  <div>
    <n-modal
      v-model:show="showModal"
      :show-icon="false"
      preset="dialog"
      :title="dialogTitle"
      @on-after-leave="handleClose"
      :style="{
        width: props.width,
      }"
    >
      <slot> </slot>
      <template #action>
        <n-space>
          <n-button @click="handleClose">取消</n-button>
          <n-button type="primary" @click="onConfirm">{{
            ConfirmBtnText
          }}</n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, isRef, ref } from "vue";
const props = defineProps({
  showModal: {
    type: Boolean,
    default: false,
  },
  //   title: {
  //     type: String,
  //     default: "",
  //   },
  width: {
    type: String,
    default: "600px",
  },
  option: {
    type: Object,
    default: {
      //可传递其他值
    },
  },
});
const ConfirmBtnText = computed(() => {
  return props.option.ConfirmBtnText || "确定";
});
const dialogTitle = computed(() => {
  return props.option.title || "标题";
});
// 双向绑定
const modelValue = computed({
  get: () => props.showModal,
  set: () => emits("close"), 
});
const showModal = isRef(props.showModal) ? props.showModal : modelValue;
// 子传父
const emits = defineEmits(["close", "confirm"]);

// 关闭对话框
const handleClose = () => {
  showModal.value = false;
  emits("close", false);
};
// 保存对话框
const onConfirm = () => {
  //   showModal.value = false;
  emits("confirm", false);
};
</script>

<style lang="scss" scoped></style>
