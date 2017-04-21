import { Component, OnInit } from '@angular/core';
declare var $:any;
@Component({
  selector: 'app-hairhandsnailsfeet',
  templateUrl: './hairhandsnailsfeet.component.html',
  styleUrls: ['./hairhandsnailsfeet.component.css']
})
export class HairhandsnailsfeetComponent implements OnInit {

  constructor() {
    $('.lyfehairhandhead').click(function(){

      $('.lyfehairhandcontent').hide();
      $(this).next().show(1000);
    });
  }

  ngOnInit() {
  }

}
