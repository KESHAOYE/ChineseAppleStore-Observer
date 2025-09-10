<template>
  <div>
    <!-- 机型选择 -->
    <div class="main_choose" v-if="selectTypeId != -1">
      <div class="choose_property">
        <span class="tips"
          >机型：<span class="gray">选择你中意的机型</span></span
        >
        <div class="choose_models" v-if="model.models.length > 0">
          <div
            class="models"
            v-for="i in model.models"
            :key="i.name"
            :class="{ model_select: i.id == modelIndex }"
            @click="readSku(i.id, i.name, i.openDate)"
          >
            <span class="model_name">{{ i.name }}</span>
            <span class="model_screen">{{ i.screen }}</span>
          </div>
        </div>
        <el-empty :image-size="50" description="暂无可选机型" v-else />

        <!-- SKU1-一般是颜色 -->
        <span class="tips"
          >外观：<span class="gray">选择你喜欢的颜色</span></span
        >
        <span class="tips" style="margin: 10px 0; font-size: 1em">
          <span>{{ selectInfo.selectColor || "未选择颜色" }}</span>
        </span>

        <div class="colorPicker" v-if="model.skus.length > 0">
          <div
            class="color_ring"
            v-for="i in model.skus"
            :key="i.color"
            :class="{ color_select: i.chineseColor == selectInfo.selectColor }"
          >
            <img
              class="colors"
              :src="i.value"
              @click="createRom(i.id, i.chineseColor)"
            />
          </div>
        </div>
        <el-empty
          :image-size="50"
          description="暂无可选颜色，请先选择机型"
          v-else
        />

        <!-- sku2 存储 -->
        <span class="tips"
          >存储容量：<span class="gray">你要多大的容量？</span></span
        >
        <div class="choose_models Picker" v-if="model.roms.length > 0">
          <div
            class="models rows"
            v-for="(i, key) in model.roms[0]"
            :key="key"
            :class="{ model_select: key == selectInfo.selectRom }"
            @click="generatorSku(i.value, key)"
          >
            <span class="model_name">{{ key }}</span>
            <span class="price">
              <div>RMB {{ Math.ceil(i.price / 24) }}/月或</div>
              <div>RMB{{ i.price }}</div>
            </span>
          </div>
        </div>
        <el-empty
          :image-size="50"
          description="暂无可选容量，请先选择颜色"
          v-else
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useAppStore } from "@/utils/pinia.js";

export default {
  name: "modelPicker",
  props: {
    category: { type: String, default: "iPhone" },
  },
  data() {
    return {
      modelIndex: -1,
      selectInfo: {
        selectModel: "",
        openDate: null,
        selectRom: null,
        selectColor: null,
        selectSku: null,
      },
    };
  },
  computed: {
    ...mapState(useAppStore, ["selectTypeId", "categoryIndex", "model"]),
  },
  watch: {
    selectInfo: {
      deep: true,
      handler(val) {
        this.$emit("updateInfo", val);
      },
    },
    modelIndex(val) {
      if (val === -1) {
        this.changeModel(["skus", "", true]);
        this.changeModel(["roms", "", true]);
      }
    },
  },
  methods: {
    ...mapActions(useAppStore, ["changeModel", "changeNowImage"]),
    // 保存机型，根据机型读取颜色
    readSku(id, name, openDate) {
      this.changeModel(["skus", "", true]);
      this.modelIndex = id;
      this.selectInfo = {
        selectModel: name,
        openDate,
        selectColor: null,
        selectSku: null,
        selectRom: null,
      };
      this.changeNowImage(this.model.models[id].image);
      for (const sid in this.model.models[id].skus) {
        const sku = this.model.models[id].skus[sid];
        this.changeModel(["skus", { id: sid, ...sku }, false]);
        this.changeModel(["roms", "", true]);
      }
    },
    // 保存颜色，根据颜色读取存储
    createRom(id, chinese) {
      this.changeModel(["roms", "", true]);
      this.selectInfo.selectColor = chinese;
      this.selectInfo.selectSku = null;
      this.selectInfo.selectRom = null;
      this.changeNowImage(this.model.models[this.modelIndex].skus[id].image);
      for (const s of this.model.models[this.modelIndex].skus[id].ids) {
        this.changeModel(["roms", s, false]);
      }
    },
    // 生成 sku
    generatorSku(sku, rom) {
      this.selectInfo.selectSku = sku;
      this.selectInfo.selectRom = rom;
    },
  },
  mounted() {
    this.$EventBus.$on("clearInfo", () => {
      this.modelIndex = -1;
      this.selectInfo = {
        selectModel: "",
        selectRom: null,
        selectColor: null,
        selectSku: null,
      };
    });
  },
};
</script>

<style lang="scss" scoped>
.main_choose {
  margin-top: 25px;

  --panel-min: 300px;
  --panel-ideal: 420px;
  --panel-max: 560px;
  --card-ar: 16 / 3;
}

.choose_property {
  inline-size: clamp(var(--panel-min), 34vw, var(--panel-max));
  max-inline-size: 100%;
}

.choose_models,
.choose_models.Picker {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(10px, 1.1vw, 14px);
}

.choose_models > .models,
.choose_models.Picker > .models.rows {
  width: 100% !important;
  box-sizing: border-box;
  border: clamp(1px, 0.12vw, 2px) solid #c9c9c9 !important;
  border-radius: clamp(10px, 0.9vw, 16px);
  padding: clamp(10px, 1.2vw, 18px) clamp(14px, 1.6vw, 22px);
  background: #fff;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: clamp(6px, 0.8vw, 12px);
  line-height: 1.2;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.03);
  transition: border-color 0.15s ease, box-shadow 0.15s ease,
    transform 0.06s ease;

  aspect-ratio: var(--card-ar);
  min-block-size: clamp(50px, 7vw, 110px);
}

.choose_models > .models:hover,
.choose_models.Picker > .models.rows:hover {
  border-color: #8e8e8e !important;
}

.choose_models > .models:active,
.choose_models.Picker > .models.rows:active {
  transform: scale(0.997);
}

.choose_models > .models.model_select,
.choose_models.Picker > .models.rows.model_select {
  border-color: #0071e3 !important;
  box-shadow: 0 0 0 clamp(3px, 0.35vw, 5px) rgba(0, 113, 227, 0.15);
}

.choose_models > .models .model_name,
.choose_models.Picker > .models.rows .model_name {
  margin: 0;
  text-align: left;
  font-weight: 700;
  font-size: clamp(15px, 1.2vw, 22px) !important;
  letter-spacing: 0.01em;
}

.choose_models > .models .model_screen {
  margin: 0;
  justify-self: end;
  color: #4b4b4b;
  font-weight: 500;
  text-align: right;
  font-size: clamp(11px, 1vw, 16px) !important;
}

.choose_models.Picker > .models.rows .price {
  margin: 0;
  float: none;
  text-align: right;
  line-height: 1.2;
  font-size: clamp(11px, 0.95vw, 14px) !important;
}

.colorPicker {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  gap: clamp(8px, 0.9vw, 12px);
  padding: clamp(4px, 0.6vw, 8px) 0;
}

.colorPicker .color_ring {
  width: clamp(28px, 2.6vw, 36px);
  height: clamp(28px, 2.6vw, 36px);
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: box-shadow 0.15s ease, transform 0.06s ease;
}

.colorPicker .color_ring:hover {
  box-shadow: 0 0 0 clamp(1.5px, 0.14vw, 2px) #bfbfbf;
}

.colorPicker .color_ring:active {
  transform: scale(0.97);
}

.colorPicker .color_ring.color_select {
  box-shadow: 0 0 0 clamp(1.5px, 0.14vw, 2px) #0071e3,
    0 0 0 clamp(4px, 0.45vw, 6px) rgba(0, 113, 227, 0.12);
}

.colorPicker .color_ring .colors {
  width: 74%;
  height: 74%;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
}

@media (max-width: 480px) {
  .choose_property {
    inline-size: 100%;
  }
}

@media (min-width: 1600px) {
  .main_choose {
    --panel-ideal: 460px;
    --panel-max: 600px;
    --card-ar: 20 / 3;
  }
}
</style>
