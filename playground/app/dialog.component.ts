import { Component, ElementRef, Injectable } from 'mojiito-core';

@Component({
  selector: '.mdl-dialog__actions'
})
export class DialogActionsComponent {

  constructor(private elementRef: ElementRef) {
    console.log(elementRef.nativeElement);
  }

}

@Component({
  selector: 'dialog',
  components: [DialogActionsComponent]
})
export class DialogComponent {

  constructor(private elementRef: ElementRef) {
    console.log(elementRef.nativeElement);
  }

}


@Injectable()
export class Dialog {
}