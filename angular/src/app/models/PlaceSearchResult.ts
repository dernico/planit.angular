import { Location } from "./Location";
import { Geometry } from "./Geometry";

export class PlaceSearchResult {
    public id: String;
    public name: String;
    public place_id: String;
    public types: Array<String>;
    public geometry: Geometry
}