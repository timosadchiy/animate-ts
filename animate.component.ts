import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {AnimationEvent, state, style, trigger} from '@angular/animations';
import {AnimateActionAlias, AnimateActionEnum} from './animate-action.enum';
import {AnimateFrame} from './animate-frame.class';
import {AnimateFades} from './animate-fades.class';

export const AnimateTransitions = [
  state(AnimateActionEnum.Visible, style({opacity: 1})),
  state(AnimateActionEnum.Hidden, style({opacity: 0})),
  AnimateFades.FadeIn,
  AnimateFades.FadeInUp,
  AnimateFades.FadeInUpBig,
  AnimateFades.FadeInRight,
  AnimateFades.FadeInRightBig,
  AnimateFades.FadeInDown,
  AnimateFades.FadeInDownBig,
  AnimateFades.FadeInLeft,
  AnimateFades.FadeInLeftBig,
  AnimateFades.FadeOut,
  AnimateFades.FadeOutUp,
  AnimateFades.FadeOutUpBig,
  AnimateFades.FadeOutRight,
  AnimateFades.FadeOutRightBig,
  AnimateFades.FadeOutDown,
  AnimateFades.FadeOutDownBig,
  AnimateFades.FadeOutLeft,
  AnimateFades.FadeOutLeftBig,
];

@Component({
  selector: 'anm',
  templateUrl: './animate.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('animateState', AnimateTransitions)
  ]
})

export class AnimateComponent implements OnChanges {

  actionValue: AnimateActionEnum | undefined;

  @Input()
  get action(): AnimateActionEnum | undefined {
    return this.actionValue;
  }

  @Output() actionChange = new EventEmitter();

  set action(act: AnimateActionEnum | undefined) {
    this.actionValue = act;
    this.actionChange.emit(this.actionValue);
  }


  @Input() actionQueue: AnimateFrame[];
  @Input() display: boolean;

  @Output() started: EventEmitter<any> = new EventEmitter();
  @Output() done: EventEmitter<any> = new EventEmitter();

  @Output() onShown: EventEmitter<any> = new EventEmitter();
  @Output() onHidden: EventEmitter<any> = new EventEmitter();

  displayed: boolean;

  constructor() {
  }

  ngOnChanges(): void {
    if (this.actionQueue != null &&
      this.actionQueue.length !== 0) {
      this.startAnimationQueue();
    }
  }

  emitStarted($event: AnimationEvent): void {
    this.setDisplayed();
    this.started.emit($event);
  }

  emitDone($event: AnimationEvent): void {
    this.setNotDisplayed();
    this.refreshAction();
    this.emitVisibility($event);
  }

  private startAnimationQueue(): void {
    const nextFrame = this.actionQueue.shift();
    if (nextFrame != null) {
      this.action = nextFrame.action;
    }
  }

  private setDisplayed(): void {
    if (AnimateActionAlias.getItem(this.actionValue) === AnimateActionEnum.Visible || this.display !== false) {
      this.displayed = true;
    }
  }

  private setNotDisplayed(): void {
    if (AnimateActionAlias.getItem(this.actionValue) === AnimateActionEnum.Hidden && !this.display) {
      this.displayed = false;
    }
  }

  private refreshAction(): void {
    if (this.actionQueue != null && this.actionQueue.length > 0) {
      this.startAnimationQueue();
    } else {
      this.action = AnimateActionAlias.getItem(this.actionValue);
    }
  }

  private emitVisibility($event: AnimationEvent): void {
    this.done.emit($event);
    if (AnimateActionAlias.getItem(this.actionValue) === AnimateActionEnum.Hidden) {
      this.onHidden.emit($event);
    } else {
      this.onShown.emit($event);
    }
  }

}
