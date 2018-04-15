import { Directive, ElementRef, Input } from '@angular/core';
import { HttpHeaderResponse, HttpHeaders, HttpClient } from '@angular/common/http';

@Directive({
  selector: '[httpSrc]'
})
export class HttpSrcDirective {

  constructor(
    private http: HttpClient,
    private element: ElementRef
  ) {

    // function revokeObjectURL() {
    //   if (element.nativeElement.objectURL) {
    //     URL.revokeObjectURL(element.nativeElement.objectURL);
    //   }
    // }
    //setTimeout(this.downloadFile, 10)
  }

  ngOnInit(){
    this.downloadFile();
  }

  @Input('httpSrc') imageUrl : string;

  private downloadFile() {
    const headers = new HttpHeaders();
    headers.append('Accept', 'text/plain');
    this.http.get(this.imageUrl, { headers: headers, responseType: 'blob' }).subscribe(resp => {
      const blob = new Blob([resp], { type: resp.type });
      this.element.nativeElement.src = URL.createObjectURL(blob);
    });
  }

}