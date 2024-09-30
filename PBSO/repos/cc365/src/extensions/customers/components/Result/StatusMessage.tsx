
import * as React from 'react';
import { IStatusMessage } from './IStatusMessage';
import { Result } from 'antd';


export const StatusMessage: React.FunctionComponent<IStatusMessage> = (props) => (
  <Result
    status={props.resultType}
    title={props.title}
    subTitle={props.subTitle}
    // extra={[
    //   <Button onClick={props.onClose}>Close</Button>,
    // ]}
  />
);

