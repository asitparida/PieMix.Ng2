import {Component, Input} from 'angular2/core';

import {ViewContainerRef, AfterViewInit} from 'angular2/core';


@Component({
    selector: 'pie-mix',
    templateUrl: 'app/piemix.component.html',
    providers: [ViewContainerRef]
})

export class PieMixComponent implements AfterViewInit {

    svgHolderHeight: number = 500;
    svgHeight: number = 0;
    svgWidth: number = 0;
    baseRadius: number = 100;
    radiusIncrementFactor: number = 60;
    strokeColor: string = '#fff';
    strokeWidth: number = 0;
    gapToLabel: number = 0;
    showLabels: boolean = true;
    showStrokeCircleAtCenter: boolean = true;
    //coordinates = {};
    centerXY: CoordinatePair = new CoordinatePair(0, 0);
    maxRad: number = 5
    generatedPies = [];
    coordinateMaps: CoordinatePairMapToId = {};
    strokeCircle: any = {};

    //_templateRef: TemplateRef;
    //_viewContainer: ViewContainerRef;

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

    private generateCoordinates(deg, rad, centerXY): CoordinatePair {
        let id: string = deg + 'deg_' + rad + '_rad' + JSON.stringify(this.centerXY);
        if (typeof this.coordinateMaps[id] !== 'undefined' && this.coordinateMaps[id] != null)
            return this.coordinateMaps[id];
        var x = 0, y = 0;
        var rSin0 = Math.abs(rad * Math.sin(deg * 0.0174533));
        var rCos0 = Math.abs(rad * Math.cos(deg * 0.0174533));
        if (deg >= 0 && deg <= 90) {
            x = centerXY.x + rSin0; y = centerXY.y - rCos0;
        }
        else if (deg >= 90 && deg <= 180) {
            x = centerXY.x + rSin0; y = centerXY.y + rCos0;
        }
        else if (deg >= 180 && deg <= 270) {
            x = centerXY.x - rSin0; y = centerXY.y + rCos0;
        }
        else {
            x = centerXY.x - rSin0; y = centerXY.y - rCos0;
        }
        this.coordinateMaps[id] = new CoordinatePair(Math.ceil(x), Math.ceil(y));
        return this.coordinateMaps[id];
    }

    private generatePies = function (_origPie, itr, _parentPiece): void {
        var _totalPieValue = _.reduce(_origPie, function (memo, item) { return memo + item.value }, 0);
        var _degStart = 0;
        let self = this;
        _.each(_origPie, function (_slice, peiceIter) {
            //radius for this iteration
            var _ctr = 0;
            var _rad = self.baseRadius;
            var _tempRad = self.baseRadius;
            while (_ctr < itr - 1) {
                _tempRad = _tempRad * self.radiusIncrementFactor;
                _rad = _rad + _tempRad;
                _ctr = _ctr + 1;
            }
            //calculate degree for arc
            var _netMulFactor = 360;
            if (typeof _parentPiece !== 'undefined' && _parentPiece != null && typeof _parentPiece.deg !== 'undefined' && _parentPiece.deg != null)
                _netMulFactor = _parentPiece.deg;
            var _deg = Math.ceil((_slice.value / _totalPieValue) * _netMulFactor);
            var _degEnd = _degStart + _deg;
            //calculate start point and end point for arc
            var _effectiveDeg = _degStart + _deg + (typeof _slice.degStart !== 'undefined' && _slice.degStart != null && _slice.degStart != {} ? _slice.degStart : 0);
            var _midDeg = _degStart + ((_effectiveDeg - _degStart) / 2);
            var startXY = self.generateCoordinates(_degStart, _rad, self.centerXY);
            var midXY = self.generateCoordinates(_midDeg, _rad, self.centerXY);
            var endXY = self.generateCoordinates(_effectiveDeg, _rad, self.centerXY);
            //Assigningg path coeff
            var _pathCoeff = 0;
            if (_deg > 180)
                _pathCoeff = 1;
            // Assigning vals
            _slice._uid = _GUID();
            _slice.rad = _rad;
            _slice.deg = _deg;
            _slice.degStart = _degEnd - _deg;
            _slice.effectiveDeg = _effectiveDeg;
            _slice.midDeg = _midDeg;
            _slice.degEnd = _degEnd;
            _slice.startXY = startXY;
            _slice.midXY = midXY;
            _slice.endXY = endXY;
            _slice.pathCoeff = _pathCoeff;
            _slice.activecolor = _slice.color;
            _slice.priority = itr;
            var _path = '';
            if (_slice.effectiveDeg != 360)
                _path = 'M' + _slice.startXY.x + ' ' + _slice.startXY.y
                    + ' A ' + _slice.rad + ' ' + _slice.rad
                    + ', 0, '
                    + _slice.pathCoeff
                    + ', 1, '
                    + _slice.endXY.x + ' ' + _slice.endXY.y + ' L '
                    + self.centerXY.x + ' ' + self.centerXY.y + ' Z';
            else
                _path = 'M ' + self.centerXY.x + ' ' + self.centerXY.y
                    + ' m ' + (-_slice.rad) + ' ' + 0
                    + ' a ' + _slice.rad + ' ' + _slice.rad + ' 0 1 1 ' + (_slice.rad * 2) + ' 0'
                    + ' a ' + _slice.rad + ' ' + _slice.rad + ' 0 1 1 ' + (-(_slice.rad * 2)) + ' 0';
            _slice.d = _path;
            let _copy = _.clone(_slice);
            delete _copy.child;
            self.generatedPies.push(_copy);
            if (typeof _slice.child !== 'undefined' && _slice.child != {} && _slice.child.length > 0)
                self.generatePies(_slice.child, itr + 1, _slice);
            //Assign for next loop
            _degStart = _degEnd;
        });
    }

    private calDeepLength(slices: Array<any>): number {
        let len = 0;
        if (slices.length > 0)
            len = len + 1;
        for (let slice of slices) {
            if (typeof slice.child !== 'undefined' && slice.child != {} && slice.child.length > 0)
                len = len + this.calDeepLength(slice.child);
        }
        return len;
    }

    private calMaxRadius(slices: Array<any>): number {
        let maxIncrements: number = this.calDeepLength(slices);
        let maxRadius: number = this.baseRadius;
        let ctr = 0;
        while (ctr < maxIncrements - 1) {
            maxRadius = maxRadius + (this.baseRadius * this.radiusIncrementFactor);
            ctr = ctr + 1;
        }
        return maxRadius;
    }

    private getContainerWidth(): number {
        let elem = this.elemRef.element.nativeElement;
        if (typeof elem !== 'undefined' && elem != null)
            return jQuery(elem).width();
        else
            return (2 * this.maxRad);
    }

    private getContainerHeight(): number {
        let elem = this.elemRef.element.nativeElement;
        if (typeof elem !== 'undefined' && elem != null)
            return jQuery(elem).height();
        else
            return (2 * this.maxRad);
    }

    private getCenterXY(slices: Array<any>, pad: number): CoordinatePair {
        this.maxRad = this.calMaxRadius(slices);
        let widthBuffer = this.getContainerWidth() / 2;
        if (!pad) pad = 0;
        return new CoordinatePair(widthBuffer, this.maxRad + (pad * 2));
    }

    private calcQuadrants(): CoordinatePairMapToId {
        let quadrant: CoordinatePairMapToId = {};
        let width = this.getContainerWidth();
        let height = this.getContainerHeight();
        let whalf = width / 2;
        let hhalf = height / 2;
        let centerXY = this.centerXY;
        let gap = this.gapToLabel;
        let rad = this.maxRad;
        if (rad + gap <= (width - 30)) {
            quadrant['NE'] = new CoordinatePair(centerXY.x + rad + gap, 10);
            quadrant['NW'] = new CoordinatePair(centerXY.x - rad - gap, 10);
            quadrant['SE'] = new CoordinatePair(centerXY.x + rad + gap, centerXY.y);
            quadrant['SW'] = new CoordinatePair(centerXY.x - rad - gap, centerXY.y);
        }
        return quadrant;
    }

    private getQuadrantKey(deg: number): string {
        let ret = '';
        if (0 <= deg && deg <= 90) ret = 'NE';
        else if (90 < deg && deg <= 180) ret = 'SE';
        else if (180 < deg && deg <= 270) ret = 'SW';
        else if (270 < deg && deg <= 360) ret = 'NW';
        return ret;
    }

    private drawHelpBoxes(): void {
        let ctr: any = { 'NE': 0, 'SE': 0, 'NW': 0, 'SW': 0 };
        let minBoxHeight = 50;
        let pies = _.sortBy(this.generatedPies, function (slice) { return -slice.priority });
        let self = this;
        /* GET MIN X & Y FROM ELEMENT */
        let quadrant = this.calcQuadrants();
        _.each(pies, function (slice) {
            ctr['id'] = slice.id;
            let quadKey = self.getQuadrantKey(slice.midDeg);
            let baseXY = _.clone(quadrant[quadKey]);
            baseXY.y = baseXY.y + ctr[quadKey];
            /* calaculating ptr string for */
            if (quadKey == 'NE' || quadKey == 'SE') {
                let midpoint = { 'x': baseXY.x, 'y': baseXY.y };
                let stpoint = { 'x': baseXY.x + 100, 'y': baseXY.y };
                let endPoint = slice.midXY;
                slice._ptr = endPoint.x + ',' + endPoint.y + ' ' + midpoint.x + ',' + midpoint.y + ' ' + stpoint.x + ',' + stpoint.y;
                /* calculating color box coordinates */
                slice.colorBox = { 'x': midpoint.x, 'y': midpoint.y + 8 };
                /* calculating text box coordinates */
                slice.textBox = { 'x': midpoint.x + 24, 'y': midpoint.y + 20 };
                /* increment ctr */
                slice.incr = ctr[quadKey];
            }
            else if (quadKey == 'NW' || quadKey == 'SW') {
                let midpoint = { 'x': baseXY.x, 'y': baseXY.y };
                let stpoint = { 'x': baseXY.x - 100, 'y': baseXY.y };
                let endPoint = slice.midXY;
                slice._ptr = stpoint.x + ',' + stpoint.y + ' ' + midpoint.x + ',' + midpoint.y + ' ' + endPoint.x + ',' + endPoint.y;
                /* calculating color box coordinates */
                slice.colorBox = { 'x': midpoint.x - 100, 'y': midpoint.y + 8 };
                /* calculating text box coordinates */
                slice.textBox = { 'x': midpoint.x - 100 + 24, 'y': midpoint.y + 20 };
                /* increment ctr */
                slice.incr = ctr[quadKey];
            }
            ctr[quadKey] = ctr[quadKey] + minBoxHeight;
            var _actSlice = _.find(self.generatedPies, function (_sl) { return _sl._uid.localeCompare(slice._uid) == 0; })
            if (typeof _actSlice !== 'undefined' && _actSlice != null && _actSlice != {}) {
                _actSlice.colorBox = slice.colorBox;
                _actSlice.textBox = slice.textBox;
                _actSlice.ptr = slice._ptr;
                _actSlice.fillOpacity = 1;
            }
        });
    }

    private startGenerating(slices: Array<any>) {
        this.generatedPies = [];
        this.centerXY = this.getCenterXY(slices, 5);
        this.svgWidth = this.getContainerWidth();
        this.svgHeight = (2 * this.maxRad) + 100;
        this.generatePies(slices, 1, null);
        //insert center white stroke filled circle
        if (this.showStrokeCircleAtCenter == true) {
            this.strokeCircle = { 'cx': this.centerXY.x, 'cy': this.centerXY.y, 'r': this.baseRadius * 0.5, 'fill': this.strokeColor };
        }
        //let _pieSlic = { '_uid': _GUID(), 'activecolor': this.strokeColor, 'color': this.strokeColor };
        //$timeout(this.drawHelpBoxes, 500);
    }


    private init(values) {
        this.baseRadius = this.config.baseRadius || 100;
        this.radiusIncrementFactor = this.config.radiusIncrementFactor || 0.66;
        this.gapToLabel = this.config.gapToLabel || 60;
        this.strokeColor = this.config.strokeColor || '#fff';
        this.strokeWidth = this.config.strokeWidth || 0;
        this.showLabels = this.config.showLabels;
        this.showStrokeCircleAtCenter = this.config.showStrokeCircleAtCenter;
        this.coordinateMaps = {};
        this.generatedPies = [];
        this.centerXY = new CoordinatePair(0, 0);
        this.maxRad = 0;
        this.startGenerating(values);
    }

    ngAfterViewInit() {
        // viewChild is updated after the view has been initialized
        console.log(this.getContainerWidth());
    }

    constructor(private elemRef: ViewContainerRef) {
        this.init(this.pieData);
        console.log(this.calDeepLength(this.pieData));
    };

}

export class CoordinatePair {
    constructor(public x: number, public y: number) { }
}

interface CoordinatePairMapToId {
    [id: string]: CoordinatePair;
}

function _GUID(): string {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + "_" + s4();
}

export class NonDisplayPieProperties {

    rad: number = 0;
    degStart: number = 0;
    effectiveDeg: number = 0;
    midDeg: number = 0;
    degEnd: number = 0;
    startXY: CoordinatePair;
    midXY: CoordinatePair;
    endXY: CoordinatePair;
    pathCoeff: number = 0;

    constructor() {
        this.startXY = new CoordinatePair(0, 0);
        this.midXY = new CoordinatePair(0, 0);
        this.endXY = new CoordinatePair(0, 0);
    }
}

export class PieSlice extends NonDisplayPieProperties {
    _uid: string = '';
    d: string = '';
    prority: number = 0;
    activecolor: string = '';
    color: string = '';
    colorBox: CoordinatePair;
    fillOpacity: number = 0;
    textBox: CoordinatePair;
    title: string = '';
    ptr: any = {};
    constructor() {
        super();
        this._uid = _GUID();
    }
}