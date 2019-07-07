<!-- 基础目录组件，用于渲染路由页面 -->
<template>
  <div>
    <h2>{{ msg }}</h2>
    <Base/>
  </div>
</template>

<style scoped>
  /*  style标签之内会被作为css进行处理，所以需要使用css的注释形式   */
  /*  加上scoped可以将css的作用效果限定在该组件之内 */
</style>

<script>
  import Base from './components/base';

  export default {
    components: { Base },
    data: function () {
      return {
        msg: location.pathname
      };
    }
  };
</script>
