<template>
    <div style="border: 1px solid #ccc; margin-top: 10px; z-index: 1">
        <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" style="border-bottom: 1px solid #ccc" />
        <Editor
            :defaultConfig="editorConfig"
            :mode="mode"
            v-model="valueHtml"
            style="height: 350px; overflow-y: hidden"
            @onCreated="handleCreated"
            @onChange="handleChange"
            @onDestroyed="handleDestroyed"
            @onFocus="handleFocus"
            @onBlur="handleBlur"
            @customAlert="customAlert"
            @customPaste="customPaste"
        />
    </div>
</template>

<script>
import '@wangeditor/editor/dist/css/style.css';
import { onBeforeUnmount, ref, shallowRef, onMounted, defineEmits, watch } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
// import { IEditorConfig } from '@wangeditor/editor';

export default {
    components: { Editor, Toolbar },
    props: {
        modelValue: {
            type: null,
            default: () => {
                return null;
            },
        },
    },
    setup(props, { emit }) {
        // 编辑器实例，必须用 shallowRef，重要！
        const editorRef = shallowRef();

        // 内容 HTML
        const valueHtml = ref('<p></p>');

        // 模拟 ajax 异步获取内容
        onMounted(() => {
            console.log(props);
            valueHtml.value = props.textData;
        });

        const toolbarConfig = {};
        const editorConfig = {
            placeholder: '请输入内容...',
            MENU_CONF: {},
        };

        // 组件销毁时，也及时销毁编辑器，重要！
        onBeforeUnmount(() => {
            const editor = editorRef.value;
            if (editor == null) return;

            editor.destroy();
        });

        // 上传配置
        editorConfig.MENU_CONF['uploadImage'] = {
            // 上传地址
            server: '/api/upload',

            base64LimitSize: 5 * 1024, // 5kb

            customUpload(file, insertFn) {
                console.log('customUpload', file);
                const reader = new FileReader();
                console.log(reader);
                reader.readAsDataURL(file);
                reader.onload = (e) => {
                    insertFn(e.target.result);
                };
            },
        };

        // 编辑器回调函数
        const handleCreated = (editor) => {
            console.log('created', editor);
            console.log(props);
            editorRef.value = editor; // 记录 editor 实例，重要！
        };
        const handleChange = (editor) => {
            console.log('change:', editor.getHtml());
            emit('update:modelValue', editor.getHtml());
        };
        const handleDestroyed = (editor) => {
            console.log('destroyed', editor);
        };
        const handleFocus = (editor) => {
            console.log('focus', editor);
        };
        const handleBlur = (editor) => {
            console.log('blur', editor);
        };
        const customAlert = (info, type) => {
            alert(`【自定义提示】${type} - ${info}`);
        };
        const customPaste = (editor, event, callback) => {
            console.log('ClipboardEvent 粘贴事件对象', event);

            // 自定义插入内容
            editor.insertText('xxx');

            // 返回值（注意，vue 事件的返回值，不能用 return）
            callback(false); // 返回 false ，阻止默认粘贴行为
            // callback(true) // 返回 true ，继续默认的粘贴行为
        };

        // 如果父组件传过来的数据是异步获取的，则需要进行监听
        watch(
            () => props.modelValue,
            () => {
                valueHtml.value = props.modelValue;
            }
        );

        return {
            editorRef,
            mode: 'default',
            valueHtml,
            toolbarConfig,
            editorConfig,
            handleCreated,
            handleChange,
            handleDestroyed,
            handleFocus,
            handleBlur,
            customAlert,
            customPaste,
        };
    },
};
</script>
