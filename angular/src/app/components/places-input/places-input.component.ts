import { Component, OnInit, Input, Output, EventEmitter, ViewChild, NgZone } from '@angular/core';
import { Configs } from '../../configs';
import { HttpClient } from '@angular/common/http';
import { Todo } from '../../models/Todo';
import { } from 'googlemaps';
import { Location } from '../../models/Location';
import { Step } from '../../models/Step';
import { AgmMap, LatLngBounds } from '@agm/core';

@Component({
    selector: 'places-input',
    styleUrls: ['./places-input.component.css'],
    templateUrl: './places-input.component.html'
})
export class PlacesInputComponent implements OnInit {
    errors: Array<string> = [];

    private searchTimer: any;
    public suggestlist = [];
    public searching: boolean = false;
    private currentSelection: Todo;

    @ViewChild('agmmap')
    public agmmapRef: AgmMap;

    @Input() step: Step;
    @Input() useGoogle = false;
    @Input() onlyGeoref = false;
    @Input() showMap = true;
    @Input() inputValue;
    @Input() placeholderInput: string = "Where do you wanna stop?";
    @Output() selectionChanged = new EventEmitter();
    @Output() addTodoEvent = new EventEmitter();


    constructor(private http: HttpClient, private zone: NgZone) { }

    ngOnInit() {
        // this.agmmapRef.mapReady.subscribe((map) =>{
        //     let bounds: LatLngBounds;
        //     this.step.todos.forEach(t =>{
        //         bounds.extend({lat: t.location.lat, lng: t.location.lng});
        //     });
        //     map.fitBounds(bounds);
        // });
    }
    ngAfterViewInit() {
    }

    inputChange() {
        // let todo = new Todo();
        // todo.title = event;
        // this.selectionChanged.emit(todo);
    }

    public addTodo() {
        this.searching = false;
        this.addTodoEvent.emit(this.currentSelection);
    }

    stepKeyUp(value) {
        this.searching = true;
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

            this.zone.run(() => {
                self.suggestlist = suggestlist;
            });
        });
    }

    suggestlistSelectionChanged(detail) {

        if(this.onlyGeoref){
            this.EmitGeocoding(detail);
        }else{
            this.Emit(detail);
        }
        
        // this.placeDetails(suggest.place_id, (place: PlaceDetail) => {
        //     var newTodo = new Todo();
        //     newTodo.title = suggest.description;
        //     newTodo.location = place.geometry.location;
        //     this.selectionChanged.emit(newTodo);
        // });
    }

    displaySuggest(suggest: google.maps.places.PlaceResult) {
        return suggest.name ? suggest.name : suggest.formatted_address;
    }

    private Emit(detail: google.maps.places.PlaceResult) {

        var newTodo = new Todo();
        newTodo.title = detail.name;
        newTodo.description = detail.formatted_address;

        var location = new Location();
        location.lat = detail.geometry.location.lat();
        location.lng = detail.geometry.location.lng();
        newTodo.location = location;
        this.selectionChanged.emit(newTodo);
    }

    private EmitGeocoding(detail: google.maps.GeocoderResult) {

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


            if (!this.onlyGeoref) {
                var newMap = document.getElementById('map');
                var map = new google.maps.Map(newMap);

                var request = {
                    query: query.replace(' ', '+'),
                    fields: ['formatted_address', 'name', 'rating', 'opening_hours', 'geometry'],
                };

                var places = new google.maps.places.PlacesService(map);
                places.findPlaceFromQuery(request, (results, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        cb(results);
                    }
                });
            } else {
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({ 'address': query }, function (results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        cb(results);
                    }
                });
            }


            // var url = Configs.placesAutocompleteUrl + '?q=' + encodeURIComponent(query);
            // this.http.get(url).subscribe((res: any) => {
            //     cb(res.predictions);
            // });
        }, 1000);
    }



    getTodosWithLocation(todos: Array<Todo>) {
        return todos.filter(item => { return item.location; });
    }
}
