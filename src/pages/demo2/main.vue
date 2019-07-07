<template>
  <div>
    <h2>demo2/index</h2>
    <h2>跳转测试</h2>
    <ul>
      <li><a href="../demo1/aa/index.html#/">demo1/a/index.html#/</a></li>
      <li><a href="../demo1/aa/index.html#/extra">demo1/a/index.html#/extra</a></li>
      <li><a href="../demo1/bb/index.html">demo1/b/index.html</a></li>
      <li><a href="../demo2/index.html">demo2/index.html</a></li>
      <li><a href="../demo3/cc/index.html">demo3/c/index.html</a></li>
      <li><a href="../demo3/dd/ee/index.html">demo3/d/e/index.html</a></li>
      <li><a href="../demo3/dd/ff/index.html">demo3/d/f/index.html</a></li>
    </ul>
    <br>
    <br>
    <br>
    <div class="logo"></div>
  </div>
</template>

<script>
  export default {
    name: 'index',
    methods: {
      go() {
        location.assign('./list.html');
      }
    }
  };
</script>

<style scoped lang="less">
  @import "style/index.less";
</style>
