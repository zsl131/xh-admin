import React from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import { routerRedux } from 'dva/router';
import List from './components/List';
import Filter from './components/Filter';

const CustomCoupon = ({
  customCoupon,
  location,
  dispatch,
  loading
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

  /*const operatorOpts = {
    onAdd() {
      dispatch({ type: 'customCoupon/modifyState', payload: {addVisible: true}});
    }
  };*/

  const listOpts = {
    dataSource: customCoupon.datas,
    loading: loading.models.customCoupon,
    location,
    totalElement: customCoupon.totalElements,
    onDelConfirm: (record) => {
      dispatch({ type: 'customCoupon/deleteObj', payload: {id: record.id} }).then(() => {handleRefresh()});
    },
    onPageChange: (page) => {
      handleRefresh({page : page - 1});
    },
    onUpdate: (record) => {
        dispatch({ type: 'customCoupon/modifyState', payload: {item: record, updateVisible: true} });
    },
  };

  const filterOpts = {
    onFilter(values) {
      delete query.page; //去除page属性
      handleRefresh({conditions: JSON.stringify(values)});
    }
  };

  return(
    <div>
      <div className="listHeader">
        <h3><Icon type="bars"/> 客户优惠券<b>（{customCoupon.totalElements}）</b></h3>
        {/*<Operator {...operatorOpts}/>*/}
      </div>
      <div className="listFilter">
        <Filter {...filterOpts}/>
      </div>
      <div className="listContent">
        <List {...listOpts} />
      </div>
    </div>
  );
}

export default connect(({ customCoupon, loading }) => ({ customCoupon, loading }))(CustomCoupon);
