//import { ITermData } from "./ITermData";

export interface ICustomer {
    ID: string
    Title: string;
    Email: string;
    Address?: string;
    Interests?: string[]; //added after last working deployment 9/23
   // ProjectsId?: string[];
   // Projects?: any[];
   // CustomerLocations?: ITermData[];
}