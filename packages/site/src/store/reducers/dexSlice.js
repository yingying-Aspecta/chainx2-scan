import { createSlice } from '@reduxjs/toolkit'
import api from '@src/services/api'

const emptyPageInfo = {
  items: [],
  page: 0,
  pageSize: 10,
  total: 0
}

const dexSlice = createSlice({
  name: 'dex',
  initialState: {
    pairs: [],
    activePair: null,
    openOrders: emptyPageInfo,
    historyOrders: emptyPageInfo
  },
  reducers: {
    setPairs(state, action) {
      state.pairs = action.payload
      state.activePair = state.pairs[0]
    },
    setActivePair(state, action) {
      state.activePair = action.payload
    },
    setOpenOrders(state, action) {
      state.openOrders = action.payload
    },
    setHistoryOrders(state, action) {
      state.historyOrders = action.payload
    }
  }
})

const {
  setPairs,
  setActivePairIndex,
  setOpenOrders,
  setHistoryOrders
} = dexSlice.actions

export const fetchPairs = () => async dispatch => {
  const { result: pairs } = await api.fetch('/dex/pairs')
  dispatch(setPairs(pairs))
}

export const fetchOpenOrders = (
  pairId,
  page = 0,
  pageSize = 10
) => async dispatch => {
  const { result } = await api.fetch(`/dex/open_orders/${pairId}`, {
    page,
    pageSize
  })
  dispatch(setOpenOrders(result))
}

export const pairsSelector = state => state.dex.pairs
export const activePairSelector = state => state.dex.activePair
export const openOrdersSelector = state => state.dex.openOrders
export const historyOrdersSelector = state => state.dex.historyOrders

export default dexSlice.reducer