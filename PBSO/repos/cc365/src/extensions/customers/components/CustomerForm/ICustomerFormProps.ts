import { FormDisplayMode, Guid } from "@microsoft/sp-core-library";
import { FormCustomizerContext } from "@microsoft/sp-listview-extensibility";
import { ICustomer } from "../../model/ICustomer";


export interface ICustomerFormProps {
    context: FormCustomizerContext;
    siteUrl: string;
    listGuid: Guid;    
    listItem?: ICustomer;
    displayMode: FormDisplayMode;
    EditFormUrl: string;
    itemID: number;
    onSave: () => void;
    onClose: () => void;
}