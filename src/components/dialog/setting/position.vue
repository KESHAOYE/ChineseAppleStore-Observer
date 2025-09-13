<template>
  <div class="settings">
    <div class="setting_item">
      <div class="tips">
        <div class="content">默认商店</div>
        <div class="descript">默认的 Apple Store</div>
      </div>

      <CityAndStorePicker
        ref="storePicker"
        :simple-mode="true"
        :use-default-on-mount="true"
        :auto-commit="false"
        size="mini"
        @updateInfo="onSelect"
      />
    </div>

    <!-- 操作区 -->
    <div class="setting_item" style="border: 0; justify-content: flex-end">
      <el-button
        type="primary"
        size="mini"
        :disabled="!canSave"
        @click="saveDefaultStore"
      >
        保存默认商店
      </el-button>
      <el-button
        size="mini"
        :disabled="!app.setting.defaultStore"
        @click="clearDefaultStore"
        style="margin-left: 8px"
      >
        清除默认商店
      </el-button>
    </div>

    <!-- 已保存展示（可选） -->
    <div class="setting_item" v-if="app.setting.defaultStore" style="border: 0">
      <el-tag type="success">
        当前默认商店：
        {{ app.setting.defaultStore.address.stateName }}
        {{ app.setting.defaultStore.address.city }}
        {{ app.setting.defaultStore.name }}
      </el-tag>
    </div>
  </div>
</template>

<script>
import { useAppStore } from "@/utils/pinia";
import CityAndStorePicker from "../../shopMode/cityAndStorePicker.vue";

export default {
  name: "SettingsPosition",
  components: { CityAndStorePicker },
  data() {
    return { draftStore: null };
  },
  computed: {
    app() {
      return useAppStore();
    },
    canSave() {
      if (!this.draftStore) return false;
      const cur = this.app.setting.defaultStore;
      if (!cur) return true;
      return (
        String(cur.id) !== String(this.draftStore.id) ||
        String(cur.slug || "") !== String(this.draftStore.slug || "")
      );
    },
  },
  methods: {
    onSelect(store) {
      this.draftStore = store;
    },
    saveDefaultStore() {
      this.app.setMessage("defaultStore", this.draftStore);
      this.$message.success("已保存默认商店");
    },
    clearDefaultStore() {
      // 清空选择
      this.$refs.storePicker.clear();
      this.app.setMessage("defaultStore", null);
      this.$message.success("已清除默认商店");
    },
  },
};
</script>

<style scoped></style>
