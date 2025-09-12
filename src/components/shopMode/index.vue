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
:deep(.el-tabs__content) {
  overflow: visible !important;
}
:deep(.el-tab-pane) {
  overflow: visible !important;
}

.container {
  width: clamp(1015px, 96vw, 3820px);
  margin: 0 auto;
  padding: 0 clamp(12px, 2vw, 24px);
  box-sizing: border-box;
  --sticky-top: clamp(64px, 8vh, 110px);
}

.head {
  margin: clamp(8px, 1.5vh, 16px) 0 clamp(10px, 1.8vh, 20px);
}

.content {
  --grid-gap: clamp(16px, 2vw, 32px);
  display: grid;
  gap: var(--grid-gap);
  grid-template-columns: minmax(420px, calc(100% - 360px - var(--grid-gap))) minmax(
      360px,
      580px
    );
  align-items: start;
}

.left_content,
.right_content {
  min-width: 0;
}
.left_content {
  position: -webkit-sticky;
  position: sticky;
  top: var(--sticky-top, clamp(64px, 8vh, 110px));
  z-index: 0;
  overflow: visible;
}
.right_content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 580px;
}

@media (max-width: 1280px) and (min-width: 1015px) {
  .content {
    grid-template-columns: minmax(380px, calc(100% - 340px - var(--grid-gap))) minmax(
        320px,
        340px
      );
  }
  .right_content {
    max-width: 340px;
  }
}

@media (min-width: 1600px) {
  .content {
    grid-template-columns:
      minmax(420px, calc((100% - 580px - var(--grid-gap)) * 0.8))
      minmax(360px, 580px);
  }
}

@media (min-width: 2200px) {
  .right_content {
    max-width: 620px;
  }
}
</style>
