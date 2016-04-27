import {Component} from 'angular2/core';
import {PieMixComponent} from './piemix.component';
@Component({
    selector: 'my-app',
    template: `
        <button (click)="pieConfigRadiusIncrementChange()">Change Radius Increment</button>
        <button (click)="pieDataChange()">Change Data</button>
        <pie-mix [slices]="pie" [config]="pieConfig"></pie-mix>
                `,
    directives: [PieMixComponent]
})
export class AppComponent {
    title = 'Tour of Heroes';
    pieData = [
        {
            'id': '1001', 'title': '# c0392b', 'value': 20, 'color': '#c0392b', 'child': [
                {
                    'id': '101', 'title': '# 34495e', 'value': 60, 'color': '#34495e', 'child': [
                        {
                            'id': '201', 'title': '# 3498db', 'value': 40, 'color': '#3498db', 'child': [
                                { 'id': '301', 'title': '# f39c12', 'value': 67, 'color': '#f39c12' },
                                { 'id': '302', 'title': '# e74c3c', 'value': 33, 'color': '#e74c3c' }
                            ]
                        },
                        { 'id': '202', 'title': '# 9b59b6', 'value': 60, 'color': '#9b59b6' }
                    ]
                },
                { 'id': '102', 'title': '# 2ecc71', 'value': 20, 'color': '#2ecc71' },
                { 'id': '103', 'title': '# 16a085', 'value': 20, 'color': '#16a085' }
            ]
        }
    ];

    pieData2 = [
        { 'id': '101', 'title': '# 34495e', 'value': 60, 'color': '#34495e' },
        { 'id': '102', 'title': '# 2ecc71', 'value': 20, 'color': '#2ecc71' },
        { 'id': '103', 'title': '# 16a085', 'value': 20, 'color': '#16a085' }
    ];

    pie:any = this.pieData;

    pieConfig = {
        'baseRadius': 80,
        'radiusIncrementFactor': 0.50,
        'gapToLabel': 60,
        'strokeWidth': 3,
        'showLabels': true,
        'strokeColor': '#fff',
        'showStrokeCircleAtCenter': true
    };

    incr2: number = 0;
    pieConfigRadiusIncrementChange(): void {
        if (this.incr2 % 2 == 0)
            this.pieConfig.radiusIncrementFactor = 0.66;
        else
            this.pieConfig.radiusIncrementFactor = 0.33;
        this.incr2 = this.incr2 + 1;
        console.log(this);
    }

    incr3: number = 0;
    pieDataChange(): void {
        if (this.incr3 % 2 == 0)
            this.pie = this.pieData2;
        else
            this.pie = this.pieData;
        this.incr3 = this.incr3 + 1;
        console.log(this);
    }

}