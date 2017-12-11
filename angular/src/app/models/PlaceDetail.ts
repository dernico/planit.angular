import { Location } from "./Location";
import { Geometry } from "./Geometry";

export class PlaceDetail {
    public id: String;
    public name: String;
    public place_id: String;
    public types: Array<String>;
    public icon: string;
    public photos: Array<Photo>;
    public geometry: Geometry;
    public formatted_address: String;
    public formatted_phone_number: String;
    public international_phone_number: String;
}

export class Photo {
    public photo_reference: String;
    public html_attributions: Array<String>;
}