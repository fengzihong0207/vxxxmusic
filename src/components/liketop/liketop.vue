<template>
  <div class="liketop">
    <van-nav-bar
      :title="title"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
  </div>
</template>

<script>
export default {
  name: "Liketop",
  props: {
    title: "",
  },
  methods: {
    onClickLeft() {
        this.$router.go(-1)
    },
  },
};
</script>

<style lang="less" scoped>
.van-nav-bar__title{
    font-size: 16px;
}
/deep/.van-nav-bar__left{
    .van-icon,.van-nav-bar__text{
        color: #ff0033;
    }
}
</style>