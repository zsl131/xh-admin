import React from 'react';
import {connect} from 'dva';
import {Icon, Tooltip} from 'antd';
import {routerRedux} from 'dva/router'
import Operator from './components/Operator';
import Filter from './components/Filter';
import List from './components/List';
import AddModal from './components/AddModal';
import InvalidModal from './components/InvalidModal';
import DownloadModal from './components/DownloadModal';
import ShowDetailModal from './components/ShowDetailModal';

const FinanceRecord = ({
  dispatch,
  loading,
  financeRecord,
  location
}) => {

  const { query, pathname } = location;

  const handleRefresh = (newQuery) => {
    dispatch(routerRedux.push({
      pathname,
      query: {
        ...query,
        ...newQuery,
      },
    }));
  };

  const operatorOpts = {
    onAdd: () => {
      dispatch({ type: 'financeRecord/modifyState', payload: {addVisible: true}});
    }
  };

  const filterOpts = {
    cateList:financeRecord.cateList,
    onFilter: (params) => {
      handleRefresh({conditions: JSON.stringify(params)});
    }
  };

  const listOpts = {
    dataSource: financeRecord.data,
    loading: loading.models.financeRecord,
    location,
    totalElement: financeRecord.totalElements,
    onDelConfirm: (id) => {
      dispatch({ type: 'financeRecord/deleteObj', payload: id }).then(() => {handleRefresh()});
    },
    onPageChange: (page) => {
      handleRefresh({page : page - 1});
    },
    onVerify: (obj, status) => {
      // console.log("update::", id);
      if("-1"===status) {
        dispatch({type: 'financeRecord/modifyState', payload: {invalidVisible: true, item: obj}});
      } else {
        obj.status = "1";
        dispatch({ type: 'financeRecord/updateStatus', payload: obj }).then(() => {
          handleRefresh();
        });
      }
    },
    onShowDetail: (obj) => {
      dispatch({type: 'financeRecord/showDetail', payload: {ticketNo: obj.ticketNo, id: obj.id}});
    },
    onRecord: (obj)=> {
      dispatch({type: 'financeRecord/loadOne', payload: obj.id});
    }
  };

  const addOpts = {
    maskClosable: false,
    visible: financeRecord.addVisible,
    title: "??????????????????",
    item: financeRecord.item,
    confirmLoading: loading.effects['financeRecord/add'],
    onOk(datas) {
      dispatch({ type: 'financeRecord/add', payload: datas }).then(() => {
        handleRefresh();
        dispatch({ type: 'financeRecord/modifyState', payload: { addVisible: false } });
      });
    },
    onCancel() {
      dispatch({ type: 'financeRecord/modifyState', payload: { addVisible: false } });
    }
  };

  const invalidOpts = {
    visible: financeRecord.invalidVisible,
    title: "??????["+financeRecord.item.ticketNo+"]",
    confirmLoading: loading.effects['financeRecord/updateStatus'],
    onOk(datas) {
      datas.id = financeRecord.item.id;
      datas.status = "-1";
      dispatch({ type: 'financeRecord/updateStatus', payload: datas }).then(() => {
        handleRefresh();
        dispatch({ type: 'financeRecord/modifyState', payload: { invalidVisible: false } });
      });
    },
    onCancel() {
      dispatch({ type: 'financeRecord/modifyState', payload: { invalidVisible: false } });
    }
  };

  const downloadOpts = {
    visible: financeRecord.downloadVisible,
    title: '?????????????????????',
    onOk(datas) {
      //console.log(datas);
      const w=window.open('about:blank');
      w.location.href="/api/downloadPdf?month="+datas.month;
    },
    onCancel() {
      dispatch({ type: 'financeRecord/modifyState', payload: { downloadVisible: false } });
    }
  };

  const showOpts = {
    maskClosable: false,
    visible: financeRecord.showVisible,
    title: '????????????['+financeRecord.record.ticketNo+']',
    detailList: financeRecord.detailList,
    record: financeRecord.record,
    ticketList: financeRecord.ticketList,
    chineseMoney: financeRecord.chineseMoney,
    onCancel:()=> {
      dispatch({ type: 'financeRecord/modifyState', payload: { showVisible: false } });
    },
    onOk: () => {
      dispatch({ type: 'financeRecord/modifyState', payload: { showVisible: false } });
    }
  };

  return(
    <div>
      <div className="listHeader">
        <h3><Icon type="bars"/> ????????????<b>???{financeRecord.totalElements}???</b>
          <span style={{"paddingLeft": "20px"}}>?????????<Tooltip placement="bottom" title="?????????"><b className="red">{financeRecord.totalIn} ???</b></Tooltip>-
          <Tooltip placement="bottom" title="?????????"><b className="red">{financeRecord.totalOut} ???</b></Tooltip>=
          <Tooltip placement="bottom" title="????????????"><b className="red">{financeRecord.totalIn - financeRecord.totalOut} ???</b></Tooltip>
            </span>
        </h3>
        <Operator {...operatorOpts}/>
      </div>
      <div className="listFilter">
        <Filter {...filterOpts}/>
      </div>
      <div className="listContent">
        <List {...listOpts} />
      </div>
      {financeRecord.addVisible && <AddModal {...addOpts}/>}
      {financeRecord.invalidVisible && <InvalidModal {...invalidOpts}/>}
      {financeRecord.downloadVisible && <DownloadModal {...downloadOpts}/>}
      {financeRecord.showVisible && <ShowDetailModal {...showOpts}/>}
    </div>
  );
}

export default connect(({ loading, financeRecord }) => ({ loading, financeRecord }))(FinanceRecord);
