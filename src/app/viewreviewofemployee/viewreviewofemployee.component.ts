import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import { Router, ActivatedRoute} from '@angular/router';
import {DomSanitizer} from "@angular/platform-browser";
import {CookieService} from 'angular2-cookie/core';
import {Commonservices} from "../app.commonservices";
declare var $:any;

@Component({
  selector: 'app-viewreviewofemployee',
  templateUrl: './viewreviewofemployee.component.html',
  styleUrls: ['./viewreviewofemployee.component.css'],
  providers: [Commonservices]
})

export class ViewreviewofemployeeComponent implements OnInit {
  id: number;
  employeeid: number;
  public itemdetails: any= [];
  public userdata2;
  coockieData: CookieService;
  commonservices: Commonservices;
  serverUrl: any;
  items: any;
  replies: any = [];
  public reviewdata: any = [];
  private allreviewdata: any;

  constructor(private _http: Http, private router: Router, private route: ActivatedRoute, private _sanitizer: DomSanitizer, userdetails: CookieService, private _commonservices: Commonservices) {
    this.coockieData = userdetails;
    this.userdata2 = userdetails.getObject('userdetails');
    this.commonservices = _commonservices;
    this.items = _commonservices.getItems();
    this.serverUrl = this.items[0].serverUrl;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.employeeid = params['employeeid'];
      this.getreviewofemployee(this.id);
    }, error => {
      console.log(error);
      this.router.navigate(['/employeelist']);
    });
  }

  /*  getreviewofemployee(){
   var link =this.serverUrl+'getreviewofemployee?id='+this.id+'&employeeid='+this.employeeid;
   this._http.get(link)
   .subscribe(res => {
   var result = res.json();
   this.itemdetails=result;
   this.allreviewdata=result;
   console.log(this.allreviewdata);
   }, error => {
   console.log("Oooops!");
   });
   }
   showreplies(id:any){
   /!*this.reviewdata = reviewdata;
   console.log(this.reviewdata);*!/
   console.log(id);
   this.reviewdata=[];
   let x;
   for(x in this.allreviewdata) {
   if (this.allreviewdata[x].parent == id) {
   this.reviewdata.push(this.allreviewdata[x]);

   }
   }
   }*/
  getreviewofemployee(id: any) {
    console.log(id);
    var link = this.serverUrl + 'getreviewdetails';
    this._http.get(link)
        .subscribe(res => {
          var result = res.json();
          let x;
          this.allreviewdata = result;
          console.log("hi");
          console.log(this.allreviewdata);
          for (x in result) {
            if (result[x].parent ==0 && result[x].employeeid==id) {

              this.itemdetails.push(result[x]);
              if (typeof (this.replies[result[x]._id]) == 'undefined') this.replies[result[x]._id] = 0;
            }
            else {
              console.log(typeof (this.replies[result[x].parent]));
              if (typeof (this.replies[result[x].parent]) != 'undefined') {
                this.replies[result[x].parent]++;
              }
              else {
                console.log("in else part");
                this.replies[result[x].parent] = 1;
              }
              //console.log(this.replies[result[x]._id]);
              //console.log(result[x]._id);
              /*console.log("hi");
               console.log(this.replies[result[x].parent]);*/
            }
          }
          /*console.log('replies');
          console.log(this.replies);*/
        }, error => {
          console.log("Oooops!");
        });
  }

  showreplies(id: any) {
    /*this.reviewdata = reviewdata;
     console.log(this.reviewdata);*/
    console.log(id);
    this.reviewdata = [];
    let x;
    for (x in this.allreviewdata) {
      if (this.allreviewdata[x].parent == id) {
        this.reviewdata.push(this.allreviewdata[x]);

      }
    }
  }
}
