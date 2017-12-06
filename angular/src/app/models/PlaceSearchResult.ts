export class PlaceSearchResult {
    public id: String;
    public name: String;
    public place_id: String;
    public types: Array<String>;
    public geometry: Geometry
}

export class Geometry {
    public location: Location;
}

export class Location {
    public lat: number;
    public lng: number;
}