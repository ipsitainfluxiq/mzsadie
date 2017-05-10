import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl,FormBuilder} from '@angular/forms';
import {Http} from "@angular/http";
declare var $:any;
@Component({
  selector: 'app-urlcall',
  templateUrl: './urlcall.component.html',
  styleUrls: ['./urlcall.component.css']
})
export class UrlcallComponent implements OnInit {
  public dataForm: FormGroup;
  private fb;
  public datalist: any=[];
  public filtereddatalist: any=[];
  public existingvalues: any=[];
  constructor(fb: FormBuilder ,private _http: Http) { }

  ngOnInit() {
    this.getAdminList();
  }

  getAdminList(){
      setInterval(() => {
          //var link ='http://influxiq.com:3001/urllist';
          var link ='http://192.168.1.188:3001/urllist';
          var data = {};
          this._http.get(link,data)
              .subscribe(res => {


                  var result = res.json();
                  this.datalist = result;
                  let x;
                  for(x in this.datalist){
                      console.log($.inArray( this.datalist[x].url, this.existingvalues ));
                      if($.inArray( this.datalist[x].url, this.existingvalues ) ==-1){
                          this.filtereddatalist.push(this.datalist[x]);

                      }
                      this.existingvalues.push(this.datalist[x].url);
                  }
              }, error => {
                  console.log("Ouooops!");
              });

      },100000);


  }
  exportcsv(){
    $("table").tableToCSV();
  }
}
