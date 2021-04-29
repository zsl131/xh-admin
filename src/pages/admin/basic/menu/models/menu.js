import { message } from 'antd';
import { httpGet } from '@/utils/normalService';

const baseService = "adminMenuService";
export default {
  namespace: 'menu',
  state: {
    datas:[],
    item:{},
    menuTree:[],
    curName:'根',
    pid: 0,
    totalElements: 0,
    updateVisible: false,
  },
  reducers: {
    indexPage(state, { payload: data }) {
      // console.log(data);
      return {...state, menuTree: data.treeList, totalElements: data.menuList.length, datas: data.menuList};
    },
    setState(state, {payload: datas}) {
      // console.log("ddd", datas);
      return {...state, ...datas};
    },
  },
  effects: {
    *index({ payload: query }, { put, call }) {
      query.apiCode = baseService+".listRoot";
      const data = yield call(httpGet, query);
      yield put({ type: 'indexPage', payload: data.datas });
    },
    *showChildren({ payload: pid }, { put, call }) {
      const query = {pid:pid, apiCode:baseService+".listChildren"};
      const data = yield call(httpGet, query);
      yield put({ type: 'setState', payload: { datas: data.datas, totalElements: data.size } });
    },
    *init({ payload: query }, { call, put }) {
      query.apiCode = baseService+".init";
      const data = yield call(httpGet, query);
      if(data) { message.success(data.message);}
    },
    *update({ payload: obj }, { call, put }) {
      obj.apiCode = baseService+".update";
      const data = yield call(httpGet, obj);
      if(data) {message.success("保存成功");}
    },
    *deleteMenu({ payload: id }, { call }) {
      const query = {id:id, apiCode: baseService+".delete"};
      yield call(httpGet, query);
    },
    *changeOrderNo({payload: obj}, {call}) {
      obj.apiCode = baseService+".changeOrderNo";
      const data = yield call(httpGet, obj);
      if(data) {message.success(data.message);}
    },
    *initOrderNo({payload: obj}, {call}) {
      obj.apiCode = baseService+".initOrderNo";
      const data = yield call(httpGet, obj);
      if(data) {message.success(data.message);}
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {
      return history.listen((location) => {
        if(location.pathname === '/admin/basic/menu') {
          dispatch({ type: 'index', payload: location.query });
        }
      });
    }
  }
}
