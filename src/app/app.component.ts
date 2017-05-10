import { Component } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
declare var $:any;
declare var tinymce: any;
@Component({
  selector: 'app-root',
  //template: '<router-outlet name="header"></router-outlet><router-outlet></router-outlet><router-outlet name="footer"></router-outlet>',
  template: '<router-outlet name="header"></router-outlet><div class="dashboard_body"><router-outlet name="leftsidebar"></router-outlet><router-outlet></router-outlet></div><div class="clearfix"></div><router-outlet name="footer"></router-outlet>',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private sub: any;
  footer: any;
  //leftsidebar: any;
  //private router: any;


  constructor(private router: Router) {}
  ngOnInit() {

    /* this subscription will fire always when the url changes */
    this.router.events.subscribe(val=> {

      /* the router will fire multiple events */
      /* we only want to react if it's the final active route */
      if (val instanceof NavigationEnd) {

        /* the variable curUrlTree holds all params, queryParams, segments and fragments from the current (active) route */
        let curUrlTree = this.router.parseUrl(this.router.url);

        console.info(this.router.url);
        console.info(curUrlTree);
        console.info(curUrlTree.queryParams);
        //console.log("test");
        console.info(this.router.url);
        console.info(curUrlTree.root);
        console.info(curUrlTree.root.children);
        console.info(curUrlTree.root.children.header);
        console.info(curUrlTree.root.children.footer);
        if(this.router.url.indexOf("login")==-1 )
        if(typeof (curUrlTree.root.children.header)=='undefined' || typeof (curUrlTree.root.children.footer)=='undefined'){
          this.router.navigateByUrl(this.router.url+'(header:header//footer:footer)');

        }

       /* console.info(curUrlTree.root.children.leftsidebar);
        if(typeof (curUrlTree.root.children.header)=='undefined' ||typeof (curUrlTree.root.children.leftsidebar)=='undefined' ||typeof (curUrlTree.root.children.footer)=='undefined' ){
         this.router.navigateByUrl(this.router.url+'(header:header//leftsidebar:leftsidebar//footer:footer)');
         }*/
      }
    });
  }
  title = 'app works!';
  ngAfterViewChecked(){
    $('.lyfehairhandhead').click(function(){

      $('.lyfehairhandcontent').hide();
      $(this).next().show(1000);
    });
  }

}

