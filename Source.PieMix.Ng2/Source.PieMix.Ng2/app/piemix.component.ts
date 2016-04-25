import {Component, Input} from 'angular2/core';

@Component({
    selector: 'pie-mix',
    templateUrl: 'app/piemix.component.html'
})

export class PieMixComponent {

    svgHolderHeight = '500px';
    svgHeight = '';
    baseRadius = 100;
    radiusIncrementFactor = 60;
    strokeColor = '#fff';
    strokeWidth = 0;
    showLabels = true;
    showStrokeCircleAtCenter = true;
    coordinates = {};
    generatedPies = [];
    centerXY = {};
    _maxRad = {};

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

    config = {
        'baseRadius': 80,
        'radiusIncrementFactor': 0.50,
        'gapToLabel': 60,
        'strokeWidth': 3,
        'showLabels': true,
        'strokeColor': '#fff',
        'showStrokeCircleAtCenter': true
    };

    //private _startGenerating() {
    //    this.generatedPies = [];
    //    this.centerXY = this._getCenterXY(this.pieData, 5);
    //    this.svgWidth = this.getContainerWidth();
    //    this.svgHeight = (2 * this._maxRad) + 100;
    //    this._generatePies(slices, 1, null);
    //    if (this.showStrokeCircleAtCenter == true) {
    //        this.strokeCircle = { 'cx': this.centerXY.x, 'cy': this.centerXY.y, 'r': this.baseRadius * 0.5, 'fill': this.strokeColor };
    //    }
    //    var _pieSlic = { '_uid': _GUID(), 'activecolor': this.strokeColor, 'color': this.strokeColor };
    //    //$timeout(this._drawHelpBoxes, 500);
    //    console.log(this.config);
    //    console.log(this.pieData);
    //}

    private _init() {
        //this._startGenerating();
    }

    constructor() {
        this._init();
    };

}
