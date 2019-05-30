import { Component, ViewChild, Input } from '@angular/core';
import { AnimationBuilder, AnimationPlayer, style, animate } from '@angular/animations';

@Component({
  selector: 'aa-loader',
  template: `
    <div class="loading-stage">
      <div class="loading-bar" #loadingBar>
        {{ percentage }}%
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .loading-bar {
        height: 52px;
        color: white;
        line-height: 52px;
        font-size: 1.5rem;
        text-align: center;
        background: #009688;
      }
    `
  ]
})
export class LoaderComponent {

  @ViewChild('loadingBar')
  loadingBar;
  player: AnimationPlayer;
  private percent = 0;

  constructor(private builder: AnimationBuilder) {}

  get percentage() { return this.percent; }

  @Input()
  set percentage(p: number) {
    const lastPercentage = this.percent;
    this.percent = p;

    if (this.player) {
      this.player.destroy();
    }

    const factory = this.builder.build([
      style({ width: lastPercentage + '%' }),
      animate('777ms cubic-bezier(.35, 0, .25, 1)', style({ width: p + '%' }))
    ]);
    this.player = factory.create(this.loadingBar.nativeElement, {});
    this.player.play();
  }
}
