import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Configs } from '../../configs';
import { HttpClient } from '@angular/common/http';
import { PlaceSuggestion } from '../../models/PlaceSuggestion';

@Component({
    selector: 'places-input',
    styleUrls: ['./places-input.component.css'],
    templateUrl: './places-input.component.html'
})
export class PlacesInputComponent implements OnInit {
    errors: Array<string> = [];
    @Input() inputValue;
    @Input() placeholderInput: string = "Where do you wanna stop?";
    @Output() selectionChanged = new EventEmitter();
    
    private searchTimer:any;
    private suggestlist = [];

    constructor(
        private http: HttpClient) { }

    ngOnInit() {}
    
    stepKeyUp(value){
        clearTimeout(this.searchTimer);
        this.searchPlaces(value, (suggestlist) => {
            this.suggestlist = suggestlist;
        })
    }
    
    suggestlistSelectionChanged(suggest: PlaceSuggestion){
      this.selectionChanged.emit(suggest);
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
        }, 1000);
    }

}
