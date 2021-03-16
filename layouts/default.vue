<template>
  <div class="app">
    <Header />
    <Nuxt />
  </div>
</template>

<style lang="scss">
html {
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
}

html,
body,
.app {
  /* max-width: 100%; */
  width: 100%;
}

.app {
  border: 1px solid $red;
}
</style>
