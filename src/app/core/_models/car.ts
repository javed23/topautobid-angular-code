/**
 * A model for an individual corporate employee
 */
export class Car {
    _id: any;   
    vin: string;
    mileage: number;
    year: number;
    make: string;
    model: string;
    body_style: string;
    trim: string;
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
    bids: any;
    images: any;
    offer_in_hand_images: any;
    type: string;
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




    constructor(object) {
        console.log('object', object['basic_info']);
        this._id = object._id;       
        this.vin = object.vin_number;
        this.mileage = object.basic_info.vehicle_mileage;
        this.year = object.vehicle_year;
        this.best_bid = object.best_bid;
        this.make = object.basic_info.vehicle_make;
        this.model = object.basic_info.vehicle_model;
        this.body_style = object.basic_info.vehicle_body_type;
        this.trim = object.basic_info.vehicle_trim;
        this.doors = object.basic_info.vehicle_doors;
        this.engine = object.basic_info.vehicle_engine;
        this.transmission = object.basic_info.vehicle_transmission;
        this.fuel_type = object.basic_info.vehicle_fuel_type;
        this.drive_type = object.basic_info.vehicle_drive_type;
        this.interior_color = (object.basic_info.vehicle_interior_color=='Other')?object.basic_info.vehicle_other_interior_color:object.basic_info.vehicle_interior_color;
        this.exterior_color = (object.basic_info.vehicle_exterior_color=='Other')?object.basic_info.vehicle_other_exterior_color:object.basic_info.vehicle_exterior_color;
        this.interior_material = object.basic_info.vehicle_interior_material;
        this.created_at = object.created_at;
        this.offer_in_hand = object.vehicle_finance_details.vehicle_estimated_price;
        this.comments = object.vehicle_comments;       
        this.images = object.vehicle_images;
        this.bids = object.bids
        this.offer_in_hand_images = object.vehicle_finance_details.vehicle_proof_image
        this.type = object.type
        this.miles = object.basic_info.vehicle_mileage;
        this.cover_image = (object.vehicle_images.length > 0) ? object.vehicle_images[0]['file_path'] : 'assets/images/no_vehicle.png'
        this.car_images = object.vehicle_images;
        this.market_value = object.vehicle_aftermarket.vehicle_aftermarket_description;
        this.review = object.review;
        this.vehicle_condition = object.vehicle_condition
        this.zipcode = object.basic_info.vehicle_zip
        this.willing_to_drive = (object.willing_to_drive)?'Yes':'No';
        this.willing_to_drive_how_many_miles = object.willing_to_drive_how_many_miles
        this.vehicle_to_be_picked_up = (object.vehicle_to_be_picked_up)?'Yes':'No';
        this.vehicle_has_second_key = (object.vehicle_has_second_key)?'Yes':'No';
    }
}