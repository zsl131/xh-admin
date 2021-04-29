import React from 'react';
import {Form, Input, Modal} from 'antd';

const FormItem = Form.Item;

const InvalidModal = ({
  onOk,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
  },
  ...modalProps
}) => {

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 17 },
    },
  };

  const handleOk = (e) => {
    e.preventDefault();

    validateFieldsAndScroll((errors, values) => {
      if(!errors) {
        onOk(values);
      }
    });
  };

  const modalOpts = {
    ...modalProps,
    onOk: handleOk
  };

  return(
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem {...formItemLayout} label="作废原因">
          {getFieldDecorator('reason', {rules: [{required: true, message: '作废原因不能为空'}]})(<Input placeholder="输入作废原因"/>)}
        </FormItem>
      </Form>
    </Modal>
  );
}

export default Form.create()(InvalidModal);
