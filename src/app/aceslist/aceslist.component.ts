import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import {DomSanitizer} from "@angular/platform-browser";
//import {Accesslist} from "../aceslist.service";
import {Commonservices} from "../app.commonservices";
declare var $:any;
@Component({
  selector: 'app-aceslist',
  templateUrl: './aceslist.component.html',
  styleUrls: ['./aceslist.component.css'],
    //providers: [Accesslist],
    providers: [Commonservices],
})
export class AceslistComponent implements OnInit {
  public datalist;
  public id;
  orderbyquery:any;
  orderbytype:any;
    //public ckeditorContent:any;
  constructor(private _http: Http,private _sanitizer: DomSanitizer,private _commonservices: Commonservices/*private _aceslist: Accesslist*/) {
      this.orderbyquery='firstname';
      this.orderbytype=1;
  }
    profile = {};

  ngOnInit() {
    //this.getAcesList();
      //this._aceslist.getDetails().subscribe(res => {
      this._commonservices.getDetailsAces().subscribe(res => {
          this.datalist = res;
          console.log(this.datalist.length);
      }, error => {
          console.log("Oooops!");
      });
      setTimeout(function () {
          console.log(this.datalist);
      })
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
      this._commonservices.DeleteAces(this.id).subscribe();
      $('#'+this.id).parent().remove();

   /* var link ='http://influxiq.com:3001/deleteaces';
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
        });*/
  }
    getSortClass(value:any){
        //console.log(value);
        if(this.orderbyquery==value && this.orderbytype==-1) {
            //console.log('caret-up');
            return 'caret-up'
        }

        if(this.orderbyquery==value && this.orderbytype==1) {
            //console.log('caret-up');
            return 'caret-down'
        }
        return 'caret-up-down'
    }
    manageSorting(value:any){
        console.log(value);
        if(this.orderbyquery==value && this.orderbytype==-1) {
            this.orderbytype=1;
            return;
        }
        if(this.orderbyquery==value && this.orderbytype==1) {
            this.orderbytype=-1;
            return;
        }

        this.orderbyquery=value;
        this.orderbytype=1;
    }


}
