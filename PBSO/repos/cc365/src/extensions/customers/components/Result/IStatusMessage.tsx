import { ResultStatusType } from "antd/lib/result";

export interface IStatusMessage {
    resultType: ResultStatusType;
    title: string| undefined;
    subTitle?: string;
    onClose?: () => void;
}