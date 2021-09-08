// 根级别mutations
import * as types from "./mutation-types";

const mutations = {
  /**
   * @param updatedMap
   */
  [types.UPDATE_MAP]( state, updatedMap ) {
    state.basemap = updatedMap;
  },
  [types.INIT_MAP]( state, basemap ) {
    state.basemap = basemap;
  },
  [types.ADD_LAYER]( state, payload ){
    state.basemap.addLayer(payload.layer);
  },
  [types.ADD_POPUP_LAYER](state, popupLayer){
    state.popupLayer = popupLayer;
  },
  [types.UPDATE_CURRENT_LEGENT_URL](state, legendUrl){
    state.currentLegendUrl = legendUrl;
  },
  [types.UPDATE_CURRENT_LEGENT_NAME](state, legendName){
    state.currentLegendName = legendName;
  }
}

export default mutations;
