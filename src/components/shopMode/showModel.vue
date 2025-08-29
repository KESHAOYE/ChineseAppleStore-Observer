<template>
  <figure class="show_phone">
    <img :src="nowImage" alt="机型预览图" loading="lazy" decoding="async" />
  </figure>
</template>

<script>
import { mapState } from "pinia";
import { useAppStore } from "@/utils/pinia.js";

export default {
  name: "ShowModel",
  computed: {
    ...mapState(useAppStore, ["nowImage"]),
  },
};
</script>

<style lang="scss" scoped>
.show_phone {
  /* 居中承载容器 */
  display: grid;
  place-items: center;
  padding: clamp(8px, 2vw, 24px);
  min-width: 0 !important; /* 防止撑爆父级列 */
  overflow: hidden;
}

/* 图片自适应、不裁切、不变形；在大屏上也不过分巨大 */
.show_phone img {
  width: clamp(260px, 60vw, 1280px); /* 小屏不太小，大屏不太大 */
  max-width: 100%; /* 列宽优先 */
  height: auto; /* 保持比例 */
  max-height: min(72vh, 1080px); /* 视口高度约束，兼顾 4K */
  object-fit: contain; /* 不裁切内容 */
  border-radius: 18px;
  image-rendering: auto; /* 高分屏渲染更锐利 */
  -webkit-user-drag: none;
  user-select: none;
}
</style>
