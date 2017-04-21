import { Component, OnInit } from '@angular/core';
declare var $:any;
@Component({
  selector: 'app-fitness',
  templateUrl: './fitness.component.html',
  styleUrls: ['./fitness.component.css']
})
export class FitnessComponent implements OnInit {

  constructor() {

  }

  ngOnInit() {
  }
  openpopup1(){
    $('#myModal1').modal('show');
  }
  openpopup2(){
    $('#myModal2').modal('show');
  }


}
