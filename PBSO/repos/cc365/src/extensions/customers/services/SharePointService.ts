import { FormCustomizerContext } from "@microsoft/sp-listview-extensibility";
//import { Logger, LogLevel } from "@pnp/logging";
import { SPFI } from "@pnp/sp";
import '@pnp/sp/presets/all';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/lists/web";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import "@pnp/sp/batching";
import "@pnp/sp/fields";
import { IItemAddResult } from "@pnp/sp/items/types";
import { LogHelper } from "../helpers/LogHelper";
import CustomerMapper from "../mapper/CustomerMapper";
import { ICustomer } from "../model/ICustomer";
import { IFormData } from "../model/IFormData";
//import { IProject } from "../model/IProject";
import { getSP } from "../pnpjsConfig";

//import { ITermData } from "../model/ITermData";

class SharePointService {


    private static _sp: SPFI = null as any;

    public static Init(context: FormCustomizerContext) {
        this._sp = getSP(context)
        LogHelper.info('SharePointService', 'constructor', 'PnP SP context initialised');
    }


    public static async AddCustomer(formData: IFormData) {
      
             return await this._sp.web.lists.getByTitle("Customers").items.add(formData);

    }
    public static async UpdateCustomer(formData: IFormData, itemId: number) {

        //c00faac3ebe2497e84715f981b035dcd: 

        //const taxFieldData = locationData && locationData.length > 0 ? CustomerMapper.getManagedMetadataFieldValue(locationData) : null;

        // const response1: IItemAddResult = await this._sp.web.lists.getByTitle("Customers").items.getById(itemId).update({
        //     // update hidden note fields associated with the managed metadata fields
        //     'c00faac3ebe2497e84715f981b035dcd': taxFieldData
        // });


        const response: IItemAddResult = await this._sp.web.lists
            .getByTitle("Customers").items
            .getById(itemId)
            .update(formData);
        return response;
    }

    public static getCustomer = async (itemId: number, listTitle: string): Promise<ICustomer> => {
        try {
            let cResult = {} as ICustomer;
            const customerResponse: ICustomer = await this._sp.web.lists
                .getByTitle(listTitle)
                .items.getById(itemId)
                .select("*", "ID", "Title", "Email", "Address","Interests")();
                //.select("*", "ID", "Title", "Email", "Address", "Interests", "Projects/Title", "Projects/ID", "TaxCatchAll/ID", "TaxCatchAll/Term").expand("Projects", "TaxCatchAll")();

            if (customerResponse !== null && customerResponse !== undefined) {
                cResult = CustomerMapper.mapCustomerInfo(customerResponse);
            }

          /*  const assoicatedProjects: any[] = customerResponse && customerResponse.Projects.length > 0 ? customerResponse.Projects : [];
            if (assoicatedProjects.length > 0) {

                const projectMappedData = await Promise.all(assoicatedProjects.map(async (item: IProject) => {

                    const response: IProject = await SharePointService.getProjectDetail(item.ID, "Projects");
                    return response;

                }));

                cResult.Projects = projectMappedData;

            }*/

            return cResult;
        } catch (err) {
            LogHelper.error('SharePointService', 'getCustomer', err);
            throw err;
        }

    }

  /*  public static getProjectDetail = async (projrectId: number, listTitle: string) => {

        let pResult: IProject;

        try {
            const response: any = await this._sp.web.lists
                .getByTitle(listTitle)
                .items.getById(projrectId)
                .select("*", "ID", "Title", "Status", "StartDate", "Members/EMail", "Members/Title").expand("Members")();

            if (response != null && response != undefined) {
                pResult = CustomerMapper.mapCustomerProjects(response);
            }


            return pResult;
        } catch (err) {
            LogHelper.error('SharePointService', 'getProjectDetail', err);
            throw err;
        }
    }*/

}
export default SharePointService;
