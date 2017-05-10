import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import {DomSanitizer} from "@angular/platform-browser";
import {Employeelist} from "../employeelist.service";
declare var $:any;
@Component({
  selector: 'app-employeelist',
  templateUrl: './employeelist.component.html',
  styleUrls: ['./employeelist.component.css'],
  providers: [Employeelist],
})
export class EmployeelistComponent implements OnInit {
  public datalist;
  public id;
  orderbyquery:any;
  orderbytype:any;
  constructor(private _http: Http,private _sanitizer: DomSanitizer, private _employeelist: Employeelist) {
    this.orderbyquery='firstname';
    this.orderbytype=1;
  }
  profile = {};
  ngOnInit() {
    this._employeelist.getDetails().subscribe(res => {
      this.datalist = res;
      console.log(this.datalist.length);
    }, error => {
      console.log("Oooops!");
    });
    setTimeout(function () {
      console.log(this.datalist);
    })
  }
  delConfirm(id){
    this.id = id;
  }
  employeedel() {
    this._employeelist.DeleteUser(this.id).subscribe();
    $('#' + this.id).parent().remove();
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
