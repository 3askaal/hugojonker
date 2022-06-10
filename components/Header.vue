<template>
  <div class="header">
    <!-- <div class="header__logo" ref="logo">Hugo Jonker</div> -->
    <div class="header__nav">
      <a href="/" class="header__nav__item">Home</a>
      <a href="/portfolio" class="header__nav__item">Portfolio</a>
      <a href="/contact" class="header__nav__item">Contact</a>
    </div>
  </div>
</template>


<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isHovering: null,
      galleryWidth: null,
      galleryheight: null,
      gallerySpace: 400
    }
  },
  mounted() {
    if (Object.keys(this.$refs).length) {
      this.$store.commit('refs/add', this.$refs);
    }
  }
}
</script>


<style lang="scss" scoped>
.header {
  position: absolute;
  display: flex;
  width: 100%;
  justify-content: center;
  padding: $spacer * 2;
  z-index: 9999;
  pointer-events: none;
}

.header__nav {
  display: none;
}

.header__nav__item {
  +.header__nav__item {
    margin-left: 1rem;
  }
}
</style>
