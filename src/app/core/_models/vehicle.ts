/**
 * A model for an individual corporate employee
 */
export class Vehicle {
    
    vehicle_doors: number;
    vehicle_engine: number;
    vehicle_transmission: string;
    vehicle_fuel_type: string;
    vehicle_drive_type: string;
    vehicle_body_type: string;
    
    
    constructor(object) {
       console.log('object', object);
        
        this.vehicle_doors = object.model_doors;
        this.vehicle_engine = object.model_engine_cyl;
        this.vehicle_transmission = object.model_transmission_type;
        this.vehicle_fuel_type = object.model_engine_fuel;
        this.vehicle_drive_type = object.model_drive;
        this.vehicle_body_type = object.model_body;
        ;     
        
       
        
    }
}