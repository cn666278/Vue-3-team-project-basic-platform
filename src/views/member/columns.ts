import { h } from 'vue';
import { NAvatar,NTag } from 'naive-ui';

export const columns:any[] = [
  {
    title: '用户名',
    key: 'account'
  },
  {
    title: '名称',
    key: 'nick'
  },
  {
    title: '角色',
    key: 'roleName'
  },
  {
    title: '手机号',
    key: 'phone'
  },
  {
    title: '创建日期',
    key: 'createDate'
  },
  {
    title: '是否后台',
    key: 'isAdmin'
  },
  {
    title: '是否启用',
    key: 'isEnable',
    render(row: { isEnable: any; }) {
      return h(
        NTag,
        {
          type: row.isEnable ? 'success' : 'error',
        },
        {
          default: () => (row.isEnable ? '启用' : '禁用'),
        }
      );
    },
  },
];
