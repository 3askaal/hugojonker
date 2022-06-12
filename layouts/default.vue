<template>
  <div class="app">
    <Header />
    <div class="container">
      <Nuxt />
    </div>
  </div>
</template>

<style lang="scss">
html {
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font-size: 16px;

  @include media-breakpoint-up(md) {
    font-size: 18px;
  }

  @include media-breakpoint-up(lg) {
    font-size: 20px;
  }

  @include media-breakpoint-up(xl) {
    font-size: 22px;
  }
}

html,
body,
.app {
  width: 100%;
  height: 100%;
}

body {
  background-color: $black;
  color: $white;
}

.container {
  max-width: 1200px;
  padding: 0 .5rem;
  display: block;
}
</style>
