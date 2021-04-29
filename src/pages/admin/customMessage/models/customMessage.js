import { httpGet } from '@/utils/normalService';
import { message } from 'antd';

const baseService = "customMessageService";
export default {
  state: {
    item:{},
    totalElements:0,
    datas:[],
    addVisible: false,
    updateVisible: false,
    replyVisible: false,

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
    *onReply({payload: values}, { call }) {
      values.apiCode = baseService+".reply";
      const data = yield call(httpGet, values);
      // const data = yield call(feedbackService.reply, values);
      if(data) {
        message.success("回复成功");
      }
    }
  },
  subscriptions: {
    setup({ history, dispatch }) {
      return history.listen((location) => {
        if(location.pathname === '/admin/customMessage') {
          dispatch({ type: 'list', payload: location.query });
        }
      })
    }
  }
}
