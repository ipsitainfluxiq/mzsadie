import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import {DomSanitizer} from "@angular/platform-browser";
declare var $: any;
@Component({
  selector: 'app-cardio',
  templateUrl: './cardio.component.html',
  styleUrls: ['./cardio.component.css']
})
export class CardioComponent implements OnInit {
public datalist;
  constructor(private _http: Http, private _sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.getcardiolist();
  }
  getcardiolist(){
    var link='http://influxiq.com:3001/cardiologist';
    this._http.get(link)
        .subscribe(res=> {
          var result=res.json();
          console.log(result);
          this.datalist=result;
        }, error=>{
          console.log("Oooops");
        });
  }
  exportcsv(){
    $("table").tableToCSV();
  }
}
