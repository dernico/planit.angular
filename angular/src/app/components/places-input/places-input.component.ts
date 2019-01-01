import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Configs } from '../../configs';
import { HttpClient } from '@angular/common/http';
import { PlaceSuggestion } from '../../models/PlaceSuggestion';
import { PlaceDetail } from '../../models/PlaceDetail';
import { Todo } from '../../models/Todo';
import {} from 'googlemaps';
import { Location } from '../../models/Location';

@Component({
    selector: 'places-input',
    styleUrls: ['./places-input.component.css'],
    templateUrl: './places-input.component.html'
})
export class PlacesInputComponent implements OnInit {
    errors: Array<string> = [];

    private searchTimer: any;
    public suggestlist = [];
    private selectedResult: google.maps.GeocoderResult;

    @Input() useGoogle = false;
    @Input() inputValue;
    @Input() placeholderInput: string = "Where do you wanna stop?";
    @Output() selectionChanged = new EventEmitter();


    constructor(private http: HttpClient) { }

    ngOnInit() {
    }

    inputChange(event) {
        // let todo = new Todo();
        // todo.title = event;
        // this.selectionChanged.emit(todo);
    }

    stepKeyUp(value) {
        var self = this;
        var newTodo = new Todo();
        newTodo.title = value;
        this.selectionChanged.emit(newTodo);

        // Disabled place search
        if (!this.useGoogle) {
            return;
        }
        clearTimeout(this.searchTimer);
        this.searchPlaces(value, (suggestlist) => {
            self.suggestlist = suggestlist;
        });
    }

    suggestlistSelectionChanged(detail: google.maps.GeocoderResult) {

        this.selectedResult = detail;
        this.Emit(detail);

        // this.placeDetails(suggest.place_id, (place: PlaceDetail) => {
        //     var newTodo = new Todo();
        //     newTodo.title = suggest.description;
        //     newTodo.location = place.geometry.location;
        //     this.selectionChanged.emit(newTodo);
        // });
    }

    displaySuggest(suggest: google.maps.GeocoderResult) {
        return suggest ? suggest.formatted_address : suggest;
    }

    private Emit(detail: google.maps.GeocoderResult){
        
        var newTodo = new Todo();
        newTodo.title = detail.formatted_address;
        var location = new Location();
        location.lat = detail.geometry.location.lat();
        location.lng = detail.geometry.location.lng();
        newTodo.location = location;
        this.selectionChanged.emit(newTodo);
    }

    private searchPlaces(query: string, cb: any) {
        if (!query) {
            return;
        }
        this.searchTimer = setTimeout(() => {
            
            // var url = "https://maps.googleapis.com/maps/api/place/textsearch/json";
            // url += "?query=" + query.replace(' ', '+');
            // url += "&key=" + Configs.mapsApiKey;

            // this.http.get(url).subscribe((res: any) => {
            //     if(res.status === "OK"){
            //         cb(res.candidates);
            //     }
            // });

            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'address': query }, function (results, status) {
                if ( status === google.maps.GeocoderStatus.OK) {
                    cb(results);
                }
            });

            // var url = Configs.placesAutocompleteUrl + '?q=' + encodeURIComponent(query);
            // this.http.get(url).subscribe((res: any) => {
            //     cb(res.predictions);
            // });
        }, 1000);
    }

    private placeDetails(placeid, cb: any) {
        let url = Configs.placesDetailsUrl + '?placeid=' + placeid;
        this.http.get(url).subscribe((res: any) => {
            cb(res.result);
        });
    }

}
