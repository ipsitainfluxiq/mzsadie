import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {CookieService} from 'angular2-cookie/core';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})

export class AdminHeaderComponent implements OnInit {
/*
  private userdata:any;
  public userdetails:any=[];
*/
  public userDetails:any;
  public coockieData:CookieService;


  constructor(private router: Router,userdetails:CookieService) {
//console.log("inside constructor");
    this.coockieData=userdetails;
    this.router=router;

    this.userDetails=userdetails.getObject('userdetails');
    setTimeout(() => {

      if(typeof(this.userDetails)=='undefined'){
        console.log("inside");
        console.log(this.userDetails);
        this.router.navigateByUrl('/login');
        return;
      }
    },100);

  }

  ngOnInit() {
    //console.log("inside oninit");
  }

  ngAfterViewChecked(){

  }

}
