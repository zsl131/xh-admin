import React from 'react';
import { Cascader, Col, Form, Input, InputNumber, Modal, Row, Tooltip } from 'antd';
import { formItemLayout, formItemLayout_large, uuid } from '@/utils/common';
import division from '@/tools/division';
import BraEditor from '@/components/common/BraEditor';

const FormItem = Form.Item;

@Form.create()
class AddModal extends React.Component {

  state = {
    uuid: uuid()
  };

  render() {
    // const {uuid} = this.state;
   // console.log(uuid);

    const {
      onOk,
      selectCate,
      form: {
        getFieldDecorator,
        setFieldsValue,
        validateFieldsAndScroll,
      },
      ...modalProps
    } = this.props;

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

    const onCateChange = (value, selectOptions) => {
      if(selectOptions.length<2) {
        setFieldsValue({cateId: "", cateName: "", pcateId: "", pcateName: ""});
      } else {
        const cate = selectOptions[1];
        const pcate = selectOptions[0];
        setFieldsValue({cateId: cate.value, cateName: cate.label, pcateId: pcate.value, pcateName: pcate.label});
      }
    };

    const onDivisionChange = (values, selectOptions) => {
      //console.log(selectOptions);
      if(selectOptions.length<3) {
        setFieldsValue({provinceCode: "", provinceName: "",
          cityCode: "", cityName: "",
          countyCode: "", countyName: ""});
      } else {
        const pro = selectOptions[0];
        const city = selectOptions[1];
        const county = selectOptions[2];
        setFieldsValue({provinceCode: pro.value, provinceName: pro.label,
          cityCode: city.value, cityName: city.label,
          countyCode: county.value, countyName: county.label});
      }
    };

    function filter(inputValue, path) {
      return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    }

    /*const onBeforeUpload = (file) => {
      // console.log("====", file);
      if(file.type.indexOf("image")<0) {
        message.error("??????????????????????????????");
        return false;
      }
      return true;
    };

    const onFileChange = (file) => {
      console.log("onFileChange", file);
      if(file.status === 'done') {
        setFieldsValue({"imgUrl": file.response});
      }
      if(file.status==="removed") {
        const id = file.response.data[0].id;
        const obj = {id: id, apiCode: "mediumService.delete"};
        httpGet(obj).then((res) => {console.log(res)});
      }
    };*/

    const handleChangeContent = (obj) => {
      //console.log("add===", obj);
      setFieldsValue({"content": obj.content, rawContent: obj.raw});
    };

    return(
      <Modal {...modalOpts} style={{"minWidth":"90%", "top":"10px"}}>
        <Form layout="horizontal">
          <Row>
            <Col span={14}>
              <FormItem {...formItemLayout} label="????????????">
                {getFieldDecorator('provinceCode', {rules: [{required: true, message: '?????????????????????'}]})(<Input type="hidden" placeholder=""/>)}
                {getFieldDecorator('provinceName')(<Input type="hidden" placeholder=""/>)}
                {getFieldDecorator('cityCode')(<Input type="hidden" placeholder=""/>)}
                {getFieldDecorator('cityName')(<Input type="hidden" placeholder=""/>)}
                {getFieldDecorator('countyCode')(<Input type="hidden" placeholder=""/>)}
                {getFieldDecorator('countyName')(<Input type="hidden" placeholder=""/>)}
                {getFieldDecorator('temp', {rules: [{required: true, message: '?????????????????????'}]})(
                  <Cascader
                    options={division.division}
                    onChange={onDivisionChange}
                    placeholder="?????????????????????"
                    showSearch={{ filter }}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem {...formItemLayout} label="????????????">
                {getFieldDecorator('cateId', {rules: [{required: true, message: '?????????????????????'}]})(<Input type="hidden" placeholder=""/>)}
                {getFieldDecorator('cateName')(<Input type="hidden" placeholder=""/>)}
                {getFieldDecorator('pcateId')(<Input type="hidden" placeholder=""/>)}
                {getFieldDecorator('pcateName')(<Input type="hidden" placeholder=""/>)}
                <Cascader
                  options={selectCate}
                  onChange={onCateChange}
                  placeholder="???????????????"
                  showSearch={{ filter }}
                />
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={14}>
              <FormItem {...formItemLayout} label="????????????">
                {getFieldDecorator('title', {rules: [{required: true, message: '????????????????????????'}]})(<Input placeholder="??????????????????"/>)}
              </FormItem>
            </Col>
            <Col span={10}>
              <Tooltip title="????????????????????????????????????">
                <FormItem {...formItemLayout} label="????????????">
                  {getFieldDecorator('fund')(<InputNumber placeholder="????????????"/>)}
                </FormItem>
              </Tooltip>
            </Col>
          </Row>
          <Row>
            <Col span={14}>
              <Tooltip title="??????">
                <FormItem {...formItemLayout} label="??????">
                  {getFieldDecorator('units')(<Input placeholder="??????????????????"/>)}
                </FormItem>
              </Tooltip>
            </Col>
            <Col span={10}>
              <Tooltip title="??????????????????">
                <FormItem {...formItemLayout} label="??????">
                  {getFieldDecorator('orderNo')(<InputNumber placeholder="??????"/>)}
                </FormItem>
              </Tooltip>
            </Col>
          </Row>

          {/*<Row>
            <Col span={14}>
              <Tooltip title="??????????????????">
                <FormItem {...formItemLayout} label="??????">
                  {getFieldDecorator('surplusCount')(<InputNumber placeholder="??????"/>)}
                </FormItem>
              </Tooltip>
            </Col>
            <Col span={10}>
              <Tooltip title="??????????????????">
                <FormItem {...formItemLayout} label="??????">
                  {getFieldDecorator('surplusCount')(<InputNumber placeholder="??????"/>)}
                </FormItem>
              </Tooltip>
            </Col>
          </Row>*/}

          <FormItem {...formItemLayout_large} label="????????????">
            {getFieldDecorator('rawContent')(<Input type="hidden" placeholder=""/>)}
            {getFieldDecorator("content", {rules: [{required: true, message: '????????????????????????'}]})(
              <BraEditor onChangeContent={handleChangeContent}/>
              )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default AddModal;

