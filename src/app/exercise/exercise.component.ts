import { Component, OnInit } from '@angular/core';
declare var $:any;
@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.css']
})
export class ExerciseComponent implements OnInit {

  constructor() {
    $('.lyfehairhandhead').click(function(){

      $('.lyfehairhandcontent').hide();
      $(this).next().show(3000);
    });
  }

  ngOnInit() {
  }
 /* ngAfterViewInit(){
    console.log("after vw");
  }*/
  ngAfterViewChecked(){
    $('.lyfehairhandhead').click(function(){

      $('.lyfehairhandcontent').hide();
      $(this).next().show(1000);
    });
  }

}
