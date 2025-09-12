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
  width: clamp(320px, 48vw, 1400px);
  max-width: 100%;
  height: 500px;
  max-height: min(72vh, 1080px);
  object-fit: cover;
  border-radius: 18px;
  image-rendering: auto;
  -webkit-user-drag: none;
  user-select: none;
}

@media (max-width: 1280px) {
  .show_phone img {
    width: clamp(260px, 82vw, 1200px);
    max-height: min(60vh, 900px);
  }
}
</style>
