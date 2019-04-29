import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StyleSingletonService {

  constructor() { }
  
  backgroundColor: string = "#795548";
  color: string = "#fafafa";

  setColors(bgColor: string, lColor: string){
    this.backgroundColor = bgColor;
    this.color = lColor;
  }

  getBackGroundColor(): string {
    return this.backgroundColor;
  }
  
}
