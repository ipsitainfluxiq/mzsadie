import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import { Router, ActivatedRoute, Params } from '@angular/router';
@Component({
  selector: 'app-adminlist',
  templateUrl: './adminlist.component.html',
  styleUrls: ['./adminlist.component.css']
})
export class AdminlistComponent implements OnInit {
  public datalist;
  public id;


  public superAdmin;
  constructor(private _http: Http,) {}

  ngOnInit() {
    this.getAdminList();
  }
  getAdminList(){
      var link ='http://influxiq.com:3001/adminlist';
    var data = {};


    this._http.get(link)
        .subscribe(res => {
          var result = res.json();
          console.log(result.item);
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


  admindel(){

      var link ='http://influxiq.com:3001/deleteadmin';
      var data = {id:this.id};


      this._http.post(link, data)
          .subscribe(res => {
              //var result = res.json();
              var result = res;


              console.log('Data Deleted');
              //console.log(result);
              //console.log(this.datalist);
              this.getAdminList();
          }, error => {
              console.log("Oooops!");
          });
  }


    statuscng(item){
        item.status = 1-item.status;
        //console.log(item.status);
        var link = 'http://influxiq.com:3001/userstatcng';
        var data = {id:item._id,status:item.status};

        this._http.post(link, data)
            .subscribe(res => {
                console.log("Success");
            }, error => {
                console.log("Oooops!");
            });
    }

}
