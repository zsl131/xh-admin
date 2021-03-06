import React from 'react';
import { Col, Form, Icon, Input, InputNumber, Modal, Row, Select, Spin, Switch, Tooltip } from 'antd';
import { formItemLayout, formItemLayout_large, rebuildTime } from '@/utils/common';
import { httpGet } from '@/utils/normalService';

const FormItem = Form.Item;
const {Option} = Select;

@Form.create()
class UpdateModal extends React.Component {

  state = {
    fetching: false,
    keyword: '',
    proList: [],
    durationStr: '',
  };

  componentDidMount() {
    const item = this.props.item;
    const {setFieldsValue} = this.props.form;
    setFieldsValue(item);
    const str = rebuildTime(item.duration);
    this.setState({durationStr: str});
  }
  render() {

    const {item, form} = this.props;
    const { getFieldDecorator, validateFieldsAndScroll,setFieldsValue} = form;

    const handleOk = (e) => {
      e.preventDefault();
      validateFieldsAndScroll((errors, values) => {
        //console.log(values)
        values.status = values.status?"1":"0";
        values.canRepeat = values.canRepeat?"1":"0";
        if(!errors) {
         this.props.onOk(values);
        }
      });
    };

    const {fetching, proList,durationStr} = this.state;

    const fetchProduct = (e) => {
      if(!this.state.fetching) {
        this.setState({fetching: true, proList: []});
        let api = {apiCode: "productService.searchByTitle", title: e};
        httpGet(api).then((res)=> {
          this.setState({fetching: false, proList: res.proList});
        })
      }
    };

    const handleProductChange = (e) => {
      //console.log(e);
      setFieldsValue({proId: e.key, proTitle: e.label});
    };

    const onDurationChange = (e)=> {
      const res = rebuildTime(e);
      this.setState({durationStr: res});
      // console.log(e, res);
    };

    return(
      <Modal {...this.props} onOk={handleOk}  style={{"min-width":"80%","top":"20px"}}>
        <Form layout="horizontal">
          {getFieldDecorator("id")(<Input type="hidden"/>)}
          {getFieldDecorator('proId')(<Input type="hidden" placeholder="??????????????????"/>)}
          {getFieldDecorator('proTitle')(<Input type="hidden" placeholder="??????????????????"/>)}
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="??????">
                {getFieldDecorator('name', {rules: [{required: true, message: '???????????????????????????'}]})(<Input placeholder="?????????????????????"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <Tooltip title="????????????">
                <FormItem {...formItemLayout} label="????????????">
                  {getFieldDecorator("surplusCount", {rules: [{required: true, message: '????????????????????????0'}]})(<InputNumber style={{"width":"100%"}} placeholder="??????"/>)}
                </FormItem>
              </Tooltip>
            </Col>
          </Row>
          <FormItem {...formItemLayout_large} label="??????">
            {getFieldDecorator('remark', {rules: [{required: true, message: '??????????????????'}]})(<Input placeholder="?????????????????????"/>)}
          </FormItem>
          <Row>
            <Col span={12}>
              <Tooltip title="????????????????????????????????????">
                <FormItem {...formItemLayout} label="??????">
                  {getFieldDecorator('worth', {rules: [{required: true, message: '???????????????????????????'}]})(<InputNumber placeholder="????????????"/>)}
                </FormItem>
              </Tooltip>
            </Col>
            <Col span={12}>
              <Tooltip title="?????????????????????????????????????????????????????????">
                <FormItem {...formItemLayout} label="??????">
                  {getFieldDecorator('reachMoney', {rules: [{required: true, message: '????????????????????????????????????'}]})(<InputNumber placeholder="????????????"/>)}
                </FormItem>
              </Tooltip>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="????????????">
                {getFieldDecorator("pro")(
                  <Select
                    showSearch
                    placeholder="????????????????????????"
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    labelInValue={true}
                    filterOption={false}
                    onSearch={fetchProduct}
                    onChange={handleProductChange}
                    style={{ width: '100%' }}
                    notFoundContent={fetching ? <Spin size="small" /> : null}
                  >
                    {proList.map(d => (
                      <Option key={d.id}>{d.title}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <p style={{"lineHeight":"40px"}}>{item.proTitle}</p>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Tooltip title="?????????????????????????????????????????????????????????">
                <FormItem {...formItemLayout} label="????????????">
                  {getFieldDecorator("duration", {rules: [{required: true, message: '????????????????????????'}]})(<InputNumber style={{"width":"100%"}} onChange={onDurationChange} placeholder="????????????"/>)}
                </FormItem>
              </Tooltip>
            </Col>
            <Col span={12}>
              <span style={{"lineHeight":"40px"}}>{durationStr}</span>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Tooltip title="????????????????????????????????????????????????">
                <FormItem {...formItemLayout} label="????????????">
                  {getFieldDecorator("status")(<Switch defaultChecked={item.status==="1"} checkedChildren={<Icon type="check"/>} unCheckedChildren={<Icon type="close" />}/>)}
                </FormItem>
              </Tooltip>
            </Col>
            <Col span={12}>
              <Tooltip title="?????????????????????">
                <FormItem {...formItemLayout} label="????????????">
                  {getFieldDecorator("canRepeat")(<Switch defaultChecked={item.canRepeat==="1"} checkedChildren={<Icon type="check"/>} unCheckedChildren={<Icon type="close" />}/>)}
                </FormItem>
              </Tooltip>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default UpdateModal;
