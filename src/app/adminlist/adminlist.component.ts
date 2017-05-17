import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl,FormBuilder} from '@angular/forms';
import {Http} from "@angular/http";
//import {Adminlist} from "../adminlist";
import {Commonservices} from "../app.commonservices";
import { Router, ActivatedRoute, Params } from '@angular/router';
declare var $:any;
@Component({
  selector: 'app-adminlist',
  templateUrl: './adminlist.component.html',
  styleUrls: ['./adminlist.component.css'],
    //providers: [Adminlist],
    providers: [Commonservices],
})
export class AdminlistComponent implements OnInit {
    public dataForm: FormGroup;
    private fb;
    public datalist;
    public id;
    public superAdmin;
    orderbyquery:any;
    orderbytype:any;

    constructor(fb: FormBuilder ,private _http: Http,private _commonservices: Commonservices/*private _adminlist: Adminlist*/) {
        this.orderbyquery='firstname';
        this.orderbytype=1;
    }
    profile = {};
    ngOnInit() {
        //this._adminlist.getUser().subscribe(res => {
        this._commonservices.getAdmin().subscribe(res => {
            this.datalist = res;
            console.log(this.datalist.length);
        }, error => {
            console.log("Oooops!");
        });
        //this.getAdminList();
        setTimeout(function () {
            console.log(this.datalist);
        })
    }




    /*getAdminList(){
        //var link2=link1;
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
    }*/
    delConfirm(id){
        this.id = id;
        //console.log(this.id);
    }


    admindel(){
       console.log(this.datalist.length);
        this._commonservices.DeleteAdminlist(this.id).subscribe();
       //this._adminlist.DeleteUser(this.id).subscribe(); //Call deleteuser function of adminlist service and send the id
        $('#'+this.id).parent().remove();
        //this._adminlist.getUser().subscribe(data => this.datalist = data);
        /*setTimeout(() => {
            this._adminlist.getUser().subscribe(res => {
                this.datalist = res;
                console.log(this.datalist.length);
            }, error => {
                console.log("Oooops!");
            });

        },2000);*/




       /* var link ='http://influxiq.com:3001/deleteadmin';
        var data = {id:this.id};
        this._http.post(link, data)
            .subscribe(res => {
                //var result = res.json();
                var result = res;


                console.log('Data Deleted');
                //console.log(result);
                //console.log(this.datalist);
               // this.getAdminList();
               // this.datalist;
            }, error => {
                console.log("Oooops!");
            });*/
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
