<template>
  <div>
    <!-- 机型选择 -->
    <!-- 选择品类 -->
    <div class="choose_model">
      <div
        class="types"
        :class="{ type_select: i.id == selectTypeId }"
        v-for="i in type"
        :key="i.name"
        @click="readModel(i.id)"
      >
        <img class="type_icon" :src="i.icon" />
        <span class="type_name">{{ i.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useAppStore } from "@/utils/pinia.js";

import { SKU } from "../../data/model";
export default {
  name: "modelPicker",
  data() {
    return {
      type: [],
    };
  },
  computed: {
    ...mapState(useAppStore, ["selectTypeId", "categoryIndex"]),
  },
  methods: {
    ...mapActions(useAppStore, [
      "changeModel",
      "changeSelectTypeId",
      "changeNowImage",
    ]),

    // 根据品类ID读取机型系列
    readType() {
      if (this.categoryIndex != -1) {
        for (let id in SKU[this.categoryIndex].model) {
          let type = SKU[this.categoryIndex].model[id];
          if (type.use) {
            this.type.push({
              id: id,
              name: type.name,
              icon: type.icon,
              openDate: type.openDate,
            });
          }
        }
        this.$EventBus.$emit("clearInfo");
        this.changeNowImage(
          "https://www.apple.com.cn/newsroom/images/apple-logo_black.jpg.landing-big.jpg"
        );
        this.changeModel(["roms", "", true]);
      } else {
        this.$message({
          message: "出现未知错误!",
          type: "error",
          duration: 1500,
        });
      }
    },
    readModel(id) {
      this.changeModel(["models", "", true]);
      this.changeModel(["skus", "", true]);
      this.changeModel(["roms", "", true]);
      this.changeSelectTypeId(id);
      for (let mid in SKU[this.categoryIndex].model[id].children) {
        let model = SKU[this.categoryIndex].model[id].children[mid];
        this.changeModel([
          "models",
          {
            id: mid,
            openDate: SKU[this.categoryIndex].model[id].openDate,
            ...model,
          },
          false,
        ]);
        this.changeNowImage(
          SKU[this.categoryIndex].model[id].children[0].image
        );
      }
      this.$EventBus.$emit("clearInfo");
    },
  },
  mounted() {
    this.readType();
    this.readModel(0);
  },
};
</script>

<style lang="scss" scoped>
.choose_model {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  transition: 0.5s;
  cursor: pointer;
  border-bottom: 1px solid #f6f6f6;
  margin-bottom: 15px;
  .types {
    width: 100px;
    height: 120px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    font-size: 0.8em;
    .type_icon {
      width: 47px;
      height: 80px;
      display: block;
      margin-bottom: 5px;
      background-size: 40px 50px;
    }
    &:hover {
      color: rgb(40, 136, 232);
    }
  }
  .type_select {
    color: rgb(40, 136, 232);
  }
}
.image_slot {
  width: 100%;
  min-width: 700px;
  max-height: 1200px;
  padding: 1% 5%;
}
.main_choose {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  align-items: center;
  .show_phone {
    width: calc(100% - 10% - 550px);
    padding: 1% 5%;
    min-width: 700px;
    min-height: 400px;
  }
  .choose_property {
    width: 550px;
    min-width: 550px;
    margin-left: 3%;
    .choose_models {
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: flex-start;
      .model_select {
        border: 2px solid #0071e3 !important;
      }
      .models {
        width: 350px;
        padding: 15px;
        min-height: 60px;
        border: 1px solid #525151;
        border-radius: 15px;
        text-align: center;
        line-height: 60px;
        cursor: pointer;
        margin: 10px 0 10px 10px;
        .model_name {
          display: block;
          text-align: left;
          font-weight: bolder;
          letter-spacing: 1px;
          height: 20px;
          margin-left: 15px;
        }
        .model_screen {
          display: block;
          text-align: left;
          font-weight: lighter;
          letter-spacing: 1px;
          margin-top: 10px;
          font-size: 0.8em;
          margin-left: 15px;
        }
        .price {
          float: right;
          display: block;
          margin-right: 15px;
          line-height: 100%;
          font-weight: lighter;
          font-size: 0.8em;
          div {
            margin-top: 5px;
          }
        }
      }
    }
  }
}
.colorPicker {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-content: center;
  min-height: 100px;
  .color_select {
    transition: 0.2s;
    border: 2px solid #0071e3 !important;
  }
  .color_ring {
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    margin-left: 15px;
    border: 1px solid #fff;
    &:first-child {
      margin: 0;
    }
    &:hover {
      border: 1px solid #e2e2e2;
    }
  }
  .colors {
    width: 40px;
    height: 40px;
    display: block;
    border-radius: 50%;
    cursor: pointer;
  }
}
.choose_models .models {
  width: 100% !important;
  box-sizing: border-box;
  border: clamp(2px, 0.18vw, 3px) solid #c9c9c9;
  border-radius: clamp(16px, 1.4vw, 24px);
  padding: clamp(18px, 1.8vw, 28px) clamp(22px, 2.6vw, 36px);
  background: #fff;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: clamp(6px, 0.8vw, 12px);
  line-height: 1.2;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.04);
}

.choose_models .models:hover {
  border-color: #8e8e8e;
}

.choose_models .models.model_select {
  border-color: #0071e3 !important;
  box-shadow: 0 0 0 clamp(3px, 0.35vw, 5px) rgba(0, 113, 227, 0.15);
}

.choose_models .models .model_name {
  margin: 0;
  font-weight: 700;
  font-size: clamp(20px, 2.6vw, 32px);
  letter-spacing: 0.02em;
}

.choose_models .models .model_screen {
  margin: 0;
  justify-self: end;
  color: #4b4b4b;
  font-size: clamp(14px, 1.8vw, 22px);
  font-weight: 500;
}
</style>
