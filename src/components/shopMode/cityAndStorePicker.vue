<!-- src/components/shopMode/cityAndStorePicker.vue -->
<template>
  <div>
    <div
      :class="simpleMode ? 'cityPicker_simpleMode' : 'cityPicker'"
      v-loading="loading"
    >
      <span class="tips" v-if="!simpleMode">
        Apple Store：<span class="gray">想在哪里购机？</span>
      </span>

      <el-select
        v-model="nowProvince"
        :size="size"
        placeholder="省份"
        @change="readStore"
      >
        <el-option
          v-for="item in provinces"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <el-select
        v-if="stores.length > 0"
        v-model="nowStore"
        :size="size"
        placeholder="Apple Store"
        style="margin-left: 20px"
        @change="updateStoreInfo"
      >
        <el-option
          v-for="item in stores[0].store"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>

      <el-link
        v-if="nowStore && !simpleMode"
        type="primary"
        style="margin-left: 20px"
        @click="storeDetail"
      >
        商店详情
      </el-link>
    </div>
  </div>
</template>

<script>
import storesJson from "@/data/applestore.json";
import { useAppStore } from "@/utils/pinia";

export default {
  name: "cityPicker",
  props: {
    simpleMode: { type: Boolean, default: false },
    size: {
      type: String,
      default: "medium",
      validator: (v) => ["medium", "small", "mini"].includes(v),
    },
  },

  data() {
    return {
      provinces: [],
      allStores: [],
      stores: [],
      storeInfo: null,
      nowProvince: null,
      nowStore: null,
      loading: false,
    };
  },

  computed: {
    app() {
      return useAppStore();
    },
    defaultStoreFromPinia() {
      return this.app?.setting?.defaultStore || null;
    },
    defaultProvinceFromPinia() {
      return (
        this.defaultStoreFromPinia?.address?.stateName ||
        this.defaultStoreFromPinia?.province ||
        ""
      );
    },
  },

  watch: {
    defaultStoreFromPinia: {
      deep: true,
      immediate: false,
      handler(newVal) {
        this.applyDefaultFromPinia(newVal);
      },
    },
  },

  methods: {
    readProvince() {
      const stateList = storesJson?.storeListData?.[0]?.state || [];
      const provsFromJson = storesJson?.provinces || [];
      this.allStores = stateList;

      this.provinces =
        provsFromJson.length > 0
          ? provsFromJson
          : stateList.map((el) => ({ value: el.name, label: el.name }));

      this.preselectFromPinia();
    },

    readStore() {
      this.loading = true;
      this.nowStore = null;
      this.storeInfo = null;

      const groupRaw = this.allStores.find(
        (el) => el.name === this.nowProvince
      );

      if (groupRaw) {
        const clone = {
          ...groupRaw,
          store: groupRaw.store.map((s) => ({
            ...s,
            name: s.name?.startsWith("APPLE") ? s.name : `APPLE${s.name}店`,
          })),
        };
        this.stores = [clone];
      } else {
        this.stores = [];
      }

      this.$emit("province-change", this.nowProvince);
      this.loading = false;

      if (this.nowProvince === this.defaultProvinceFromPinia) {
        this.trySelectDefaultStore();
      }
    },

    trySelectDefaultStore() {
      const ds = this.defaultStoreFromPinia;
      const list = this.stores[0]?.store || [];
      if (!ds || list.length === 0) return;

      const norm = (n = "") =>
        String(n)
          .replace(/^APPLE/i, "")
          .replace(/店$/, "")
          .trim();

      let hit =
        list.find((s) => String(s.id) === String(ds.id)) ||
        (ds.slug ? list.find((s) => s.slug === ds.slug) : null) ||
        (ds.name ? list.find((s) => norm(s.name) === norm(ds.name)) : null);

      if (hit) {
        if (String(this.nowStore) === String(hit.id)) return;
        this.nowStore = hit.id;
        this.updateStoreInfo(this.nowStore);
      }
    },

    normalizeStore(raw) {
      const province =
        this.nowProvince ||
        raw?.province ||
        raw?.address?.stateName ||
        this.defaultProvinceFromPinia ||
        "";

      const city =
        raw?.city ||
        raw?.address?.city ||
        this.defaultStoreFromPinia?.address?.city ||
        "";

      return {
        ...raw,
        province,
        city: city || province,
        address: {
          stateName: province,
          city: city || province,
          ...(raw.address || {}),
        },
      };
    },

    updateStoreInfo(id) {
      const group = this.stores[0];
      const raw = group?.store?.find((el) => String(el.id) === String(id));
      if (!raw) return;

      const normalized = this.normalizeStore(raw);
      this.storeInfo = normalized;

      this.$emit("updateInfo", normalized);
      this.$emit("store-change", normalized);
    },

    storeDetail() {
      if (!this.storeInfo?.slug) return;
      window.open(`https://www.apple.com.cn/retail/${this.storeInfo.slug}`);
    },

    preselectFromPinia() {
      if (this.defaultProvinceFromPinia) {
        if (this.nowProvince !== this.defaultProvinceFromPinia) {
          this.nowProvince = this.defaultProvinceFromPinia;
          this.readStore();
        } else {
          this.trySelectDefaultStore();
        }
      }
    },

    applyDefaultFromPinia(ds) {
      if (!ds) {
        this.clear();
        return;
      }

      const targetProv =
        ds.address?.stateName || ds.province || this.nowProvince || "";

      if (targetProv && targetProv !== this.nowProvince) {
        this.nowProvince = targetProv;
        this.readStore();
        return;
      }

      const current =
        (this.stores[0]?.store || []).find(
          (s) => String(s.id) === String(this.nowStore)
        ) || null;
      if (this.isSameStore(current, ds)) return;

      if (!this.stores.length) {
        this.readStore();
      } else {
        this.trySelectDefaultStore();
      }
    },

    isSameStore(a, b) {
      if (!a || !b) return false;
      if (String(a.id) === String(b.id)) return true;
      if (a.slug && b.slug && a.slug === b.slug) return true;
      const norm = (n = "") =>
        String(n)
          .replace(/^APPLE/i, "")
          .replace(/店$/, "")
          .trim();
      return norm(a.name) === norm(b.name);
    },

    clear() {
      this.loading = false;
      this.nowProvince = null;
      this.nowStore = null;
      this.storeInfo = null;
      this.stores = [];

      this.$emit("province-change", null);
      this.$emit("store-change", null);
      this.$emit("updateInfo", null);
    },
  },

  mounted() {
    this.readProvince();
  },
};
</script>

<style lang="scss">
.cityPicker {
  min-width: 550px;
}
.cityPicker_simpleMode {
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
</style>
