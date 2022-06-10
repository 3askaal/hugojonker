import Vue from 'vue'

const RefMixin = {
  beforeMount() {
    if (Object.keys(this.$refs).length) {
      this.$store.commit('refs/add', this.$refs);
    }
  },
}

Vue.mixin(RefMixin)
