/**
 * A model for an individual corporate employee
 */
export class Car {
    _id: any;
    ref: number;
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
    location: any;
    bids: any;
    images: any;
    offer_in_hand_images: any;
    type: string;
    miles: number;
    cover_image: string;
    car_images: any;









    constructor(object) {
        console.log('object', object['basic_info']);
        this._id = object._id;
        this.ref = object.ref;
        this.vin = object.vin_number;
        this.mileage = object.basic_info.vehicle_mileage;
        this.year = object.vehicle_year;
        this.make = object.basic_info.vehicle_make;
        this.model = object.basic_info.vehicle_model;
        this.body_style = object.basic_info.vehicle_body_type;
        this.trim = object.basic_info.vehicle_trim;
        this.doors = object.basic_info.vehicle_doors;
        this.engine = object.basic_info.vehicle_engine;
        this.transmission = object.basic_info.vehicle_transmission;
        this.fuel_type = object.basic_info.vehicle_fuel_type;
        this.drive_type = object.basic_info.vehicle_drive_type;
        this.interior_color = object.basic_info.vehicle_interior_color;
        this.exterior_color = object.basic_info.vehicle_exterior_color;
        this.interior_material = object.basic_info.vehicle_interior_material;
        this.created_at = object.created_at;
        this.offer_in_hand = object.vehicle_finance_details.vehicle_pay_off;
        this.comments = object.vehicle_comments;
        this.location = object.location;
        this.images = object.vehicle_images;
        this.bids = []
        this.offer_in_hand_images = object.vehicle_finance_details.vehicle_proof_image
        this.type = object.type
        this.miles = object.basic_info.vehicle_mileage;
        this.cover_image = (object.vehicle_images.length > 0) ? object.vehicle_images[0]['file_path'] : 'assets/images/no_vehicle.png'
        this.car_images = object.vehicle_images;
    }
}