import { Location } from "./Location";
import { Geometry } from "./Geometry";

export class PlaceDetail {
    public id: String;
    public name: String;
    public place_id: String;
    public types: Array<String>;
    public photos: Array<Photo>;
    public geometry: Geometry;
}

export class Photo {
    public photo_reference: String;
    public html_attributions: Array<String>;
}