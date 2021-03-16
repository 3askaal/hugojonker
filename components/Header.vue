<template>
  <div class="header">
    <div class="header__logo">Hugo Jonker</div>
    <div class="header__nav">
      <a href="/" class="header__nav__item">Home</a>
      <a href="/portfolio" class="header__nav__item">Portfolio</a>
      <a href="/contact" class="header__nav__item">Contact</a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  padding: $spacer * 2;
}
</style>
