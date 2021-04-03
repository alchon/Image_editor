import React, { Component } from 'react';
import { fabric } from 'fabric';
import { withTranslation } from "react-i18next";
import i18next from "../locale/i18n";
import { debounce } from 'lodash';
import Draggable from 'react-draggable';

import '../css/ImageEditor.scss'
import Save from './Save';

import Rotation from './action/Rotation';
import Filter from './action/Filter';
import ObjectAction from './action/ObjectAction';
import Delete from './action/Delete';
import Shape from './action/Shape';
import Image from './action/Image';
import Crop from './action/Crop';
import Flip from './action/Flip';
import Text from './action/Text';
import Fill from './action/Fill';
import Icon from './action/Icon';
import Line from './action/Line';
import Clip from './action/Clip';
import Draw from './action/Draw';
import Grid from './extension/Grid';
import Util from './extension/Util';
import Snap from './extension/Snap';
import Pipette from './extension/Pipette';
import Layers from './extension/Layers';

import SideNav from './ui/SideNav'
import FilterUI from './ui/Filter';
import ImageUI from './ui/Image';
import ToolsUI from './ui/Tools';
import IconUI from './ui/Icon';
import TextUI from './ui/Text';
import ObjectUI from './ui/Object';
import RotationUI from './ui/Rotation';
import ShapeUI from './ui/Shape';
import DrawUI from './ui/Draw';
import CanvasUI from './ui/Canvas';
import HistoryUI from './ui/History';
import EffectUI from './ui/Effect';

class ImageEditor extends Component {
  constructor(props) {
    super(props);
    // console.log('construct')
    this.state = {
      canvasView : { x: 0, y: 0},
      activeObject : { type : 'not active', width : 0, height : 0, scaleX : 0, scaleY : 0, angle : 0},
      zoom : 1,
      openSave : false, // save Modal 여는 용도
      tab : 0, // 사이드 NavBar 탭 번호
      user_name : '', // 로그인 되어있는 유저 id
      isSaved : props.location.save ? true : false, // 서버에 저장되어 있는가?
      prj_idx : props.location.project_idx ? props.location.project_idx : -1, // 현재 열려있는 저장된 프로젝트 idx,
      imgStatus : false, // false : idle 상태. true 로딩 중
      activePopupTab: 0, // 현재 popup 탭 번호
    }
    
    this._canvas = null;
    if(!props.location.state) { props.history.push('/'); }
    this._canvasImageUrl = props.location.state ? props.location.state.url : '';
    this._canvasSize = {width : props.location.state? props.location.state.width : 500, height : props.location.state? props.location.state.height : 500}
    this._backgroundImageRatio = props.location.state ? props.location.state.ratio/100 : 1;
    
    console.log(props.location)

    this._openProject = props.location.save ? true : false;
    this._project_data = props.location.project_data ? props.location.project_data : null;
    
    this._clipboard = null;
    this._backgroundImage = null;
    this.action = {};

    this.isDragging = false;
    this.selection = true;
    
    this.cropImg = null;
    this.cropCanvasState = {
      left : 0,
      top : 0,
      scaleX : 0,
      scaleY : 0,
      width : 0,
      height : 0
    };

    // redo undo
    this.lock = false;
    this.currentState = { width: null, height: null, action : 'constructor', backFilter : [false, false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false] };
    this.stateStack = [];
    this.redoStack = [];
    this.firstState = null;
    this.maxSize = 100;
    this.state_id = 1;
    this.dotoggle = true;

    // filterList
    this.filterList = ['Grayscale', 'Invert', 'Brownie', 'Technicolor', 'Polaroid', 'BlackWhite', 'Vintage', 'Sepia', 'Kodachrome',
    'Convolute', '', '', '', '', '', 'Brightness', 'Contrast', 'Pixelate', 'Blur', 'Noise', 'Saturation', 'HueRotation','Ink', 'Vignette', 'ZoomBlur', 'Vibrance' ];

    //add function
    this.startPoint = { x : 0, y : 0 };

    //grid
    this.grid = null;
    this.gridOn = false;

    //keyEvent
    this.shift = false;

    this.lastPosX = 0;
    this.lastPosY = 0;

    this.lockScale = false; // true이면 비율 고정.

    this.stylelang = null; // 언어에 따른 스타일

    this.kostyle = {
      fontSize : 15,
    }
    this.enstyle = {
      // fontSize : 18,
    }

    fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';
    this._createAction();
    this.filterRef = React.createRef()
  }

  componentDidMount() {
    if(this._openProject){
      new Promise((resolve) => {
        // this.importCanvas(JSON.parse(this._project_d ata), resolve);
        this.importCanvas(this._project_data, resolve);
      })
      .then(() => {
        this._createDomEvent();
          this._createCanvasEvent();
          this.currentState = this._canvas.toDatalessJSON();
          this.currentState.width = this._canvas.width;
          this.currentState.height = this._canvas.height;
          this.currentState.backFilter = [false, false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]
          this.currentState.action = "initilize";
          this.currentState.id = 0;
          this.firstState = this.currentState;
          this.action['Grid'].makeGrid();
      })
    }
    else{
      if(this._canvasImageUrl){
        this.loadImage(
          this._canvasImageUrl,
          {x : 0, y : 0}, 
          {originX : "left", originY : "top", scaleX : this._backgroundImageRatio, scaleY : this._backgroundImageRatio}
        )
        .then((img) => {
          this._backgroundImage = img;
          // console.log(this._backgroundImageRatio)
          // this._backgroundImage.width *= this._backgroundImageRatio
          // this._backgroundImage.height *= this._backgroundImageRatio
          // this._backgroundImage.scaleX = 1;
          // this._backgroundImage.scaleY = 1;
        })
        .then(() => {
          this._canvas = new fabric.Canvas('canvas', {
            preserveObjectStacking: true,
            height: this._canvasSize.height,
            width: this._canvasSize.width,
            backgroundColor: 'grey',
            backgroundImage : this._backgroundImage,
            uniformScaling: false, // When true, objects can be transformed by one side
            imageSmoothingEnabled : false,
            fireRightClick: true,
          });
        })
        .then(() => {
          this._createDomEvent();
          this._createCanvasEvent();
          this.currentState = this._canvas.toDatalessJSON();
          this.currentState.width = this._canvas.width;
          this.currentState.height = this._canvas.height;
          this.currentState.backFilter = [false, false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]
          this.currentState.action = "initilize";
          this.currentState.id = 0;
          this.firstState = this.currentState;
          this.action['Grid'].makeGrid();
          this.forceUpdate(); // canvas size error
        })
        .catch(() => {
          this.props.history.push('/');
        })
      }
      else{
        this._canvas = new fabric.Canvas('canvas', {
          preserveObjectStacking: true,
          height: this._canvasSize.height,
          width: this._canvasSize.width,
          backgroundColor: 'grey',
          backgroundImage : this._backgroundImage,
          uniformScaling: false,
          imageSmoothingEnabled : false,
          fireRightClick: true,
        });
        this._createDomEvent();
        this._createCanvasEvent();
        this.currentState = this._canvas.toDatalessJSON();
        this.currentState.width = this._canvas.width;
        this.currentState.height = this._canvas.height;
        this.currentState.backFilter = [false, false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]
        this.currentState.action = "initilize";
        this.currentState.id = 0;
        this.firstState = this.currentState;
        this.action['Grid'].makeGrid();
      }
    }
    this.forceUpdate(); // for showUndo/Redo Stack
    this.action['Draw'].setBrush(); // Canvas Required
    this.getCheck();
  }
  
  componentWillUnmount() {
    this._deleteCanvasEvent();
    this._deleteDomevent();  
    this.lock = false;
    this.lockScale = false;
    this.currentState = null;
    this.stateStack.length = 0;
    this.redoStack.length = 0;
    this.cropImg = null;
    this._clipboard = null;
    this._backgroundImage = null;
    this._canvas = null;
    this.grid = null;
    this.firstState = null;
  }
	
	_onKeydownEvent = (event) => {
    // metakey is a Command key or Windows key
    const {ctrlKey, keyCode, metaKey} = event;
    // if(event.repeat) { 
    //   return; 
    // }
    if(keyCode === 8 || keyCode === 46){
      this.deleteObject();
    }
    // ctrl + c
    if((metaKey || ctrlKey) && keyCode === 67) {
      this.copyObject();
    }
    // ctrl + v
    if((metaKey || ctrlKey) && keyCode === 86) {
      if(this._clipboard){
        this.pasteObject();
      }
    }

    if(keyCode === 37) { // handle Left key
      event.preventDefault();
      this.moveSelected('left');
    } 
    else if (keyCode === 38) { // handle Up key
      event.preventDefault();
      this.moveSelected('up');
    } 
    else if (keyCode === 39) { // handle Right key
      event.preventDefault();
      this.moveSelected('right');
    } 
    else if (keyCode === 40) { // handle Down key
      event.preventDefault();
      this.moveSelected('down');
    }
  }

  _onShiftKeydownEvent = (event) => {
    const {keyCode} = event;
    if(keyCode === 16){ 
      this.shift = true; 
      if(this.getActiveObject()){
        this.getActiveObject().isRegular = true;
      }
    }
  }

  _onShiftKeyUpEvent = (event) => {
    const {keyCode} = event;
    if(keyCode === 16) { 
      this.shift = false;
      if(this.getActiveObject()){
        this.getActiveObject().isRegular = false;
      }
    }
  }
  
  _onMouseDownEvent = (event) => {
    if(event.target.tagName === 'CANVAS' || event.target.getAttribute('name') === 'layer'){
      document.addEventListener('keydown',this._onKeydownEvent);
    }
    else{
      // if(event.target.type === 'range') {
      //   this.dotoggle = false;
      // }
      document.removeEventListener('keydown',this._onKeydownEvent);
    }
  }

  _onMouseUpEvent = (event) => {
    // if(event.target.type === 'range') {
    //   this.dotoggle = true;
    //   this.saveState(event.target.name + ' change');
    // }
  }

  /**
  * create a DomEvent
  * @mouseup used on input[range]
  * @mousedown used on input[range] and keyDownEvent
  * @keydown shiftKey
  * @keyup shkfyKey
  * @private
  */
	_createDomEvent = () => {
    // document.getElementById('canvas').addEventListener('keydown',this._onKeydownEvent)
    document.addEventListener('mouseup',this._onMouseUpEvent);
    document.addEventListener('mousedown',this._onMouseDownEvent)
    document.addEventListener('keydown',this._onShiftKeydownEvent)
    document.addEventListener('keyup',this._onShiftKeyUpEvent)
  }


  /**
  * 'canvasMoveStartEvent' event handler
  * @onMousedown
  * @private
  */
  _canvasMoveStartEvent = (event) => {
    if (event.e.altKey === true) {
      this.isDragging = true;
      this.selection = false;
      this.lastPosX = event.e.clientX;
      this.lastPosY = event.e.clientY;
      this._canvas.selection = false;
    }
  }

  /**
  * 'canvasMovingEvent' event handler
  * @onMousemove
  * @private
  */
  _canvasMovingEvent = (event) => {
    if (this.isDragging) {
      let e = event.e;
      let vpt = this._canvas.viewportTransform;
      vpt[4] += e.clientX - this.lastPosX;
      vpt[5] += e.clientY - this.lastPosY;
      var zoom = this._canvas.getZoom (); 

      if (zoom < 400 / 1000) {
        vpt[4] = 200 - 1000 * zoom / 2;
        vpt[5] = 200 - 1000 * zoom / 2;
      } 
      else {
        if (vpt[4] >= 0) {
          vpt[4] = 0;
        } 
        // else if(vpt[4] < -this._canvas.getWidth()){
        //   vpt[4] =  -this._canvas.getWidth();
        // }
      //   else if (vpt[4] < this._canvas.getWidth() - 1000 * zoom) {
      //     vpt[4] = this._canvas.getWidth() - 1000 * zoom;
      //   }
        if (vpt[5] >= 0) {
          vpt[5] = 0;
        } 
      //   else if (vpt[5] < this._canvas.getHeight() - 1000 * zoom) {
      //     vpt[5] = this._canvas.getHeight() - 1000 * zoom;
      //   }
      }
      // console.log(vpt[4], vpt[5])

      this.setState({ canvasView : { x : vpt[4], y : vpt[5] }})
      this._canvas.renderAll();
      this.lastPosX = e.clientX;
      this.lastPosY = e.clientY;
    }
  } 

  /**
  * 'canvasMovieEndEvent' event handler
  * @onMouseup
  * @private
  */
  _canvasMoveEndEvent = (event) => {
    this._canvas.setViewportTransform(this._canvas.viewportTransform);
    this.isDragging = false;
    this.selection = true;
    this._canvas.selection = true;
  }

  /**
  * 'canvasZoomEvent' event handler
  * @onMousewheel
  * @private
  */
  _canvasZoomEvent = (event) => {
    if(event.e.altKey){
      var delta = event.e.deltaY; 
      var zoom = this._canvas.getZoom (); 
      zoom *= 0.999 ** delta; 
      if (zoom> 5) zoom = 5 ; 
      if (zoom < 1) zoom = 1; 
      this._canvas.zoomToPoint({ x: event.e.offsetX, y: event.e.offsetY }, zoom);
      let vpt = this._canvas.viewportTransform;
      event.e.preventDefault (); 
      event.e.stopPropagation (); 
      // if (zoom < 400 / 1000) {
      //   vpt[4] = 200 - 1000 * zoom / 2;
      //   vpt[5] = 200 - 1000 * zoom / 2;
      // } else {
      //   if (vpt[4] >= 0) {
      //     vpt[4] = 0;
      //   } else if (vpt[4] < this._canvas.getWidth() - 1000  * zoom) {
      //     vpt[4] = this._canvas.getWidth() - 1000 * zoom;
      //   }
      //   if (vpt[5] >= 0) {
      //     vpt[5] = 0;
      //   } else if (vpt[5] < this._canvas.getHeight() - 1000 * zoom) {
      //     vpt[5] = this._canvas.getHeight()  * zoom;
      //   }
      // }
      this.setState({zoom : zoom , canvasView : { x : vpt[4], y : vpt[5] }});
    }
  }

  _onCanvasMove = () => {
    this._canvas.on('mouse:down', this._canvasMoveStartEvent);
    this._canvas.on('mouse:move', this._canvasMovingEvent);
    this._canvas.on('mouse:up', this._canvasMoveEndEvent);

  }

  _offCanvasMove = () => {
    this._canvas.off('mouse:down', this._canvasMoveStartEvent);
    this._canvas.off('mouse:move', this._canvasMovingEvent);
    this._canvas.off('mouse:up', this._canvasMoveEndEvent);
  }

  _onCanvasZoom = () => {
    this._canvas.on('mouse:wheel', this._canvasZoomEvent);    
  }

  _offCanvasZoom = () => {
    this._canvas.off('mouse:wheel', this._canvasZoomEvent);    
  }


  /**
   * Attach canvas events
   * @private
   */
  _createCanvasEvent = () => {
    this._onCanvasMove();
    this._onCanvasZoom();
    
		this._canvas.on('selection:created', (event) => {
      this.setState({activeObject : this.getActiveObject() });
			/* switch(type) {
				case 'image':
					break;
				case 'textbox':
					break;
				case 'activeSelection': //group using drag
          break;
        case 'group': //group using drag
				  break;
				default:
			} */
		});

		this._canvas.on('selection:updated', (event) => {
      this.setState({ activeObject : this.getActiveObject() });
			/* switch(type) {
				case 'image':
					break;
				case 'textbox':
					break;
				case 'activeSelection': //group using drag
          break;
        case 'group': //group using drag
				  break;
				default:
			} */
		});

		this._canvas.on('selection:cleared', (event) => {
      this.setState({activeObject : { type : 'not active', width : 0, height : 0, scaleX : 0, scaleY : 0, angle : 0} });
		});
    
    this._canvas.on('object:added', (event) => {
      if(this._canvas.isDrawingMode && !this.lock) {
        this.saveState('drawing add');
      }
    })
    this._canvas.on('object:modified', (event) => {

    })

    this._canvas.on('object:rotated', (event) => {
      this.updateObject();
    });

    this._canvas.on('object:removed', (event) => {

    })
    this._canvas.on('object:skewing', (event) => {

    })
    this._canvas.on('object:scaling', (event) => {

    })

    this._canvas.on('object:moved', this._movedObjectSave);
  }

  /**
  * 'fabric.object moved Event' event handler : if object is moved, save a state
  * @objectMoved
  * @private
  */
  _movedObjectSave = (event) => {
    if(event.target.type !== 'Cropzone'){
      this.saveState(event.target.type + ' : move');
    }
  }

  /**
   * Detach canvas events
   * @private
   */
  _deleteCanvasEvent = () =>{
    this._canvas.off('object:added');
    this._canvas.off('object:modified');
    this._canvas.off('object:rotated');
    this._canvas.off('object:scaling');
    this._canvas.off('object:moving');
    this._canvas.off('selection:cleared');
    this._canvas.off('selection:updated');
    this._canvas.off('selection:created');
    this._canvas.off('mouse:move');
    this._canvas.off('mouse:wheel');
    this._canvas.off('mouse:up');
    this._canvas.off('mouse:down');
  }

  _deleteDomevent = () =>{
    document.removeEventListener('keydown',this._onKeydownEvent)
    document.removeEventListener('mousedown',this._onMouseDownEvent)
    document.removeEventListener('keyup',this._onShiftKeyUpEvent)
    document.removeEventListener('mouseup',this._onMouseUpEvent)
  }

  addKeyDownEvent = () => {
    document.addEventListener('keydown',this._onKeydownEvent);
  }

  removeKeyDownEvent = () => {
    document.removeEventListener('keydown',this._onKeydownEvent);
  }

  resetCanvas = () => {
    this._canvas.setZoom (1); 
    this.setState({zoom : 1, canvasView : { x: 0, y: 0} });
    let vpt = this._canvas.viewportTransform;
    vpt[4] = 0;
    vpt[5] = 0;
    this.lastPosX = 0;
    this.lastPosY = 0;
    this._canvas.renderAll();
  }

  onClickGrid = (event) => {
    if(event.target.checked){
      this.gridOn = true;
      this.action['Grid'].showGrid();
    }
    else{
      this.gridOn = false;
      this.action['Grid'].hideGrid();
    }
  }

  saveState = debounce((action) => {
    if(this.dotoggle && !this.lock) {
      if(this.stateStack.length === this.maxSize) {
        this.stateStack.shift();
      }
      this.stateStack.push(this.currentState);
      this.currentState = this._canvas.toDatalessJSON();
      // this.currentState.objects.forEach(object => {
      //   if(object.type === 'image') {
      //     let change_filters = Array.from({length: this.filterList.length}, () => false);
      //     object.filters.forEach(filter => {
      //       change_filters[this.filterList.indexOf(filter.type)] = filter;
      //     });
      //     console.log(change_filters);
      //     object.filters = change_filters;
      //   }
      // });
      this.currentState.width = this._canvas.width;
      this.currentState.height = this._canvas.height;
      this.currentState.action = action;
      if(this._canvas.backgroundImage){
        this.currentState.backFilter = this._canvas.backgroundImage.filters;
        this._backgroundImage = this._canvas.backgroundImage;
      }
      // console.log("save ", this.currentState)
      this.currentState.id = this.stateStack.length > 0 ? this.stateStack[this.stateStack.length -1].id + 1 : 1;
      this.redoStack.length = 0;
      this.forceUpdate(); // for showUndo/Redo Stack
    }
  }, 200);

  undo = () => {
    if(this.stateStack.length > 0) {
      this.applyState(this.redoStack, this.stateStack.pop());
    }
  }

  redo = () => {
    if(this.redoStack.length > 0) {
      this.applyState(this.stateStack, this.redoStack.pop());
    }
  }

  applyState = (stack, newState) => {
    stack.push(this.currentState);
    this.currentState = newState;
    this.lock = true;
    this._canvas.loadFromJSON(this.currentState, () => {
      this._canvas.setWidth(newState.width);
      this._canvas.setHeight(newState.height);
      this._canvas.calcOffset();
      this.lock = false;
      if(this.currentState.backgroundImage){
        this._canvas.backgroundImage.filters = this.currentState.backFilter || [];
      }
      this.forceUpdate(); // for showUndo/Redo Stack
    });
    // this._canvas._objects.forEach(object => {
    //   if(object.type === 'image') {
    //     let change_filters = [];
    //     // let change_filters = Array.from({length: this.filterList.length}, () => false);
    //     for (let index = 0; index < this.filterList.length; index++) {
    //       change_filters.push();
    //     }
    //     object.filters.forEach(filter => {
    //       change_filters[this.filterList.indexOf(filter.type)] = filter;
    //     });
    //     object.filters = change_filters;
    //   }
    // });
  }

  resetState = () => {
    this.stateStack.length = 0;
    this.redoStack.length = 0;
    this.state_id = 1;
    this.currentState = this.firstState;
    this._canvas.loadFromJSON(this.firstState, () => {
      this._canvas.setWidth(this.firstState.width);
      this._canvas.setHeight(this.firstState.height);
      this._canvas.calcOffset();
      this.lock = false;
    });
    this.forceUpdate(); // for showUndo/Redo Stack
  }

	/**
   * action on selected image
	 * @param {Object} image : selectedImage or backgroundImage
   * @private
   */
	_imageSelection = (image) => {

	}


	/**
   * action on textbox
	 * @param {Object} text : selectedTextbox
   * @private
   */
	_textboxSelection = (text) => {

  }
  
  /**
   * create Action List
   * @private
   */
  _createAction = () => {
    this._register(this.action, new Rotation(this));
    this._register(this.action, new ObjectAction(this));
    this._register(this.action, new Draw(this));
    this._register(this.action, new Filter(this));
    this._register(this.action, new Delete(this));
    this._register(this.action, new Crop(this));
    this._register(this.action, new Text(this));
    this._register(this.action, new Clip(this));
    this._register(this.action, new Flip(this));
    this._register(this.action, new Fill(this));
    this._register(this.action, new Icon(this));
    this._register(this.action, new Shape(this));
    this._register(this.action, new Image(this));
    this._register(this.action, new Grid(this));
    this._register(this.action, new Line(this));
    this._register(this.action, new Util(this));
    this._register(this.action, new Snap(this));
    this._register(this.action, new Layers(this));
    this._register(this.action, new Pipette(this));
  }

  /**
   * register Action
   * @param {Object} map : map 
   * @param {Object} module : action module
   * @private
   */
  _register = (map, action) => {
    map[action.getName()] = action;
  }

  /**
   * Get ActiveObject instance
   * @returns {fabric.Canvas._activeObject} 
   */
  getActiveObject = () => {
    return this._canvas ? this._canvas._activeObject : null;
  }

  /**
   * Get canvas instance
   * @returns {fabric.Canvas}
   */
  getCanvas = () => {
    return this._canvas;
  }

  /**
   * Get ImageEditor instance
   * @returns {ImageEditor} this
   */
  getImageEditor = () => {
    return this;
  }

  /**
   * Get grid instance
   * @returns {Object} this.grid
   */
  getGrid = () => {
    return this.grid;
  }

  /**
   * Get grid On/Off
   * @returns {this.gridOn}
   */
  getGridOn = () => {
    return this.gridOn;
  }

  /**
   * Get Canvas size
   * @returns {{x:width, y:height}} 
   */
  getCanvasSize = () => {
    return this._canvas ? {x : this._canvas.width, y: this._canvas.height} : {x : 0, y: 0}
  }

  /**
   * Get grid instance
   * @returns {this._clipboard}
   */
  getClipboard = () => {
    return this._clipboard;
  }

  /**
   * Get BackgroundImage instance
   * @returns {this._backgroundImage}
   */
  getBackgroundImage = () => {
    return this._canvas.backgroundImage;
  }

  /**
   * Get LockScale instance
   * @returns {this.lockScale}
   */
  getLockScale = () => {
    return this.lockScale;
  }

  /**
   * Set Clipboard
   * @param {Object} clip: cloned objects
   */
  setClipboard = (clip) => {
    this._clipboard = clip;
  }

  /**
   * Set Grid
   * @param {fabric.Object} grid : Array of Lines
   */
  setGrid = (grid) => {
    this.grid = grid;
  }

  updateLockScale = () => {
    this.lockScale = !this.lockScale;
  }
  

  openSaveModal = () => {
    this.setState({openSave : true})
  }

  closeSaveModal = () => {
    this.setState({openSave : false})
  }

  /**
   * Copy Selected Objects
   */
  copyObject = () => {
    this.action['Clip'].copyObject(this.getActiveObject());
  }

  /**
   * Paste Clipboard
   */
  pasteObject = () => {
    this.action['Clip'].pasteObject();
  }

  /**
   * Delete actived Object
   */
  deleteObject = () => {
    this.action['Delete'].deleteObject();
  }

  /**
   * Delete All Objects on Canvas
   */
  deleteAllObject = () => {
    this.action['Delete'].deleteAllObject();
  }

  makePolygonWithDrag = () => {
    this.action['Draw'].drawPolygonWithDrag();
  }

  makePolygonWithClick = () => {
    this.action['Draw'].drawPolygonWithClick();
  }

  openDrawing = () => {
    this.action['Draw'].openDrawing();
  }

  closeDrawing = () => {
    this.action['Draw'].closeDrawing();
  }

  changeDrawingWidth = (width) => {
    this.action['Draw'].changeDrawingWidth(width);
  }

  changeDrawingColor = (rgb) => {
    this.action['Draw'].changeDrawingColor(rgb);
  }

  changeDrawingBrush = (type, color, width) => {
    this.action['Draw'].changeDrawingBrush(type, color, width);
  }

  filterObject = (event) => {
    this.action['Filter'].applyFilter(this.getActiveObject() || this._canvas.backgroundImage , event.target.getAttribute('filter'), event.target.checked, event.target.value);
  }

  filterValueObject = (option, checked, value) => {
    this.action['Filter'].applyFilter(this.getActiveObject() || this._canvas.backgroundImage , option, checked, value);
  }

  rangeFilterObject = (filterOption, checked, value) => {
    this.action['Filter'].applyFilter(this.getActiveObject() || this._canvas.backgroundImage , filterOption, checked, value);
  }

  previewFilter = (option) => {
    this.action['Filter'].previewFilter(this.getActiveObject() || this._canvas.backgroundImage, option);
  }

  setColor = (color) => {
    this.action['Fill'].fill(color);
  }
  
  flipObject = (option) => {
    this.action['Flip'].flip(option);
  }

  addIcon = (options) => {
    this.action['Icon'].addIcon(options);
  }

  saveImage = (title) => {
    this.action['Image'].saveImage(title);
  }

  addImage = (url) => {
    this.action['Image'].addImage(url);
  }

  addLine = (options) => {
    this.action['Line'].addLine(options);
  }

  setShadow = (option) => {
    this.action['Object'].setShadow(option);
  }

  removeShadow = () => {
    this.action['Object'].removeShadow();
  }

  /**
   * Set ScaleX
   * @param {float} value : scaleX 
   */
  scaleXChange = (value) => {
    this.action['Object'].scaleXChange(value);
  }

  /**
   * Set ScaleY
   * @param {float} value : scaleY
   */
  scaleYChange = (value) => {
    this.action['Object'].scaleYChange(value);
  }
  
  lockScaleRatio = () => {
    this.action['Object'].lockScaleRatio();
  }

  makeGroup = () => {
    this.action['Object'].makeGroup();
  }

  unGroup = () => {
    this.action['Object'].unGroup();
  }

  sendBackwards = () => {
    this.action['Object'].sendBackwards();
  }

  sendToBack = () => {
    this.action['Object'].sendToBack();
  }

  bringForward = () => {
    this.action['Object'].bringForward();
  }

  bringToFront = () => {
    this.action['Object'].bringToFront();
  }

  moveSelected = (direction) => {
    this.action['Object'].moveSelected(direction);
  }

  setObjectAngle = (changeAngle) => {
    this.action['Rotation'].setAngle(Number(changeAngle));
  }

  rotateObjectAngle = (angle) => {
    this.action['Rotation'].changeAngle(angle);
  }

  addShape = (type, color) => {
    this.action['Shape'].addShape(type, color);
  }

  setEndAngle = (value) => {
    this.action['Shape'].setEndAngle(value);
  }

  setStroke = (option) => {
    this.action['Shape'].setStroke(option);
  }

  setStrokeColor = (color) => {
    this.action['Shape'].setStrokeColor(color);
  }

  addText = (option) => {
    this.action['Text'].addText(option);
  }

  textObject = (textOption, checked, value) => {
    this.action['Text'].textObj(this.getActiveObject(), textOption, checked, value);
  }

  onClickSnap = (event) => {
    this.action['Snap'].onClickSnap(event);
  }

  onClickObjectSnap = (event) => {
    this.action['Snap'].onClickObjectSnap(event);
  }

  cropCanvas = (off) => {
    this.action['Crop'].cropCanvas(off);
  }

  cropEndCanvas = () => {
    this.action['Crop'].cropEndCanvas();
  }

  handleCropCanvasSizeChange = (value) => {
    this.action['Crop'].resizeCropzone(value);
  }

  setCropCanvasSize = (cropCanvasSize, option, value, obj) => {
    return this.action['Crop'].setCropCanvasSize(cropCanvasSize, option, value, obj);
  }

  changeBackgroundColor = (color) => {
    this.action['Util'].changeBackgroundColor(color);
  }

  cropObjMouseDown = (event) => {
    if(event.target == null || !(event.target === this.cropImg || event.target.type === "Cropzone")){
      this._canvas.off('mouse:down', this.cropObjMouseDown);
      this.action['Crop'].cropObjend(this.cropImg);
      this.cropImg = null;
    }
  }

  cropObject = (cropOption) => {
    let activeObject = this.getActiveObject();
    if(activeObject && activeObject.type === 'image'){
      this.cropImg = activeObject;
      this.action['Crop'].cropObj(activeObject, cropOption);
      this._canvas.on('mouse:down', this.cropObjMouseDown);
    }
  }

  cropEndObject = () => {
    if(this.cropImg){
      this._canvas.off('mouse:down', this.cropObjMouseDown);
      this.action['Crop'].cropObjend(this.cropImg);
      this.cropImg = null;
    }
  }

  objectInfo = () => {
    if(this.getActiveObject()){
      let obj = this.getActiveObject();
      console.log(obj);
      
    }
  }

  loadImage = (url, pointer, option) => {
    return this.action['Image'].loadImage(url, pointer, option);
  }

  exportCanvas = () => {
    let c = this._canvas.toJSON();
    c.width = this._canvas.width;
    c.height = this._canvas.height;
    // let data = JSON.stringify(c);
    let data = JSON.stringify(this.currentState);
    let file = new Blob([data], {type : 'octet/stream'});
    var a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.setAttribute("download", 'canvas.json');
    a.click();
  }

  importCanvas = (data, resolve) => {
    // let file = event.target.files[0];
    const file = new Blob([data], {type:"application/json"});
    // console.log(file)
    let json;
    var reader = new FileReader();
    reader.onload = (event) => {
      json = JSON.parse(event.target.result);
      this._canvas = new fabric.Canvas('canvas', {
        preserveObjectStacking: true,
        height: 100,
        width: 100,
        backgroundColor: 'grey',
        uniformScaling: false, // When true, objects can be transformed by one side
        imageSmoothingEnabled : false,
        fireRightClick: true,
      });

      // console.log(json);

      this._canvas.loadFromJSON(json, () => {
        this.isDragging = false;
        this.selection = true;
        this.cropImg = null;
        this.cropCanvasState = {
          left : 0,
          top : 0,
          scaleX : 0,
          scaleY : 0,
          width : 0,
          height : 0
        };
        // redo undo
        this.lock = false;
        this.stateStack = [];
        this.redoStack = [];
        this.firstState = null;
        this.maxSize = 100;
        this.state_id = 1;
        this.undoCanvasSize = [];
        this.redoCanvasSize = [];
        this.currentCanvasSize = {width: null, height: null};
        this.dotoggle = true;

        this.lastPosX = 0;
        this.lastPosY = 0;
        this.shift = false;

        //add function
    
        this.grid = null;
        this.gridOn = false;

        this.lockScale = false;

        this.currentState = this._canvas.toDatalessJSON();
        this.currentState.action = "initilize";
        this.currentState.width = json.width ? json.width : 800;
        this.currentState.height = json.height ? json.height : 600;
        this.currentState.id = 0;
        this.firstState = this.currentState;
        this.currentCanvasSize = {width: this._canvas.width, height: this._canvas.height};

        this._canvas.setWidth( json.width ? json.width : 800 );
        this._canvas.setHeight( json.height ? json.height : 600 );
        this._canvas.calcOffset();

        this._canvas.renderAll()
        this.forceUpdate(); // for undo/redo stack
        resolve();
      })
    }
    reader.readAsText(file);
  }

  changeToKorean = () => {
    i18next.changeLanguage('ko')
  }

  changeToEnglish = () => {
    i18next.changeLanguage('en')
  }

  getCanvasInfo = () => {
    console.log(this._canvas);
  }

  getCanvasBackinfo = () => {
    alert(this._canvas.backgroundImage.width +' '+ this._canvas.backgroundImage.height +' '+ this._canvas.backgroundImage.scaleX + ' ' + this._canvas.backgroundImage.scaleY)
  }

  getCanvasBackgroundInfo = () => {
    console.log(this._canvas.backgroundImage)
  }

  getMousePointInfo = (event) => {
    if(event.target.checked){
      this._canvas.on('mouse:down', this.showPointer);
    }
    else{
      this._canvas.off('mouse:down', this.showPointer);
    }
  }

  showPointer = (event) => {
    console.log(this._canvas.getPointer(event, false));
  }

  getCanvasEventInfo = () => {
    for (const key in this._canvas.__eventListeners){
      console.log(key);
      for ( const i of this._canvas.__eventListeners[key]){
        console.log(i);
      }
    }
  }

  onclickUndoStack = (event) => {
    let origin = this.currentState.id;
    let dest = parseInt(event.target.getAttribute('number'), 10);

    if(this.stateStack.length > 0){
      this.redoStack.push(this.currentState);
      for(let i = dest; i < origin - 1 ; i++ ){
        this.redoStack.push( this.stateStack.pop() );
      }

      this.currentState = this.stateStack.pop();
  
      this._canvas.loadFromJSON(this.currentState, () => {
        this._canvas.setWidth(this.currentState.width);
        this._canvas.setHeight(this.currentState.height);
        this._canvas.calcOffset();

        if(this._canvas.backgroundImage){
          this._canvas.backgroundImage.filters = this.currentState.backFilter;
        }
        this.forceUpdate();
      });
    }
  
  }
  
  onclickRedoStack = (event) => {
    let origin = this.currentState.id;
    let dest = parseInt(event.target.getAttribute('number'), 10);
    console.log(dest, origin - 1);
    if(this.redoStack.length > 0){
      this.stateStack.push(this.currentState);
      for(let i = origin; i < dest - 1 ; i++ ){
        this.stateStack.push(this.redoStack.pop());
      }
      this.currentState = this.redoStack.pop();

      this._canvas.loadFromJSON(this.currentState, () => {
        this._canvas.setWidth(this.currentState.width);
        this._canvas.setHeight(this.currentState.height);
        this._canvas.calcOffset();
        this.forceUpdate();
      });
    }
  }

  showUndoStack = () => {
    // const { t } = useTranslation();
    const listitem = this.stateStack.map((state) =>
      <p style = {{color : 'black'}} key= {state.id} className="undo_stack" number = {state.id} onClick = {this.onclickUndoStack} >{state.id} : {i18next.t(state.action)}</p>
    );
    return(
      <div style={{color : 'black'}}>
        <ol>
          {listitem}
        </ol>
      </div>
    )
  }

  showRedoStack = () => {
    const listitem = this.redoStack.map((state) =>
      <p style = {{color : '#820000'}} key = {state.id} className="redo_stack" number = {state.id} onClick = {this.onclickRedoStack}>{state.id} : {i18next.t(state.action)}</p>
    );
    return(
      <div>
        {listitem}
      </div>
    )
  }

  showCurrentState = () => {
    if(this._canvas){
      return(
        <div>
          Current state : {i18next.t(this.currentState.action)}
        </div>
      )
    }
  }

  updateObject = () => {
    this.setState({activeObject : this.getActiveObject() ? this.getActiveObject() : {type : 'not active', width : 0, height : 0, scaleX : 0, scaleY : 0, angle : 0}})
  }

  loadingStart = () => {
    this.setState({imgStatus : true})
  }

  loadingFinish = () => {
    console.log('loading finish')
    this.setState({imgStatus : false});
  }

  changeTab = (event) => {
    this.setState({tab : parseInt(event.target.getAttribute('tab'), 10)});
  }

  getCheck = () => {
    fetch('/auth/check', {
      method: 'GET'
    })
    .then((res) => res.json())
    .then((data) => {
      if(data.success) {
        this.setState({user_name: data.info.user_id});
      }
    })
    .catch(() => {
      console.log('no login');
      // alert('error');
    });
  }

  getCheckSave = (idx) => {
    if(!idx){ idx = -1 }
    this.setState({isSaved : idx === -1 ? false : true, prj_idx : idx});
  }

  buttonLayer = () => {
    return this.action['Layers'].buttonLayer();
  }

  clickHandler = (id) => {
    this.setState({activePopupTab : id});
  }

  render() {
    if(i18next.language === 'ko'){
      this.stylelang = this.kostyle;
    }
    else {
      this.stylelang = this.enstyle;
    }

    let historyBorder, layerBorder, infoBorder;
    if(this.state.activePopupTab === 0){
      historyBorder = "history-tab-border";
      layerBorder = "layer-tab";
      infoBorder = "info-tab";
    }
    else if(this.state.activePopupTab === 1){
      historyBorder = "history-tab";
      layerBorder = "layer-tab-border";
      infoBorder = "info-tab";
    }
    else if(this.state.activePopupTab === 2){
      historyBorder = "history-tab";
      layerBorder = "layer-tab";
      infoBorder = "info-tab-border";
    }

    const popupTab = {
      0: <HistoryUI showUndoStack = {this.showUndoStack} showCurrentState={this.showCurrentState}/>,
      1: <div className="layers-detail">{this.buttonLayer()}</div>,
      2: <div className="canvas-info">
          <div>{i18next.t('ImageEditor.Zoom')} : {this.state.zoom}</div>
          <div>{this._canvas ? this._canvas.width : 0} X {this._canvas ? this._canvas.height : 0}</div>
        </div>,
    }
    const tab = {
      0: <TextUI 
          object={this.state.activeObject} 
          textObject={this.textObject} 
          addText = {this.addText} 
          setColor={this.setColor} 
          pipette = {this.action['Pipette']}
          />,
      1: <ImageUI 
          object={this.state.activeObject} 
          cropObject={this.cropObject} 
          cropEndObject={this.cropEndObject}
          addImage = {this.addImage}
          imgStatus = {this.state.imgStatus}
          />,
      2: <FilterUI 
          object={this.state.activeObject} 
          filterObject={this.filterObject} 
          getBackgroundImage = {this.getBackgroundImage} 
          rangeFilterObject={this.rangeFilterObject}
          filterValueObject = {this.filterValueObject}
          />,
      3: <IconUI 
          object={this.state.activeObject} 
          addIcon = {this.addIcon} 
          setColor={this.setColor}
          pipette = {this.action['Pipette']}
          />,
      4: <ObjectUI 
          object={this.state.activeObject} 
          lockScaleRatio = {this.lockScaleRatio}
          getLockScale = {this.getLockScale}
          sendToBack = {this.sendToBack}
          sendBackwards = {this.sendBackwards}
          bringToFront = {this.bringToFront}
          bringForward = {this.bringForward}
          deleteObject = {this.deleteObject}
          deleteAllObject = {this.deleteAllObject}
          makeGroup = {this.makeGroup}
          unGroup = {this.unGroup}
          flipObject = {this.flipObject}
          scaleXChange = {this.scaleXChange}
          scaleYChange = {this.scaleYChange}
          />,
      5: <RotationUI object={this.state.activeObject} setObjectAngle = {this.setObjectAngle} rotateObjectAngle = {this.rotateObjectAngle}/>,
      6: <ShapeUI 
          object={this.state.activeObject} 
          addShape={this.addShape} 
          addLine={this.addLine} 
          setEndAngle = {this.setEndAngle}
          makePolygonWithDrag={this.makePolygonWithDrag} 
          makePolygonWithClick={this.makePolygonWithClick}
          setColor={this.setColor}
          pipette = {this.action['Pipette']}
          />,
      7: <DrawUI 
          object={this.state.activeObject} 
          openDrawing={this.openDrawing} 
          closeDrawing={this.closeDrawing} 
          changeDrawingColor={this.changeDrawingColor} 
          changeDrawingWidth={this.changeDrawingWidth} 
          changeDrawingBrush={this.changeDrawingBrush} 
          />,
      8: <ToolsUI 
          addImage={this.addImage} 
          objectInfo = {this.objectInfo} 
          openSaveModal = {this.openSaveModal} 
          onClickSnap={this.onClickSnap}
          onClickGrid={this.onClickGrid}
          onClickObjectSnap={this.onClickObjectSnap}
          exportCanvas = {this.exportCanvas}
          importCanvas = {this.importCanvas}
          getCanvasInfo = {this.getCanvasInfo}
          getCanvasBackinfo = {this.getCanvasBackinfo}
          isSaved = {this.state.isSaved}
          prj_idx = {this.state.prj_idx}
          user_name = {this.state.user_name} 
          canvas = {this._canvas}
          object = {this.state.activeObject}
          canvasView = {this.state.canvasView}
          zoom = {this.state.zoom}
        />,
      9: <CanvasUI 
          object={this.state.activeObject} 
          canvas={this._canvas}
          resetCanvas = {this.resetCanvas}
          cropCanvas = {this.cropCanvas}
          cropEndCanvas = {this.cropEndCanvas}
          handleCropCanvasSizeChange = {this.handleCropCanvasSizeChange}
          changeBackgroundColor = {this.changeBackgroundColor}
          setCropCanvasSize = {this.setCropCanvasSize}
        />,
      10: <EffectUI 
          object={this.state.activeObject} 
          setShadow = {this.setShadow} 
          removeShadow = {this.removeShadow}
          setStroke={this.setStroke}
          setStrokeColor={this.setStrokeColor} 
          pipette = {this.action['Pipette']}
        />
    };
    return (
      <div className='App'>
        <SideNav 
          changeTab = {this.changeTab} 
          tab = {this.state.tab} 
          UI = { tab }
          stylelang = {this.stylelang}
        >
        </SideNav>

        <div className="editor" id='editor'>
          <Draggable
            boutnds="editor">
            <div className="popup">
              <div className="popup-tab">
                <div className={historyBorder} onClick={()=>this.clickHandler(0)}>{i18next.t('ImageEditor.History')}</div>
                <div className={layerBorder} onClick={()=>this.clickHandler(1)}>{i18next.t('ImageEditor.Layer')}</div>
                <div className={infoBorder} onClick={()=>this.clickHandler(2)}>{i18next.t('ImageEditor.Info')}</div>
              </div>
              <div className="popup-content">
                {popupTab[this.state.activePopupTab]}
              </div>
            </div>
          </Draggable>
          <div className="editor-nav">
            <div className="do">
                <button onClick = {this.undo}>{i18next.t('ImageEditor.Undo')}</button>
                <button onClick = {this.redo}>{i18next.t('ImageEditor.Redo')}</button>
            </div>
            <div className="save">
                <button onClick={this.openSaveModal} >{i18next.t('ImageEditor.Save')}</button>
            </div>
            <div className="more">
                <button onClick = { () => {this.props.history.push('/')}}>{i18next.t('ImageEditor.Home')}</button>
            </div>
          </div>
          <div className="real" >
            <canvas id='canvas' tabIndex='0'></canvas>
          </div>
        </div>
        <Save 
          open = {this.state.openSave} 
          close = {this.closeSaveModal} 
          save = {this.saveImage} 
          size = {this.getCanvasSize} 
          user_name = {this.state.user_name} 
          getCanvas = {this.getCanvas} 
          canvas={this.currentState} 
          isSaved = {this.state.isSaved}
          prj_idx = {this.state.prj_idx}
          getCheckSave = {this.getCheckSave}
        />       
      </div>
    );
  }
}

export default withTranslation()(ImageEditor);