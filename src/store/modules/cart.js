import shop from '../../api/shop'
import * as types from '../mutation-types'

// initial state
// shape: [{ id, quantity }]
const state = {
  added: [],
  checkoutStatus: null,
  checkoutMyOrder:null,
}

// getters
const getters = {
  checkoutStatus: state => state.checkoutStatus,
  checkoutMyOrder:state => state.checkoutMyOrder
}

// actions
const actions = {
  checkout ({ commit, state }, products) {
    const savedCartItems = [...state.added]
    commit(types.CHECKOUT_REQUEST)
    shop.buyProducts(
      products,
      () => commit(types.CHECKOUT_SUCCESS),
      () => commit(types.CHECKOUT_FAILURE, { savedCartItems })
    )
  },
  saveMyorder ({ commit },data) {
      commit(types.CHECKOUT_MYORDER, { data })
  }
}

// mutations
const mutations = {
  [types.ADD_TO_CART] (state, { id }) {
    state.lastCheckout = null
    const record = state.added.find(p => p.id === id)
    if (!record) {
      state.added.push({
        id,
        quantity: 1
      })
    } else {
      record.quantity++
    }
  },

  [types.CHECKOUT_REQUEST] (state) {
    // clear cart
    state.added = []
    state.checkoutStatus = null
  },

  [types.CHECKOUT_SUCCESS] (state) {
    state.checkoutStatus = 'successful'
  },

  [types.CHECKOUT_FAILURE] (state, { savedCartItems }) {
    // rollback to the cart saved before sending the request
    state.added = savedCartItems
    state.checkoutStatus = 'failed'
  },

  [types.CHECKOUT_MYORDER] (state, { data }) {
    // rollback to the cart saved before sending the request
    state.checkoutMyOrder = data
    console.log(data)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
