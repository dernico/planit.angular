export class PlaceSuggestion {
    public id: String;
    public description: String;
    public place_id: String;
    public reference: String;
    public structured_formatting: StructuredFormattion
}

export class StructuredFormattion {
    public main_text: String;
    public secondary_text: String;
}