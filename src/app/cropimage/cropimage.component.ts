import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
//import Cropper from 'cr';
declare var $:any;
@Component({
  selector: 'app-cropimage',
  templateUrl: './cropimage.component.html',
  styleUrls: ['./cropimage.component.css']
})
export class CropimageComponent implements OnInit {

  @ViewChild('imageSrc') input: ElementRef;

  constructor() {

    setTimeout(function () {


      $('#demo').cropbox({
        selectors: {
          inputInfo: '#demo textarea.data',
          inputFile: '#demo input[type="file"]',
          btnCrop: '#demo .btn-crop',
          btnReset: '#demo .btn-reset',
          resultContainer: '#demo .cropped .panel-body',
          messageBlock: '#message'
        },

        imageOptions: {
          class: 'img-thumbnail',
          style: 'margin-right: 5px; margin-bottom: 5px'
        },

        variants: [{
          width: 200,
          height: 200,
          minWidth: 180,
          minHeight: 200,
          maxWidth: 350,
          maxHeight: 350
        },{
          width: 150,
          height: 200
        }],

        messages: [
          'Crop a middle image.',
          'Crop a small image.'
        ]

      });


    },3000);
  }

  ngOnInit() {
  }




}
