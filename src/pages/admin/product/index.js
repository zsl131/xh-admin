import React from 'react';
import { connect } from 'dva';
import { Button, Icon, message } from 'antd';
import { routerRedux } from 'dva/router';

import AddModal from './components/AddModal';
import UpdateModal from './components/UpdateModal';
import Operator from './components/Operator';
import List from './components/List';
import Filter from './components/Filter';
import PictureModal from '@/pages/admin/product/components/PictureModal';
import PreModal from '@/pages/admin/product/components/PreModal';

const Product = ({
  product,
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

  const operatorOpts = {
    msg:"添加产品",
    onAdd() {
      dispatch({ type: 'product/onAdd', payload: {}});
    }
  };

  const listOpts = {
    dataSource: product.datas,
    loading: loading.models.product,
    location,
    item: product.item,
    totalElement: product.totalElements,
    specsVisible: product.specsVisible,
    specsList: product.specsList,
    onDelConfirm: (record) => {
      dispatch({ type: 'product/deleteObj', payload: {id: record.id} }).then(() => {handleRefresh()});
    },
    onPageChange: (page) => {
      handleRefresh({page : page - 1});
    },
    onUpdate: (record) => {
        // dispatch({ type: 'product/modifyState', payload: {item: record, updateVisible: true} });
      dispatch({ type: 'product/modifyState', payload: {item: record} });
      dispatch({ type: 'product/onAdd', payload: {isUpdate: true} });
    },
    onShowSpecs: (record)=> {
      dispatch({type: 'product/onShowSpecs', payload: {proId: record.id}});
      dispatch({ type: 'product/modifyState', payload: {item: record} });
    },
    saveSpecs: (obj) => {
      dispatch({type: 'product/saveSpecs', payload: obj}).then(() => {handleRefresh()});
    },
    deleteSpecs: (obj) => {
      dispatch({type: 'product/deleteSpecs', payload: obj}).then(() => {handleRefresh()});
    },
    modifyState: (obj)=> {
      dispatch({ type: 'product/modifyState', payload: obj });
    },
    modifyStatus: (obj)=> {
      dispatch({type: 'product/modifyStatus', payload:obj}).then(() => {handleRefresh()});
    },
    showPic: (obj) => {
      dispatch({ type: 'product/onPic', payload: obj});
    },
    modifySaleMode: (obj)=> {
      //console.log(obj);
      const mode = obj.mode;
      if(obj.mode==='2') {
        dispatch({type: 'product/onPresale', payload:obj.obj}).then(() => {handleRefresh()});
      } else {
        dispatch({type: 'product/modifySaleMode', payload:{id: obj.obj.id, mode: mode}}).then(() => {handleRefresh()});
      }
    },
    showVideo:()=> {
      message.warn("此功能暂未开通")
    },
    modifyRecommend:(obj)=> {
      dispatch({type: 'product/modifyRecommend', payload:obj}).then(() => {handleRefresh()});
    }
  };

  const addOpts = {
    visible: product.addVisible,
    title: "添加产品信息",
    selectCate: product.selectCate,
    maskClosable: false,
    confirmLoading: loading.effects['product/addObj'],
    onOk: (obj) => {
      dispatch({ type: 'product/modifyState', payload: { addVisible: false } });
      dispatch({ type: 'product/addObj', payload: obj }).then(() => {handleRefresh()});
    },
    onCancel() {
      dispatch({ type: 'product/modifyState', payload: { addVisible: false } });
    }
  };
  const updateOpts = {
    visible: product.updateVisible,
    title: `修改产品[${product.item.title}]`,
    item: product.item,
    selectCate: product.selectCate,
    maskClosable: false,
    confirmLoading: loading.effects['product/updateObj'],
    onOk: (obj) => {
      dispatch({ type: 'product/modifyState', payload: { updateVisible: false } });
      dispatch({ type: 'product/updateObj', payload: obj }).then(() => {handleRefresh()});
    },
    onCancel: () => {
      dispatch({ type: 'product/modifyState', payload: { updateVisible: false } });
    }
  };

  const filterOpts = {
    onFilter(values) {
      delete query.page; //去除page属性
      handleRefresh({conditions: JSON.stringify(values)});
    }
  };

  const picOpts = {
    visible: product.picVisible,
    item: product.item,
    title: `产品媒介[${product.item.title}]`,
    maskClosable: false,
    picList: product.picList,
    footer: <Button onClick={()=> {dispatch({ type: 'product/modifyState', payload: { picVisible: false } })}}>关闭窗口</Button>,
    onOk: (obj) => {
      dispatch({ type: 'product/modifyState', payload: { picVisible: false } });
    },
    onCancel: () => {
      dispatch({ type: 'product/modifyState', payload: { picVisible: false } });
    }
  };

  const preOpts = {
    visible: product.preVisible,
    item: product.item,
    title: `预售设置[${product.item.title}]`,
    maskClosable: false,
    preProduct: product.preProduct,
    onOk: (obj) => {
      console.log(obj)
      dispatch({ type: 'product/savePresale', payload: obj }).then(() => {handleRefresh()});
    },
    onCancel: () => {
      dispatch({ type: 'product/modifyState', payload: { preVisible: false } });
    }
  };

  return(
    <div>
      <div className="listHeader">
        <h3><Icon type="bars"/> 产品信息管理<b>（{product.totalElements}）</b></h3>
        <Operator {...operatorOpts}/>
      </div>
      <div className="listFilter">
        <Filter {...filterOpts}/>
      </div>
      <div className="listContent">
        <List {...listOpts} />
      </div>
      {product.addVisible && <AddModal {...addOpts}/>}
      {product.updateVisible && <UpdateModal {...updateOpts}/>}
      {product.picVisible && <PictureModal {...picOpts}/>}
      {product.preVisible&&<PreModal {...preOpts}/>}
    </div>
  );
}

export default connect(({ product, loading }) => ({ product, loading }))(Product);
