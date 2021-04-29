import React from 'react';
import {Menu, Pagination, Table, Icon} from 'antd';
import ListOperator from '../../../../components/ListOperator';

const List = ({
  onDelConfirm,
  onUpdate,
  onPageChange,
  onMatchPro,
  totalElement,
  ...listOpts
}) => {

  const delOpts = {
    okText: '确定删除',
    cancelText: '取消',
    onDelConfirm: onDelConfirm,
    onUpdate: onUpdate,
  };

  const columns = [{
    title: '名称',
    dataIndex: 'name'
  }, {
    title: '描述',
    dataIndex: 'remark'
  }, {
    title: '操作',
    render: (text, record) => {
      return (
        <ListOperator id={record.id} delName={record.name} {...delOpts}>
          <Menu.Item>
            <span onClick={()=>handleMatchMenu(record)}><Icon type="team"/> 授权产品</span>
          </Menu.Item>
        </ListOperator>
      );
    }
  }];
  const handleMatchMenu = (role) => {
    // console.log("handleMatchMenu", role);
    onMatchPro(role);
  };

  const handlePageChange = (pageNumber) => {
    onPageChange(pageNumber);
  };

  const pager = () => {
    return (
      <Pagination showQuickJumper defaultPageSize={15} total={totalElement} onChange={handlePageChange}/>
    );
  };

  return (
    <Table {...listOpts} columns={columns} rowKey="id" pagination={false} footer={pager}/>
  );
};

export default List;
