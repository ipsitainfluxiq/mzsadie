import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import { Router, ActivatedRoute, Params } from '@angular/router';
import {Commonservices} from "../app.commonservices";

@Component({
  selector: 'app-emailverify',
  templateUrl: './emailverify.component.html',
  styleUrls: ['./emailverify.component.css'],
  providers: [Commonservices]
})
export class EmailverifyComponent implements OnInit {
  private id;

  items:any;
  serverUrl:any;
  commonservices:Commonservices;
  constructor(private _http: Http,private router: Router, private route: ActivatedRoute, private _commonservices: Commonservices) {
    this.commonservices=_commonservices;
    this.items = _commonservices.getItems();
    this.serverUrl = this.items[0].serverUrl;
  }

  ngOnInit() {
    console.log("oninithello");
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.emailverify();
    },error=>{
      this.router.navigate(['/login']);
    });
  }
  emailverify(){
    console.log("hi");
    var link =this.serverUrl+'emailverify';
    //var link = 'http://influxiq.com:3001/emailverify';
    var data = {id : this.id};


    this._http.post(link, data)
        .subscribe(res => {
          var result = res.json();

          console.log(result.id);

          this.router.navigate(['/resetpassword/'+result.id]);


          //this.router.navigate(['/login']);
        }, error => {
          console.log("Oooops!");
        });
  }
}
