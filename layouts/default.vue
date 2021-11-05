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
}

html,
body,
.app {
  /* max-width: 100%; */
  width: 100%;
}

.app {
  // border: 1px solid $red;
  display: flex;
  flex-direction: column;
  max-height: 100vh;
}

.container {
  max-width: 1200px;
  padding: 0 2rem;
}
</style>
