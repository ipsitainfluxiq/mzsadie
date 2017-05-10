import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-emailverify',
  templateUrl: './emailverify.component.html',
  styleUrls: ['./emailverify.component.css']
})
export class EmailverifyComponent implements OnInit {
  private id;
  constructor(private _http: Http,private router: Router, private route: ActivatedRoute) {

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
    var link = 'http://influxiq.com:3001/emailverify';
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
