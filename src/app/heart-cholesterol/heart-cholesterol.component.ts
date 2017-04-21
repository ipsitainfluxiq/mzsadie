import { Component, OnInit } from '@angular/core';
declare var $:any;
@Component({
  selector: 'app-heart-cholesterol',
  templateUrl: './heart-cholesterol.component.html',
  styleUrls: ['./heart-cholesterol.component.css']
})
export class HeartCholesterolComponent implements OnInit {

  constructor() {
    $('.lyfehairhandhead').click(function(){

      $('.lyfehairhandcontent').hide();
      $(this).next().show(1000);
    });
  }

  ngOnInit() {
  }

}
