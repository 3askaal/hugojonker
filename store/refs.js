export const state = () => ({
  global: {}
})

export const mutations = {
  add(state, refs) {
    state.global = {
      ...state.global,
      ...refs,
    }
  }
}
