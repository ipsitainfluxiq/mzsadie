import { Component, OnInit } from '@angular/core';
declare var $:any;
@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.component.html',
  styleUrls: ['./nutrition.component.css']
})
export class NutritionComponent implements OnInit {

  constructor() {
    $('.lyfehairhandhead').click(function(){

      $('.lyfehairhandcontent').hide();
      $(this).next().show(3000);
    });
  }

  ngOnInit() {
  }

}
