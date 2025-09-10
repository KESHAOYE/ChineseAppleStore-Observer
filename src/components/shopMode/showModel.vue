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
  display: grid;
  place-items: center;
  padding: clamp(8px, 2vw, 24px);
  min-width: 0 !important;
  overflow: hidden;
}

.show_phone img {
  width: clamp(260px, 60vw, 1280px);
  max-width: 100%;
  height: auto;
  max-height: min(72vh, 1080px);
  object-fit: contain;
  border-radius: 18px;
  image-rendering: auto;
  -webkit-user-drag: none;
  user-select: none;
}
</style>
