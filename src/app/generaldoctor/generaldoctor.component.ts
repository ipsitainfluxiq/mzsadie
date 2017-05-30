import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import {DomSanitizer} from "@angular/platform-browser";
declare var $: any;
@Component({
  selector: 'app-generaldoctor',
  templateUrl: './generaldoctor.component.html',
  styleUrls: ['./generaldoctor.component.css']
})
export class GeneraldoctorComponent implements OnInit {
  public datalist;
  constructor(private _http: Http, private _sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.getdoclist();
  }
  getdoclist(){
    var link='http://influxiq.com:3001/generaldoctorlist';
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
