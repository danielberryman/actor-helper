import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import * as faceapi from 'face-api.js';

@Component({
  selector: 'app-facial-recognition',
  templateUrl: './facial-recognition.component.html',
  styleUrls: ['./facial-recognition.component.scss']
})
export class FacialRecognitionComponent implements OnInit, AfterViewInit {
  imageUpload;
  container;

  constructor() { }

  ngOnInit(): void {
    console.log(faceapi.nets);
    this.imageUpload = <HTMLInputElement>document.getElementById('imageUpload');
    this.imageUpload.addEventListener('change', this.changeHandler);
    this.container = document.createElement('div');
  }

  ngAfterViewInit(): void {
    Promise.all([
      // Recognize faces
      faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models'),
      // Algorithm finds where the faces are
      faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models'),
      // Finds which ones are faces
      faceapi.nets.ssdMobilenetv1.loadFromUri('/assets/models')
    ]).then(this.start);
  }

  start() {
    document.body.append('Loaded!');
  }

  changeHandler = this.changeHandlerUnbinded.bind(this);

  async changeHandlerUnbinded(e) {
    this.container = document.createElement('div');
    this.container.style.position = 'relative';
    document.body.append(this.container);
    const image = await faceapi.bufferToImage(this.imageUpload.files[0]);
    const canvas = faceapi.createCanvasFromMedia(image);
    canvas.style.cssText = 'position: absolute;top: 0;left: 0;';
    this.container.append(image);
    this.container.append(canvas);
    const displaySize = { width: image.width, height: image.height };
    faceapi.matchDimensions(canvas, displaySize);
    const detections = await faceapi.detectAllFaces(image)
      .withFaceLandmarks().withFaceDescriptors();
    const resizedDectections = faceapi.resizeResults(detections, displaySize);
    resizedDectections.forEach(detections => {
      const box = detections.detection.box;
      const drawBox = new faceapi.draw.DrawBox(box, { label: 'Face' });
      drawBox.draw(canvas);
    })
  }

}
