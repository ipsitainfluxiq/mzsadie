import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import { Router, ActivatedRoute} from '@angular/router';
import {CookieService} from 'angular2-cookie/core';
import {Commonservices} from "../app.commonservices";
@Component({
  selector: 'app-viewlogoutdetails',
  templateUrl: './viewlogoutdetails.component.html',
  styleUrls: ['./viewlogoutdetails.component.css'],
  providers: [Commonservices],
})
export class ViewlogoutdetailsComponent implements OnInit {
  id:number;
  public userdata2;
  coockieData:CookieService;
  public itemdetails;
  public commonservices;
  serverUrl:any;
  items:any;
  constructor(private _http: Http,private router: Router, private route: ActivatedRoute, private _commonservices: Commonservices, userdetails:CookieService) {
    this.commonservices=_commonservices;
    this.items = _commonservices.getItems();
    this.serverUrl = this.items[0].serverUrl;
    this.coockieData=userdetails;
    this.userdata2 = userdetails.getObject('userdetails');
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getloginhistory();
    },error=>{
      console.log(error);
      this.router.navigate(['/employeelist']);
    });
  }
  getloginhistory(){
    var link =this.serverUrl+'getlogindetails';
    var data = {_id : this.id, type: 1};

    this._http.post(link, data)
        .subscribe(res => {
          var result = res.json();
          this.itemdetails=result.msg;
          console.log(this.itemdetails);
        }, error => {
          console.log("Oooops!");
        });
  }
}
