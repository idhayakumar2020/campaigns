import { combineReducers } from "@reduxjs/toolkit"
import campaignsReducer from "../slices/campaigns/reducer"

const rootReducer = combineReducers({
  campaigns: campaignsReducer
})

export default rootReducer
