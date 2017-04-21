import { Component, OnInit } from '@angular/core';
declare var $:any;
@Component({
  selector: 'app-newmomsguide',
  templateUrl: './newmomsguide.component.html',
  styleUrls: ['./newmomsguide.component.css']
})
export class NewmomsguideComponent implements OnInit {

  constructor() {
    $('.lyfehairhandhead').click(function(){

      $('.lyfehairhandcontent').hide();
      $(this).next().show(1000);
    });
  }

  ngOnInit() {
  }

}
