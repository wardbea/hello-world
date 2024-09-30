import { ICustomer } from "../model/ICustomer";
import { IFormData } from "../model/IFormData";


export default class CustomerMapper {

    public static mapRequestFormData(item: any): IFormData {
        return {
            Title: item.title,
            Email: item.email,
            Address: item.address ? item.address : "",
            Interests: item.interests && item.interests.length > 0 ? item.interests : [] //added after last working deployment 9/23
          //  ProjectsId: item.projects && item.projects.length > 0 ? item.projects : []            
        } as IFormData;
    }

    public static mapCustomerInfo(item: any): ICustomer {
        return {
            ID: item.ID,
            Title: item.Title,
            Email: item.Email,
            Address: item.Address ? item.Address : "",
            Interests: item.Interests && item.Interests.length > 0 ? item.Interests : [] //added after last working deployment 9/23
            /*ProjectsId: item.ProjectsId && item.ProjectsId.length > 0 ? item.ProjectsId.map(i => i.toString()) : [],
            Projects: item.Projects && item.Projects.length > 0 ? item.Projects : [],
            CustomerLocations: item.CustomerLocations && item.CustomerLocations.length > 0 ? this.mapTaxColumn(item.CustomerLocations) : {}*/
        } as ICustomer;
    }

    
    
   }

