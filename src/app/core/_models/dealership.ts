/**
 * A model for an individual corporate employee
 */
export class Dealership {
    _id: any;
    legalcoroporationname: number;
    dealershipnumber: string;
    mainaddressline1:number;
    mainaddressline2: number;
    city: string;
    state: string;
    zip:string;
    dealer_id:any;
    profile_pic:string;
    created_at:any;
    legal_contacts:[];
    
  
     







    constructor(object){
        this._id  =  object. _id;
        this.legalcoroporationname  =  object.legalcoroporationname;
        this.dealershipnumber  =  object.dealershipnumber;
        this.mainaddressline1  =  object.mainaddressline1;
        this.mainaddressline2  =  object.mainaddressline2;
        this.city  =  object.city;
        this.state  =  object.state;
        this.zip  =  object.zip;
        this.dealer_id  =  object.dealer_id;
        this.profile_pic = object.profile_pic;
        this.created_at = object.created_at
        this.legal_contacts  =  object.legal_contacts;        
    }
}