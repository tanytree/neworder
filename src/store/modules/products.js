import shop from '../../api/shop'
import * as types from '../mutation-types'

// initial state
const state = {
  all: [],
  initData:[]
}

// getters
const getters = {
  allProducts: state => state.all,
  initDataVuex: state => state.initData
}

// actions
const actions = {
  getAllProducts ({ commit },products) {
      commit(types.RECEIVE_PRODUCTS, { products })
  },
  getInitData ({ commit },data) {
      commit(types.RECEIVE_INITDATA, { data })
  }
}

// mutations
const mutations = {
  [types.RECEIVE_PRODUCTS] (state, { products }) {
    console.log(products);
    state.all = products
  },
  [types.RECEIVE_INITDATA] (state, { data }) {
    state.initData = data
  },

  [types.ADD_TO_CART] (state, { id }) {
    state.all.find(p => p.id === id).inventory--
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
