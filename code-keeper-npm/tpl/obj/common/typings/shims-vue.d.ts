declare module '*.vue' {
  import Vue from 'vue';

  export default Vue;
}

interface H3Utils {
  // 此接口为示例，应从node_modules中导入
}

declare module 'vue/types/vue' {
  interface Vue {
    $utils: H3Utils;
  }
}
