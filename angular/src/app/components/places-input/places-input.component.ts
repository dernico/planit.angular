import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Configs } from '../../configs';
import { HttpClient } from '@angular/common/http';
import { PlaceSuggestion } from '../../models/PlaceSuggestion';
import { PlaceDetail } from '../../models/PlaceDetail';
import { Todo } from '../../models/Todo';

@Component({
    selector: 'places-input',
    styleUrls: ['./places-input.component.css'],
    templateUrl: './places-input.component.html'
})
export class PlacesInputComponent implements OnInit {
    errors: Array<string> = [];
    
    private searchTimer:any;
    private suggestlist = [];
    private _inputValue: string;

    @Input() inputValue;
    @Input() placeholderInput: string = "Where do you wanna stop?";
    @Output() selectionChanged = new EventEmitter();
    

    constructor(private http: HttpClient) { }

    ngOnInit() {
    }

    inputChange(event){
        let todo = new Todo();
        todo.title = event;
        this.selectionChanged.emit(todo);
    }
    
    stepKeyUp(value){
        
        var newTodo = new Todo();
        newTodo.title = value;
        this.selectionChanged.emit(newTodo);

        // Disabled place search
        // clearTimeout(this.searchTimer);
        // this.searchPlaces(value, (suggestlist) => {
        //     this.suggestlist = suggestlist;
        // });
    }
    
    suggestlistSelectionChanged(suggest: PlaceSuggestion){
        this.placeDetails(suggest.place_id, (place : PlaceDetail) => {
            var newTodo = new Todo();
            newTodo.title = suggest.description;
            newTodo.location = place.geometry.location;
            this.selectionChanged.emit(newTodo);
        });
    }
  
    displaySuggest(suggest: PlaceSuggestion){
      return suggest ? suggest.description : suggest;
    }

    private searchPlaces(query: any, cb: any){
        if(!query){
            return;
        }
        this.searchTimer = setTimeout(() => {
            var url = Configs.placesAutocompleteUrl + '?q=' + encodeURIComponent(query);
            this.http.get(url).subscribe((res: any) => {
                cb(res.predictions);
            });
        }, 2000);
    }

    private placeDetails(placeid, cb: any){
      let url = Configs.placesDetailsUrl + '?placeid='+placeid;
      this.http.get(url).subscribe((res: any) => {
        cb(res.result);
      });
    }

}
