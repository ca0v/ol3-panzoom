import ol = require("openlayers");
import ZoomSlider = require("./zoomslidercontrol");

/**
 * extends the base object without replacing defined attributes
 */
function defaults<A, B>(a: A, ...b: B[]): A & B {
  b.forEach(b => {
    Object.keys(b).filter(k => a[k] === undefined).forEach(k => a[k] = b[k]);
  });
  return <A & B>a;
}

function on(element: HTMLElement, event: string, listener: (event?: UIEvent) => any) {
  element.addEventListener(event, listener);
  return () => element.removeEventListener(event, listener);
}

export interface IPanZoomOptions extends olx.control.ControlOptions {
  className?: string;
  imgPath?: string;
  duration?: number;
  maxExtent?: ol.Extent;
  minZoom?: number;
  maxZoom?: number;
  pixelDelta?: number;
  slider?: boolean;
  zoomDelta?: number;
}

const DEFAULT_OPTIONS: IPanZoomOptions = {
}

export class PanZoom extends ol.control.Control {
  private className_: string;
  private imgPath_: string;
  private listenerKeys_: Array<Function>;
  private duration_: number;
  private maxExtent_: ol.Extent;
  private maxZoom_: number;
  private minZoom_: number;
  private zoomSliderCtrl_: ZoomSlider;
  private panEastEl_: HTMLDivElement;
  private panWestEl_: HTMLDivElement;
  private panNorthEl_: HTMLDivElement;
  private panSouthEl_: HTMLDivElement;
  private zoomInEl_: HTMLDivElement;
  private zoomOutEl_: HTMLDivElement;
  private zoomMaxEl_: HTMLElement;
  private zoomDelta_: number;
  private slider_: boolean;

  private element_: HTMLElement; // masks ancestor?
  private pixelDelta_: number;

  constructor(options = DEFAULT_OPTIONS) {

    options = defaults({}, options, DEFAULT_OPTIONS);
    super(options);

    this.className_ = options.className ? options.className : 'ol-panzoom';
    this.imgPath_ = options.imgPath || './ol3-panzoom/resources/ol2img';

    var element = this.element = this.element_ = this.createEl_();
    this.setTarget(options.target);

    this.listenerKeys_ = [];

    this.duration_ = options.duration !== undefined ? options.duration : 100;
    this.maxExtent_ = options.maxExtent ? options.maxExtent : null;
    this.maxZoom_ = options.maxZoom ? options.maxZoom : 19;
    this.minZoom_ = options.minZoom ? options.minZoom : 0;
    this.pixelDelta_ = options.pixelDelta !== undefined ? options.pixelDelta : 128;
    this.slider_ = options.slider !== undefined ? options.slider : false;
    this.zoomDelta_ = options.zoomDelta !== undefined ? options.zoomDelta : 1;
    this.panEastEl_ = this.createButtonEl_('pan-east');
    this.panNorthEl_ = this.createButtonEl_('pan-north');
    this.panSouthEl_ = this.createButtonEl_('pan-south');
    this.panWestEl_ = this.createButtonEl_('pan-west');
    this.zoomInEl_ = this.createButtonEl_('zoom-in');
    this.zoomOutEl_ = this.createButtonEl_('zoom-out');
    this.zoomMaxEl_ = (!this.slider_ && this.maxExtent_) ? this.createButtonEl_('zoom-max') : null;
    this.zoomSliderCtrl_ = (this.slider_) ? new ZoomSlider() : null;

    element.appendChild(this.panNorthEl_);
    element.appendChild(this.panWestEl_);
    element.appendChild(this.panEastEl_);
    element.appendChild(this.panSouthEl_);
    element.appendChild(this.zoomInEl_);
    element.appendChild(this.zoomOutEl_);

    if (this.zoomMaxEl_) {
      element.appendChild(this.zoomMaxEl_);
    }

  }


  /**
   * @param {ol.Map} map
   * @api
   */
  setMap(map) {

    var keys = this.listenerKeys_;
    var zoomSlider = this.zoomSliderCtrl_;

    var currentMap = this.getMap();
    if (currentMap && currentMap instanceof ol.Map) {
      keys.forEach(k => k());
      keys.length = 0;
      if (this.zoomSliderCtrl_) {
        this.zoomSliderCtrl_.setTarget(null);
        window.setTimeout(function () {
          currentMap.removeControl(zoomSlider);
        }, 0);
      }
    }

    super.setMap(map);

    if (map) {
      keys.push(on(this.panEastEl_, "click", evt => this.pan_('east', evt)));
      keys.push(on(this.panNorthEl_, "click", evt => this.pan_('north', evt)));
      keys.push(on(this.panSouthEl_, "click", evt => this.pan_('south', evt)));
      keys.push(on(this.panWestEl_, "click", evt => this.pan_('west', evt)));

      keys.push(on(this.zoomInEl_, "click", evt => this.zoom_('in', evt)));
      keys.push(on(this.zoomOutEl_, "click", evt => this.zoom_('out', evt)));

      if (this.maxExtent_ && !this.slider_) {
        keys.push(on(this.zoomMaxEl_, "click", evt => this.zoom_('max', evt)));
      }

      if (this.slider_) {
        zoomSlider.setTarget(this.element_);
        window.setTimeout(function () {
          map.addControl(zoomSlider);
        }, 0);
        this.adjustZoomSlider_();
      }
    }
  }


  private createEl_() {
    var path = this.imgPath_;
    var className = this.className_;
    var cssClasses = [
      className,
      'ol-unselectable'
    ];

    if (!path) {
      cssClasses.push('ol-control');
    }

    var element = document.createElement('div');
    element.className = cssClasses.join(' ');

    if (path) {
      element.style.left = '4px';
      element.style.position = 'absolute';
      element.style.top = '4px';
    }

    return element;
  }

  private createButtonEl_(action) {
    var divEl = document.createElement('div');
    var path = this.imgPath_;
    var maxExtent = this.maxExtent_;
    var slider = this.slider_;

    if (path) {
      divEl.style.width = '18px';
      divEl.style.height = '18px';
      divEl.style.position = 'absolute';
      divEl.style.cursor = 'pointer';

      var imgEl = document.createElement('img');
      imgEl.style.width = '18px';
      imgEl.style.height = '18px';
      imgEl.style['vertical-align'] = 'top';

      switch (action) {
        case 'pan-east':
          imgEl.id = 'OpenLayers_Control_PanZoom_panright_innerImage';
          imgEl.src = [path, 'east-mini.png'].join('/');
          divEl.id = 'OpenLayers_Control_PanZoom_panright';
          divEl.style.top = '22px';
          divEl.style.left = '22px';
          break;
        case 'pan-north':
          imgEl.id = 'OpenLayers_Control_PanZoom_panup_innerImage';
          imgEl.src = [path, 'north-mini.png'].join('/');
          divEl.id = 'OpenLayers_Control_PanZoom_panup';
          divEl.style.top = '4px';
          divEl.style.left = '13px';
          break;
        case 'pan-south':
          imgEl.id = 'OpenLayers_Control_PanZoom_pandown_innerImage';
          imgEl.src = [path, 'south-mini.png'].join('/');
          divEl.id = 'OpenLayers_Control_PanZoom_pandown';
          divEl.style.top = '40px';
          divEl.style.left = '13px';
          break;
        case 'pan-west':
          imgEl.id = 'OpenLayers_Control_PanZoom_panleft_innerImage';
          imgEl.src = [path, 'west-mini.png'].join('/');
          divEl.id = 'OpenLayers_Control_PanZoom_panleft';
          divEl.style.top = '22px';
          divEl.style.left = '4px';
          break;
        case 'zoom-in':
          imgEl.id = 'OpenLayers_Control_PanZoom_zoomin_innerImage';
          imgEl.src = [path, 'zoom-plus-mini.png'].join('/');
          divEl.id = 'OpenLayers_Control_PanZoom_zoomin';
          divEl.style.top = '63px';
          divEl.style.left = '13px';
          break;
        case 'zoom-out':
          imgEl.id = 'OpenLayers_Control_PanZoom_zoomout_innerImage';
          imgEl.src = [path, 'zoom-minus-mini.png'].join('/');
          divEl.id = 'OpenLayers_Control_PanZoom_zoomout';
          if (slider) {
            divEl.style.top = [this.getSliderSize_() + 81, 'px'].join('');
          } else if (maxExtent) {
            divEl.style.top = '99px';
          } else {
            divEl.style.top = '81px';
          }
          divEl.style.left = '13px';
          break;
        case 'zoom-max':
          imgEl.id = 'OpenLayers_Control_PanZoom_zoomworld_innerImage';
          imgEl.src = [path, 'zoom-world-mini.png'].join('/');
          divEl.id = 'OpenLayers_Control_PanZoom_zoomworld';
          divEl.style.top = '81px';
          divEl.style.left = '13px';
          break;
      }
      divEl.appendChild(imgEl);
    }

    return divEl;
  }


  private pan_(direction: "south" | "west" | "east" | "north", evt) {
    var stopEvent = false;

    var map = this.getMap();
    console.assert(!!map, 'map must be set');
    var view = map.getView();
    console.assert(!!view, 'map must have view');
    var mapUnitsDelta = view.getResolution() * this.pixelDelta_;
    var deltaX = 0, deltaY = 0;
    if (direction == 'south') {
      deltaY = -mapUnitsDelta;
    } else if (direction == 'west') {
      deltaX = -mapUnitsDelta;
    } else if (direction == 'east') {
      deltaX = mapUnitsDelta;
    } else {
      deltaY = mapUnitsDelta;
    }
    var delta = <[number, number]>[deltaX, deltaY];
    ol.coordinate.rotate(delta, view.getRotation());

    // pan
    var currentCenter = view.getCenter();
    if (currentCenter) {
      if (this.duration_ && this.duration_ > 0) {
        map.beforeRender(ol.animation.pan({
          source: currentCenter,
          duration: this.duration_,
          easing: ol.easing.linear
        }));
      }
      var center = view.constrainCenter(
        [currentCenter[0] + delta[0], currentCenter[1] + delta[1]]);
      view.setCenter(center);
    }

    evt.preventDefault();
    stopEvent = true;

    return !stopEvent;
  }


  private zoom_(direction: "in" | "out" | "max", evt) {
    if (direction === 'in') {
      this.zoomByDelta_(this.zoomDelta_);
    } else if (direction === 'out') {
      this.zoomByDelta_(-this.zoomDelta_);
    } else if (direction === 'max') {
      var map = this.getMap();
      var view = map.getView();
      var extent = !this.maxExtent_ ?
        view.getProjection().getExtent() : this.maxExtent_;
      var size = map.getSize();
      console.assert(!!size, 'size should be defined');
      view.fit(extent, size);
    }
  }

  private zoomByDelta_(delta) {
    var map = this.getMap();
    var view = map.getView();
    if (!view) {
      // the map does not have a view, so we can't act
      // upon it
      return;
    }
    var currentResolution = view.getResolution();
    if (currentResolution) {
      if (this.duration_ > 0) {
        map.beforeRender(ol.animation.zoom({
          resolution: currentResolution,
          duration: this.duration_,
          easing: ol.easing.easeOut
        }));
      }
      var newResolution = view.constrainResolution(currentResolution, delta);
      view.setResolution(newResolution);
    }
  }


  /**
   * @private
   */
  adjustZoomSlider_() {
    var zoomSlider = this.zoomSliderCtrl_;
    var path = this.imgPath_;

    if (!zoomSlider || !path) {
      return;
    }

    var height = [this.getSliderSize_(), 'px'].join('');

    // bar
    var zoomSliderEl = zoomSlider.getElement();
    zoomSliderEl.style.background =
      ['url(', path, '/', 'zoombar.png', ')'].join('');
    zoomSliderEl.style.border = '0';
    zoomSliderEl.style['border-radius'] = '0';
    zoomSliderEl.style.height = height;
    zoomSliderEl.style.left = '13px';
    zoomSliderEl.style.padding = '0';
    zoomSliderEl.style.top = '81px';
    zoomSliderEl.style.width = '18px';

    // slider
    var sliderEl = <HTMLElement>zoomSliderEl.children[0];
    console.assert(sliderEl instanceof Element);
    sliderEl.style.background = ['url(', path, '/', 'slider.png', ')'].join('');
    sliderEl.style.border = "none";
    sliderEl.style.height = '9px';
    sliderEl.style.margin = '0 -1px';
    sliderEl.style.width = '20px';
  }


  /**
   * @private
   * @return {number}
   */
  getSliderSize_() {
    return (this.maxZoom_ - this.minZoom_ + 1) * 11;
  }

}
