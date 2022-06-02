


const DEFAULT_VIEW_ATTRS = {
    width: 1920,
    height: 1080,
    
    position: [-1, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
};


export default class SpaceManager {
    constructor() {
        this._nativeAppManager = window.nreal_manager
        this._nativeApp = window.nreal_app;
        this._nativeView = window.nreal_view;
        this._initListeners();
        window['view-callbacks'] = {};

        window.SpaceManager = this;
    }

    /** create a view into current space app */
    createView(url, attrs = DEFAULT_VIEW_ATTRS) {
        console.log('create view', url, attrs);
        return this._nativeAppManager.createView(this.getApp(), url, JSON.stringify(attrs));
    }

    /** change the view's attributes */
    changeView(id, attrs) {
        if(attrs === undefined) {
            return false;
        }
        return this._nativeAppManager.changeView(this.getApp(), id, JSON.stringify(attrs));    

    }

    /** remove a view from current space app */
    removeView(id) {
        return this._nativeAppManager.removeView(this.getApp(), id);
    }

    /** get all views in current space app */
    getViewIds() {
        let arr = this.getApp().getViewIds();
        return JSON.parse(arr);
    }


    /** get or create a space app */
    getApp() {
        if (this._nativeApp === undefined) {
            console.log('app is undefined request it.');
            this._nativeApp = this._nativeAppManager.requestApp(this._nativeView);
        }
        return this._nativeApp;
    }


    getView(){
        return this._nativeView;
    }

    loadModel(url,transform) {
        console.log('load model transfrom ', JSON.stringify(transform));
        this._nativeAppManager.loadModel(this._nativeView,url,JSON.stringify(transform));
    }

    logStatus() {
        console.log('logStatus');
        console.log('app manager ', this._nativeAppManager);

        console.log('app ', this.getApp(), typeof this.getApp());

        console.log('view ', this._nativeView);
    }


    /** fire a event across sibling view in the same app*/
    fire(id, funcName, args) {
        console.log('fire event', id, funcName, args);
        this.getApp().fire(id, funcName, this._serialize(args));
    }


    transmit(id, object) {
        console.log('transmit', id, object);

        this.getApp().fire(id, '', this._serialize(object));
    }


    _serialize(obj) {
        if (typeof obj === 'function') {
            return obj.toString();
        } else if (typeof obj === 'object') {
            if (obj instanceof Array) {
                let result = '[';
                for (let i = 0; i < obj.length; i++) {
                    result += this._serialize(obj[i]) + ',';
                }
                return result + ']';
            } else {
                return JSON.stringify(obj).replaceAll('\"', '\'');
            }
        } else if (typeof obj === 'string') {
            return '\'' + obj + '\'';
        } else {
            return obj;
        }
    }



    _initListeners() {
        addEventListener('view-call', function (e) {
            function looseJsonParse(obj) {
                return Function('"use strict";return (' + obj + ')')();
            }

            console.log('view-call event ', e);
            let funcName = e.detail.funcName;
            let args = looseJsonParse(e.detail.args);

            if (funcName !== undefined && funcName !== '') {
                // find object
                var fn = window['view-callbacks'][funcName];
                if (fn === undefined) {
                    console.log('not found function', funcName);

                } else if (typeof fn === "function") {
                    fn.apply(null, [args]);
                } else {
                    console.log('not a function', funcName);
                }

            } else {
                if (typeof args === 'function') {
                    args();
                } else {
                    // TODO how to handle a object transmitted from other view
                    console.log('not a function', args);
                }
            }


        });
    }


    /** add callback function from sibling view */
    addCallback(func) {
        console.log('add callback', func);

        window['view-callbacks'][func.name] = func;
    }

}


