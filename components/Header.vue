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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: $spacer * 2;
}

.header__logo {
  font-family: $font-logo;
  font-size: 2.2rem;
  // margin-bottom: 2rem;
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
