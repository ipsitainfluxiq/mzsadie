import { Component, OnInit } from '@angular/core';
declare var $:any;
@Component({
  selector: 'app-home-beauty-remedies',
  templateUrl: './home-beauty-remedies.component.html',
  styleUrls: ['./home-beauty-remedies.component.css']
})

export class HomeBeautyRemediesComponent implements OnInit {

  constructor() {
      $('.lyfehairhandhead').click(function(){

          $('.lyfehairhandcontent').hide();
          $(this).next().show(1000);
      });
  }

  ngOnInit() {
  }
    ngAfterViewChecked(){
        $('.lyfehairhandhead').click(function(){

            $('.lyfehairhandcontent').hide();
            $(this).next().show(1000);
        });
    }
}
