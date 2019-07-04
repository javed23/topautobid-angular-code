/**
 * A model for an individual corporate employee
 */
export class Car {
    _id: any;   
    type: string;
    vin: string;
    mileage: number;
    year: number;
    make: string;
    model: string;
    body_style: string;
    trim: string;
    location:any;
    standard_equipments:any;
    additional_options:any;
    doors: number;
    engine: number;
    transmission: string;
    fuel_type: string;
    drive_type: string;
    interior_color: string;
    exterior_color: string;
    interior_material: string;
    best_bid: number;
    created_at: Date;
    offer_in_hand: number;
    comments: string;
    car_selleing_radius: number;  
    totalBids: any;
    images: any;
    offer_in_hand_images: any;
    miles: number;
    cover_image: string;
    car_images: any;
    market_value: any;
    review: number;
    vehicle_condition:any;
    zipcode:number;
    willing_to_drive:any;
    willing_to_drive_how_many_miles:any;
    vehicle_to_be_picked_up:any
    vehicle_has_second_key:any
    is_vehicle_aftermarket:any
    vehicle_aftermarket:any
    vehicle_ownership:any
    clean_title:any
    vehicle_finance:any
    dealers_bids:any;
    vehicle_finance_details:any;
    my_bid:any;
    higest_bid:any;
    seller_distance:any;
    
    constructor(object) {
        this._id = object._id;       
        this.vin = object.vin_number;
        this.type = object.type;
        this.year = object.vehicle_year;
        this.make = object.vehicle_make;
        this.model = object.vehicle_model;
        this.trim = object.vehicle_trim;
        this.location =    object.vehicle_location;
        this.standard_equipments  = object.standard_equipments; 
        this.additional_options = object.additional_options;
        this.mileage = object.basic_info.vehicle_mileage;
        this.interior_color = (object.basic_info.vehicle_interior_color=='Other')?object.basic_info.vehicle_other_interior_color:object.basic_info.vehicle_interior_color;
        this.exterior_color = (object.basic_info.vehicle_exterior_color=='Other')?object.basic_info.vehicle_other_exterior_color:object.basic_info.vehicle_exterior_color;
        this.interior_material = object.basic_info.vehicle_interior_material;
        this.images = object.vehicle_images;
        this.car_images = object.vehicle_images;
        this.cover_image = (object.vehicle_images.length > 0) ? object.vehicle_images[0]['file_path'] : 'assets/images/no_vehicle.png'
        this.vehicle_has_second_key = (object.vehicle_has_second_key)?'Yes':'No';
        this.is_vehicle_aftermarket = (object.is_vehicle_aftermarket)?'Yes':'No';  
        this.vehicle_aftermarket = (object.vehicle_aftermarket)
        this.market_value = object.vehicle_aftermarket.vehicle_aftermarket_description;
        this.vehicle_ownership = object.vehicle_ownership
        this.clean_title = (object.vehicle_ownership.vehicle_clean_title)?'Yes':'No';
        this.comments = object.vehicle_comments;       
        this.vehicle_condition = object.vehicle_condition
        this.vehicle_to_be_picked_up = (object.vehicle_to_be_picked_up)?'Yes':'No';
        this.willing_to_drive = (object.willing_to_drive)?'Yes':'No';
        this.willing_to_drive_how_many_miles = object.willing_to_drive_how_many_miles;
        this.vehicle_finance_details = object.vehicle_finance_details
        this.offer_in_hand = object.vehicle_finance_details.vehicle_estimated_price;
        this.offer_in_hand_images = object.vehicle_finance_details.vehicle_proof_image;
        this.created_at = object.created_at;


        this.totalBids = object.totalBids
        this.best_bid = object.best_bid;
        // this.body_style = object.basic_info.vehicle_body_type;
        // this.doors = object.basic_info.vehicle_doors;
        // this.engine = object.basic_info.vehicle_engine;
        // this.transmission = object.basic_info.vehicle_transmission;
        // this.fuel_type = object.basic_info.vehicle_fuel_type;
        // this.drive_type = object.basic_info.vehicle_drive_type;
    
        this.miles = object.basic_info.vehicle_mileage;
        // this.review = object.review;
        this.zipcode = object.vehicle_location.zipcode
        
        this.dealers_bids = object.dealers_bids;
        this.my_bid = (object.my_bid && object.my_bid.length >0) ?object.my_bid[0].bids:[];
        this.higest_bid = object.higest_bid ? object.higest_bid :null;
        this.seller_distance = (object.distance)?object.distance : 0
        
    }
}