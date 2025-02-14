import { Component, Input } from '@angular/core';
import { DataSetting, SensitiveArea } from '@app/interfaces/interfaces';
import { sensitiveAreaColors } from '@env/variables';

@Component({
  selector: 'app-sensitive-area',
  templateUrl: './sensitive-area.component.html',
  styleUrls: ['./sensitive-area.component.scss']
})
export class SensitiveAreaComponent {
  @Input() public sensitiveArea!: SensitiveArea | any;
  @Input() public sensitiveAreaPractices!: DataSetting | undefined;

  getSensitiveAreaPracticeName(id: number): string {
    return this.sensitiveAreaPractices!.values.find(
      (sensitiveAreaPractice) => sensitiveAreaPractice.id === id
    )!.name;
  }

  getSensitiveAreaPeriod(index: number): string {
    return `${new Date(0, index + 1, 0).toLocaleDateString('fr', { month: 'long' }).toUpperCase()}${
      this.sensitiveArea.properties.period
        .slice(index + 1)
        .find((month: boolean) => month)
        ? ' -&nbsp;'
        : ''
    }`;
  }

  getSensitiveAreaColor() {
    return sensitiveAreaColors[
      this.sensitiveArea.properties.id % sensitiveAreaColors.length
    ];
  }
}
