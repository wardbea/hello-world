import * as React from 'react';
import { useState } from 'react';
import { ICustomerFormProps } from './ICustomerFormProps';
import { Button, Form, Input, Tooltip, BackTop, Spin, Row, Col, Select, Tag } from 'antd';
import { InfoCircleOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import { IFormData } from '../../model/IFormData';
import CustomerMapper from '../../mapper/CustomerMapper';
import SharePointService from '../../services/SharePointService';
import { StatusMessage } from '../Result/StatusMessage';
import { LogHelper } from '../../helpers/LogHelper';
import { FormDisplayMode } from '@microsoft/sp-core-library';

// const { Option } = Select; // Removed unused declaration
const { Option } = Select;

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 13,
            offset: 11,
        },
    },
};


export const CustomerForm: React.FunctionComponent<ICustomerFormProps> = (props) => {

    const [form] = Form.useForm();
    const [selectedInterests, setSelectedInterests] = useState<string[]>(props.listItem?.Interests ? props.listItem.Interests : []);
    const [loading, setLoading] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [isError, setIsError] = React.useState(false);
 


   


    const delay = (ms: number | undefined) => new Promise(res => setTimeout(res, ms));
    
    async function onFinish(values: any) {

        try {
            setLoading(true);
            setIsSuccess(false);
            setIsError(false);
            let response: any;
            
            const formData: IFormData = CustomerMapper.mapRequestFormData(values);
            
            if (props.displayMode === FormDisplayMode.New) {
                response = await SharePointService.AddCustomer(formData);
                    
            }
            if (props.displayMode === FormDisplayMode.Edit) {
                response = await SharePointService.UpdateCustomer(formData, props.itemID);
            }
            if (response.data) {
                setIsSuccess(true);
                setLoading(false);
                await delay(3000);
                props.onSave();
            }
            else {
                setIsError(true);
                setLoading(false);
            }

        }
        catch (err) {
            LogHelper.error('NewForm', 'onFinish', err);
            await delay(5000);
            setLoading(false);
            setIsError(true);
            resetForm();
        }
    }


    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const resetForm = () => {
        form.resetFields();
         }
    const onCancel = () => {
        resetForm();
        props.onClose();
    };

       const getSuccessStatusTitle = (displayMode: FormDisplayMode) => {
        return new Map([
            [FormDisplayMode.New, "Customer detail successfully added!"],
            [FormDisplayMode.Edit, "Customer detail successfully updated!"]
        ]).get(displayMode);
    }

    const renderInterestsTags = () => {
        return props.listItem?.Interests?.map((interest, index) => {
            return (
                <Tag key={index} color="default"> {interest}</Tag>
            )

        });
    }
    
   const handleInterestChange = (value: string[]) => {
        console.log(`selected ${value}`);
        setSelectedInterests(value);
    };
    const renderInterests = selectedInterests && selectedInterests.length > 0 && selectedInterests.map((item, index) => {
        return <Option key={index}>{item}</Option>
    });

    // Removed unused renderInterests variable




    return (
        <>
            {isSuccess && <StatusMessage resultType={"success"} title={getSuccessStatusTitle(props.displayMode)} onClose={() => onCancel()} />}
            {isError && <StatusMessage resultType={"error"} title="Submission Failed!" subTitle='Please try again or contact your administrator.' />}
            {isSuccess || isError ? null :
                <Form
                   // className={props.displayMode.toString()}
                    form={form}
                    name="basic"
                    layout="vertical"
                    initialValues={{ title: props.listItem?.Title, email: props.listItem?.Email, address: props.listItem?.Address, interests: renderInterests}} //using renderinterest insted of selected
                    size={"large"}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="on"

                >

                    <BackTop />

                    <Row>
                        <Col span={11}>
                            <Form.Item
                                label="Name"
                                name="title"
                                hasFeedback
                                rules={[{ required: true, message: 'Please input your full name!' }]}
                            >
                                <Input
                                    readOnly={props.displayMode === FormDisplayMode.Display}
                                    placeholder="Full name"
                                    prefix={<UserOutlined className="site-form-item-icon" />}
                                    suffix={
                                        <Tooltip title="Please enter your full name">
                                            <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                        </Tooltip>
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col offset={1} span={11}>
                            <Form.Item
                                label="Email"
                                name="email"
                                hasFeedback
                                rules={[{ required: true, type: 'email', message: 'Please input valid email address!' }]}
                            >
                                <Input
                                    readOnly={props.displayMode === FormDisplayMode.Display}
                                    placeholder="Email"
                                    prefix={<MailOutlined className="site-form-item-icon" />}
                                    suffix={
                                        <Tooltip title="Please enter your email address">
                                            <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                        </Tooltip>
                                    }
                                />
                            </Form.Item>

                        </Col>

                    </Row>

                    <Row>
                        <Col span={11}>      <Form.Item
                            label="Address"
                            name="address"
                            rules={[{ required: false, message: 'Please input your address!' }]}
                        >
                            <Input.TextArea
                                readOnly={props.displayMode === FormDisplayMode.Display}
                                placeholder="Address"
                                showCount maxLength={100}
                            />
                        </Form.Item></Col>
                        <Col offset={1} span={11}><Form.Item
                            label="Interests"
                            name="interests"
                        >
                            {props.displayMode !== FormDisplayMode.Display ?
                                <Select
                                    mode="multiple"
                                    allowClear
                                    size={"large"}
                                    style={{ width: '100%' }}
                                    placeholder="Please select interests"
                                    onChange={handleInterestChange}
                                    defaultValue={selectedInterests}
                                >
                                    <Option value="Decorating">Decorating</Option>
                                    <Option value="Diving">Diving</Option>
                                    <Option value="Livestreaming">Livestreaming</Option>
                                    <Option value="Drawing">Drawing</Option>
                                    <Option value="Kung fu">Kung fu</Option>
                                </Select>
                                : props.listItem?.Interests && props.listItem.Interests.length > 0 && renderInterestsTags()
                            }
                        </Form.Item></Col>
                    </Row>
                    
                    <Row>
                        <Col span={24}>
                            <Spin spinning={loading}>
                                <Form.Item style={{ marginTop: '40px' }} {...tailFormItemLayout}>

                                    <Button style={{ marginRight: '10px' }} type="default" htmlType="button" onClick={() => onCancel()}>
                                        Cancel
                                    </Button>
                                    <Button type="primary" htmlType="submit" hidden={props.displayMode === FormDisplayMode.Display}>
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Spin>
                        </Col>
                    </Row>

                </Form>
            }

        </>
    );
};


