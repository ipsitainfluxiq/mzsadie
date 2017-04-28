import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import {DomSanitizer} from "@angular/platform-browser";
@Component({
  selector: 'app-aceslist',
  templateUrl: './aceslist.component.html',
  styleUrls: ['./aceslist.component.css']
})
export class AceslistComponent implements OnInit {
  public datalist;
  public id;
    //public ckeditorContent:any;
  constructor(private _http: Http,private _sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.getAcesList();
      //this.ckeditorContent = '';
  }

  getAcesList(){
    var link ='http://influxiq.com:3001/aceslist';
    var data = {};


    this._http.get(link)
        .subscribe(res => {
          var result = res.json();
          //console.log(result.item);
          this.datalist = result.res;
          //console.log(this.datalist);
        }, error => {
          console.log("Oooops!");
        });
  }
  delConfirm(id){
    this.id = id;
    //console.log(this.id);
  }
  acesdel(){

    var link ='http://influxiq.com:3001/deleteaces';
    var data = {id:this.id};


    this._http.post(link, data)
        .subscribe(res => {
          //var result = res.json();
          var result = res;


          console.log('Data Deleted');
          //console.log(result);
          //console.log(this.datalist);
          this.getAcesList();
        }, error => {
          console.log("Oooops!");
        });
  }



}
