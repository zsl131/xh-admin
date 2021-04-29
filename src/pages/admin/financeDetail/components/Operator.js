import React from 'react';
import { Button } from 'antd';

const Operator = ({
  onAdd,
}) => {
  return(
    <div className="listOperator"><Button type="primary" icon="download" onClick={onAdd}>下载报销单</Button></div>
  );
}

export default Operator;
