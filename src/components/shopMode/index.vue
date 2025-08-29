<template>
  <div class="container" ref="container">
    <el-tabs @tab-click="handleClick">
      <el-tab-pane
        v-for="item in category"
        :key="item.category"
        :label="item.category"
        :name="String(item.id)"
      >
        <div class="head">
          <modelPicker />
        </div>

        <div class="content">
          <!-- 左：固定并垂直居中 -->
          <section class="left_content">
            <showModel />
          </section>

          <!-- 右：正常滚动 -->
          <aside class="right_content">
            <skuPicker @updateInfo="updateModel" />
            <cityPicker @updateInfo="updateStore" v-if="selectTypeId != -1" />
            <submit
              :modelInfo="selectInfo"
              :storeInfo="storeInfo"
              v-if="selectTypeId != -1"
            />
            <taskList />
            <setting />
          </aside>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useAppStore } from "@/utils/pinia.js";

import { SKU } from "../../data/model";
import modelPicker from "./modelPicker.vue";
import cityPicker from "./cityAndStorePicker.vue";
import skuPicker from "./skuPicker.vue";
import showModel from "./showModel.vue";
import submit from "./submit.vue";
import taskList from "../dialog/taskList.vue";
import setting from "../dialog/setting/index.vue";

export default {
  name: "categorySelect",
  components: {
    modelPicker,
    cityPicker,
    submit,
    taskList,
    showModel,
    skuPicker,
    setting,
  },
  data() {
    return {
      category: [],
      nowCategory: null,
      selectInfo: {
        selectColor: null,
        selectModel: null,
        selectRom: null,
        selectSku: null,
      },
      storeInfo: {
        city: null,
        province: null,
        id: null,
        label: null,
        value: null,
      },
    };
  },
  computed: {
    ...mapState(useAppStore, ["selectTypeId", "categoryIndex"]),
  },
  methods: {
    ...mapActions(useAppStore, ["changeCategoryIndex"]),

    readCategory() {
      let count = 0;
      for (const i of SKU) {
        this.category.push({
          id: count++,
          category: i.category,
          chinese: i.chinese,
        });
      }
    },
    handleClick(tab) {
      this.nowCategory = Number(tab.name);
      this.changeCategoryIndex(this.nowCategory);
      this.updateStickyTop();
    },
    updateModel(e) {
      this.selectInfo = e;
    },
    updateStore(e) {
      this.storeInfo = e;
    },
    updateStickyTop() {
      this.$nextTick(() => {
        const tabsHeader = this.$el.querySelector(".el-tabs__header");
        const head = this.$el.querySelector(".head");
        const top =
          (tabsHeader?.offsetHeight || 0) + (head?.offsetHeight || 0) + 12;
        this.$refs.container?.style.setProperty("--sticky-top", `${top}px`);
      });
    },
  },
  mounted() {
    this.readCategory();
    this.changeCategoryIndex(0);
    this.updateStickyTop();
    window.addEventListener("resize", this.updateStickyTop);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updateStickyTop);
  },
};
</script>

<style lang="scss" scoped>
/* 让 sticky 可工作（el-tabs 默认 overflow 会破坏 sticky） */
:deep(.el-tabs__content) {
  overflow: visible !important;
}
:deep(.el-tab-pane) {
  overflow: visible !important;
}

/* 两列自适应：左图 / 右侧面板（不再相互覆盖） */
.content {
  display: grid;
  grid-template-columns: minmax(300px, 1fr) minmax(320px, 580px);
  gap: clamp(16px, 2vw, 32px);
  align-items: start;
}
.left_content,
.right_content {
  min-width: 0;
}

.left_content {
  position: -webkit-sticky;
  position: sticky;
  top: clamp(64px, 8vh, 110px);
  z-index: 0;
  overflow: visible;
}

.right_content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 580px;
}

/* 窄屏改为上下布局 */
@media (max-width: 1200px) {
  .content {
    grid-template-columns: 1fr;
  }
  .left_content {
    position: static;
    margin-bottom: 12px;
  }
  .right_content {
    max-width: 100%;
  }
}
</style>
