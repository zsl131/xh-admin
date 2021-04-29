import { message } from 'antd';
import { httpGet } from '@/utils/normalService';

const baseService = "customerService";
export default {
  state: {
    item:{},
    totalElements:0,
    datas:[],
    addVisible: false,
    updateVisible: false,

    relationVisible: false,
    type: '',
  },
  reducers: {
    modifyState(state, { payload: options }) {
      return {...state, ...options};
    },
  },
  effects: {
    *list({ payload: query }, { call, put }) {
      query.apiCode = baseService+".list";
      const data = yield call(httpGet, query);
      //console.log(data);
      yield put({ type:'modifyState', payload: {totalElements: data.size, datas: data.datas} });
    },
    *addObj({payload: obj}, {call}) {
      obj.apiCode = baseService+".add";
      const data = yield call(httpGet, obj);
      if(data) {message.success("保存成功");}
    },
    *updateObj({payload: obj},{call}) {
      obj.apiCode = baseService+".update";
      const data = yield call(httpGet, obj);
      if(data) {message.success("保存成功");}
    },
    *deleteObj({payload: obj}, {call}) {
      obj.apiCode = baseService+".delete";
      const data = yield call(httpGet, obj);
      if(data) {message.info(data.message);}
    },
    *onImageRelation({payload: obj}, {call,put}) {
      const query = {apiCode: "imageWallService.loadType", id: obj.item.id};
      const data = yield call(httpGet, query);
      //console.log(data, obj)
      obj.type = data.type;
      yield put({ type:'modifyState', payload: obj });
    },
    *setRelation({payload: obj}, {call,put}) {
      obj.apiCode = "imageWallService.updateType";
      //console.log(obj)
      const data = yield call(httpGet, obj);
      if(data) {
        message.success(data.message);
        yield put({ type:'modifyState', payload: {relationVisible: false} });
      }
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {
      return history.listen((location) => {
        if(location.pathname === '/admin/customer') {
          dispatch({ type: 'list', payload: location.query });
        }
      })
    }
  }
}
