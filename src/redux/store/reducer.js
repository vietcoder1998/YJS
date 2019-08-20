import { combineReducers } from 'redux';
// import handleTodo from '../reducers/todo';
import { handlePersonalInfo } from './../reducers/changePersonalInfo';
import { handlePopupState } from './../reducers/changePopupState';
import { handleAuthState } from './../reducers/changeAuthState';
import { handleMapState } from './../reducers/changeMapState';
import { handleSideBarState } from './../reducers/changeSideBarState';
import { handleListJobResult } from './../reducers/changeListJobResult';
import { handleGetJobDetail } from './../reducers/changeJobDetail';
import { handleGetEmployerDetail } from './../reducers/changeEmployerDetail';
import { handleEmployerMoreJobDetail } from './../reducers/changeEmployerMoreJob';
import { handleGetJobSave } from './../reducers/changeJobSave';
import { handleNoti } from './../reducers/changeNoti';
import { handleListHotJobResult } from './../reducers/changeHotJob';
import { handleListHighLightResult } from './../reducers/changeHighLightJob';


const myReducer = combineReducers({
  // handleTodo,
  handlePersonalInfo,
  handlePopupState,
  handleAuthState,
  handleMapState,
  handleSideBarState,
  handleListJobResult,
  handleGetJobDetail,
  handleGetEmployerDetail,
  handleEmployerMoreJobDetail,
  handleGetJobSave,
  handleNoti,
  handleListHotJobResult,
  handleListHighLightResult
})

export default myReducer