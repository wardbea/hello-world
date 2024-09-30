import { FormDisplayMode, Guid } from "@microsoft/sp-core-library";
import { FormCustomizerContext } from "@microsoft/sp-listview-extensibility";
import { ICustomer } from "../../model/ICustomer";

export interface IFormContainerProps {
    context: FormCustomizerContext;
    listGuid: Guid;
    itemID: number;
    listItem: ICustomer;
    EditFormUrl: string;
    AddFormUrl: string;
    displayMode: FormDisplayMode;
    onSave: () => void;
    onClose: () => void;
}

