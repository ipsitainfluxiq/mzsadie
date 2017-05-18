import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import { Router, ActivatedRoute} from '@angular/router';
import {DomSanitizer} from "@angular/platform-browser";
import {CookieService} from 'angular2-cookie/core';
import {Commonservices} from "../app.commonservices";
@Component({
  selector: 'app-viewreview',
  templateUrl: './viewreview.component.html',
  styleUrls: ['./viewreview.component.css'],
  providers: [Commonservices]
})
export class ViewreviewComponent implements OnInit {
  id:number;
  public itemdetails: any= [];
  public itemdetails1;
  public userdata2;
  coockieData:CookieService;
  commonservices:Commonservices;
  serverUrl:any;
  items:any;
  id1: number;
  replies: any=[];

  public reviewdata: any=[];
  private allreviewdata: any;
  //public Userdata;
  constructor(private _http: Http,private router: Router, private route: ActivatedRoute, private _sanitizer: DomSanitizer , userdetails:CookieService,  private _commonservices: Commonservices) {
    this.coockieData=userdetails;
    this.userdata2 = userdetails.getObject('userdetails');
    this.commonservices=_commonservices;
    this.items = _commonservices.getItems();
    this.serverUrl = this.items[0].serverUrl;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getreview();
    },error=>{
      console.log(error);
      this.router.navigate(['/employeelist']);
    });
  }
  /*getreview(){
    var link =this.serverUrl+'getreviewdetails';
    //var link = 'http://influxiq.com:3001/getreviewdetails';
    //var data = {_id : this.id};

    this._http.get(link)
        .subscribe(res => {
          var result = res.json();
          this.itemdetails=result;
        }, error => {
          console.log("Oooops!");
        });
  }
  showreplies(reviewdata:any){
    this.reviewdata = reviewdata;
   console.log(this.reviewdata);
  }*/
  getreview(){
    var link =this.serverUrl+'getreviewdetails';
    //var link = 'http://influxiq.com:3001/getreviewdetails';
    //var data = {_id : this.id};

    this._http.get(link)
        .subscribe(res => {
          var result = res.json();
          //console.log(result);
          let x;
          this.allreviewdata=result;
          console.log("hi");
          console.log(this.allreviewdata);
          for(x in result){
            if(result[x].parent==0){

              this.itemdetails.push(result[x]);
              if(typeof (this.replies[result[x]._id])== 'undefined')this.replies[result[x]._id]=0;
            }
            else{
              console.log(typeof (this.replies[result[x].parent]));
              if(typeof (this.replies[result[x].parent])!= 'undefined'){
                this.replies[result[x].parent]++;
              }
              else {
                console.log("in else part");

                this.replies[result[x].parent]=1;
              }
              //console.log(this.replies[result[x]._id]);
              //console.log(result[x]._id);
              /*console.log("hi");
              console.log(this.replies[result[x].parent]);*/
            }
          }
          console.log('replies');
          console.log(this.replies);
        }, error => {
          console.log("Oooops!");
        });
  }
  showreplies(id:any){
    /*this.reviewdata = reviewdata;
    console.log(this.reviewdata);*/
    console.log(id);
    this.reviewdata=[];
    let x;
    for(x in this.allreviewdata) {
      if (this.allreviewdata[x].parent == id) {
        this.reviewdata.push(this.allreviewdata[x]);

      }
    }

  }



}