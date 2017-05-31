﻿'use strict';

var Engine = {};
Engine.looped = false;
Engine._statusOver = -1;
Engine._statusPause = 0;
Engine._statusRun = 1;
Engine._statusSick = 2;
Engine._statusPower = 3;
Engine.scene;
Engine.camera;
Engine.renderer;
Engine.clock;
Engine.lights = {};
Engine.modules = {};
Engine.audios = {};
Engine.status = 1;
Engine.delta = 0;
Engine.loopID = null;
Engine.intervals = {};
Engine.backgroundAudio = null;
Engine.PI = Math.PI;
Engine.hPI = Math.PI / 2;
Engine.params = {
    /*
        color: 烟雾的颜色
        near: 近处属性值
        far: 远处属性值
        start: 雾化开始位置，近处属性值，远处属性值，雾化开始和结束的地方，以及加深的程度
        end: 雾化结束位置 
        ratio: 雾化加深的程度
        conc: 雾化浓度
    */
    fog: {
        color: '#d6eae6',
        near: 160,
        far: 350,
        start: null,
        end: null,
        ratio: null,
        conc: null
    },
    /*
        fov: 视野角
        aspect: 纵横比
        near: 相机离视体积最近的距离
        far: 相机离视体积最远的距离
        THREE.PerspectiveCamera: 透视投影相机
        px: 相机的位置坐标 X
        py: 相机的位置坐标 Y
        pz: 相机的位置坐标 Z
        cv: 视野的中心坐标 (THREE.Vector3), 相机的聚焦点
    */
    camera: {
        fov: 50,
        aspect: 1,
        near: 1,
        far: 2000,
        px: 0,
        py: 160,
        pz: 30,
        vector: { x: 0, y: 0, z: 0 }
    },
    /*
      antialias: true/false是否开启反锯齿
      precision: highp/mediump/lowp着色精度选择
      alpha: true/false是否可以设置背景色透明
      premultipliedAlpha: false,//?
      stencil: false,//?
      preserveDrawingBuffer: true/false是否保存绘图缓冲
      maxLights:number 最大灯光数    
      clearColor: 设置canvas背景色
      clearAlpha: 背景色透明度
    */
    renderer: {
        antialias: true,
        precision: 'highp',
        alpha: true,
        premultipliedAlpha: false,
        stencil: false,
        preserveDrawingBuffer: true,
        maxLights: 1,
        enableShadowMap: true,
        shadowMapType: null,
        clearColor: '#b44b39',
        clearAlpha: 0
    },
    /*
    环境光 : THREE.AmbientLight( color, intensity)
                color : 颜色
                intensity : 强度, 默认是1.0(100%)
    点光源 : THREE.PointLight( color, intensity, distance )
                color : 颜色
                intensity : 强度, 默认是1.0(100%)
                distance : 距离, 从Intensity衰减为0的距离, 默认值为0.0，表示不衰减
    聚光灯 : THREE.SpotLight( color, intensity, distance, angle, exponent )
                color : 颜色
                intensity : 强度, 默认1.0(100%)
                distance : 距离, 从Intensity衰减为0的距离, 默认值为0.0，表示不衰减.
                angle :着色的角度，用弧度作为单位，和光源的方向形成的角度
                exponent :衰减参数，越大衰减越快。
    平行光/方向光 ： THREE.DirectionalLight(color, intensity)
                Intensity : 强度, 默认为1(100%)
    区域光 :  THREE.AreaLight
    */
    lights: {
        globalLight: { type: 'ambient', color: '#ffffff', intensity: 0.9, adjustFn: null },
        shadowLight: { type: 'directional', color: '#ffffff', intensity: 1, adjustFn: null }
    },
    /*{id: module: }    */
    modules: {},
    backgroundAudio: [],
    audios: {},
    intervals: {},
    grid: {
        type: 'xz',
        line: 'rgb(0,0,0)',
        base: 'rgb(255,0,0)',
        step: 10,
        scope: 500
    },
    sizes: { orgw: 2000, orgh: 2000, cw: null, ch: null, nw: null, nh: null },
    containerId: '',
};

/*
THREE的相机控件，用于控制场景中的相机
FirstPersonControls：第一人称控件，键盘移动，鼠标转动 
FlyControls：飞行器模拟控件，键盘和鼠标来控制相机的移动和转动 
RollControls：翻滚控件，FlyControls的简化版，可以绕z轴旋转 
TrackballControls：轨迹球控件，用鼠标来轻松移动、平移和缩放场景 
OrbitControls：轨道控件，用于特定场景，模拟轨道中的卫星，可以用鼠标和键盘在场景中游走 
PathControls：路径控件，相机可以沿着预定义的路径移动。可以四处观看，但不能改变自身的位置。
*/

Engine.initParams = function (params) {
    for (var key in Engine.params) {
        if (typeof (params[key]) != 'undefined') {
            Engine.params[key] = params[key];
        }
    }
}

Engine.initScreenAnd3D = function (containerId, params) {
    Engine.initParams(params);
    Engine.container = $('#' + containerId);
    var containerWidth = Engine.container.width();
    var containerHeight = Engine.container.height();
    var width = (Engine.params.sizes.w ? Engine.params.sizes.w : containerWidth);
    var height = (Engine.params.sizes.h ? Engine.params.sizes.h : containerHeight);
    Engine.params.sizes.w = width;
    Engine.params.sizes.h = height;
    Engine.params.containerId = containerId;
    Engine.scene = new THREE.Scene();
    if (Engine.params.fog) {
        Engine.scene.fog = Engine.createFog();
    }

    Engine.initCamera(width, height);
    Engine.initRenderer(width, height);
    Engine.container.append($(Engine.renderer.domElement));
    Engine.initEvent();
    Engine.clock = new THREE.Clock();
    Engine.initLights();
    Engine.DrawGrid();
};

Engine.calcWorldScale = function (needRescale) {
    var containerWidth = Engine.container.width();
    var containerHeight = Engine.container.height();
    Engine.params.sizes.cw = containerWidth;
    Engine.params.sizes.ch = containerHeight;
    var orgWidth = Engine.params.sizes.w;
    var orgHeight = Engine.params.sizes.h;
    var hRate = containerHeight / orgHeight;
    var wRate = containerWidth / orgWidth;
    var scale = (wRate > hRate ? hRate : wRate);
    Engine.params.sizes.nw = orgWidth * scale;
    Engine.params.sizes.nh = orgHeight * scale;
    Engine.renderer.setSize(Engine.params.sizes.nw, Engine.params.sizes.nh);
    Engine.camera.position.x = Engine.params.camera.px * scale;
    Engine.camera.position.y = Engine.params.camera.py * scale;
    Engine.camera.position.z = Engine.params.camera.pz * scale;
    Engine.scene.scale.set(scale, scale, scale);
}

Engine.createFog = function () {
    var color = Engine.params.fog.color;
    var near = Engine.params.fog.near;
    var far = Engine.params.fog.far;
    var start = Engine.params.fog.start;
    var end = Engine.params.fog.end;
    var ratio = Engine.params.fog.ratio;
    var concentration = Engine.params.fog.conc;
    var fog;
    if (concentration) {
        fog = new THREE.FogExp2(color, concentration);
    } else {
        if (start && end && ratio) {
            fog = new THREE.Fog(color, near, far, start, end, retio);
        } if (start && end) {
            fog = new THREE.Fog(color, near, far, start, end);
        } else {
            fog = new THREE.Fog(color, near, far);
        }
    }

    return fog;
};

Engine.initCamera = function (width, height) {
    Engine.params.camera.aspect = width / height;
    Engine.camera = new THREE.PerspectiveCamera(
      Engine.params.camera.fov,
      Engine.params.camera.aspect,
      Engine.params.camera.near,
      Engine.params.camera.far
    );

    if (Engine.params.camera.px) {
        Engine.camera.position.x = Engine.params.camera.px;
    }

    if (Engine.params.camera.py) {
        Engine.camera.position.y = Engine.params.camera.py;
    }

    if (Engine.params.camera.pz) {
        Engine.camera.position.z = Engine.params.camera.pz;
    }

    if (Engine.params.camera.vector) {
        Engine.camera.lookAt(new THREE.Vector3(Engine.params.camera.vector.x, Engine.params.camera.vector.y, Engine.params.camera.vector.z));
    }
};

Engine.initRenderer = function (width, height) {
    Engine.renderer = new THREE.WebGLRenderer({ alpha: Engine.params.renderer.alpha, antialias: Engine.params.renderer.antialias });
    Engine.renderer.setPixelRatio(window.devicePixelRatio);
    //Engine.renderer.setSize(Engine.container.width(), Engine.container.height());
    Engine.calcWorldScale(true);
    Engine.renderer.setClearColor(Engine.params.renderer.clearColor, Engine.params.renderer.clearAlpha);
    Engine.renderer.shadowMap.enabled = Engine.params.renderer.enableShadowMap;
    Engine.shadowMapEnabled = Engine.params.renderer.enableShadowMap;
    if (Engine.params.renderer.shadowMapType) {
        Engine.renderer.shadowMap.type = Engine.params.renderer.shadowMapType;
    }
};

Engine.initEvent = function () {
    for (var key in Engine.events) {
        Engine.container.on(key, function (eventObj) {
            Engine.events[key](eventObj);
        });
    }
};

Engine.handleContainerResize = function (width, height) {
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
};

Engine.handleMouseDown = function (eventObj) {
    //if (gameStatus == "play" && hero.status == 'running') {
    //    hero.jump();
    //}
    //else if (gameStatus == "readyToReplay") {
    //    replay();
    //}
};

Engine.events = {
    'mousedown': Engine.handleMouseDown,
    'touchend': Engine.handleMouseDown,
};

Engine.initLights = function () {
    for (var key in Engine.params.lights) {
        var tmpItem = Engine.params.lights[key];
        switch (tmpItem.type) {
            case 'ambient':
                Engine.lights[key] = new THREE.AmbientLight(tmpItem.color, tmpItem.intensity);
                break;
            case 'point':
                Engine.lights[key] = new THREE.PointLight(tmpItem.color, tmpItem.intensity, tmpItem.distance);
                break;
            case 'spot':
                Engine.lights[key] = new THREE.SpotLight(tmpItem.color, tmpItem.intensity, tmpItem.distance, tmpItem.angle, tmpItem.exponent);
                break;
            case 'directional':
                Engine.lights[key] = new THREE.AmbientLight(tmpItem.color, tmpItem.intensity);
                break;
            case 'area':
                Engine.lights[key] = new THREE.AreaLight(tmpItem.color, tmpItem.intensity);
                break;
        }

        Engine.scene.add(Engine.lights[key]);
    }
};

Engine.initModules = function () {
    for (var key in Engine.params.modules) {
        var moduleObj = new Engine.params.modules[key];
        moduleObj.id = Engine.genUid();
        var moduleKey = (moduleObj.unique ? moduleObj.type : moduleObj.type + '_' + moduleObj.id)
        Engine.modules[moduleKey] = moduleObj;
        Engine.scene.add(moduleObj.mesh);
        moduleObj.updatePose();
    }
};

Engine.initAudios = function () {
    for (var key in Engine.params.audios) {
        Engine.audios[key] = new Audio(Engine.params.audios[key]);
    }

    if (Engine.params.backgroundAudio && Engine.params.backgroundAudio != '') {
        Engine.backgroundAudio = new Audio(Engine.params.backgroundAudio);
    }
};

Engine.initIntervals = function () {
    var currParams;
    for (var key in Engine.params.intervals) {
        currParams = Engine.params.intervals[key];
        Engine.intervals[key] = window.setInterval(currParams.fn, currParams.freq);
    }
};

Engine.clearIntervals = function () {
    for (var key in Engine.intervals) {
        window.clearIntervals(Engine.intervals[key]);
        Engine.params.intervals[key].clearFn();
    }
};

Engine.loop = function () {
    Engine.looped = true;
    Engine.delta = Engine.clock.getDelta();
    var currModule = null;
    for (var key in Engine.modules) {
        currModule = Engine.modules[key];
        if (currModule && currModule.status == Engine._statusRun && currModule.visible) {
            if (Engine.status == Engine._statusRun) {
                currModule.updatePosition();
            }

            if (currModule.unique) {
                //currModule.updatePose();
            }
        }
    }

    if (Engine.checkCollision) {
        Engine.checkCollision(Engine.modules);
    }

    Engine.renderer.render(Engine.scene, Engine.camera);
    Engine.loopID = requestAnimationFrame(Engine.loop);
};

Engine.resetScene = function (rebuild) {
    if (typeof rebuild == 'boolean' && rebuild) {

    } else {
        if (Engine.loopID) {
            cancelAnimationFrame(Engine.loopID);
            Engine.looped = false;
        }

        Engine.status = Engine._statusRun;
        for (var key in Engine.modules) {
            Engine.modules[key].mesh.visible = true;
            Engine.modules[key].preparingToRestart();
        }
    }
}

Engine.clearScene = function () {
    for (var key in Engine.modules) {
        Engine.scene.remove(Engine.modules[key].mesh);
        Engine.modules[key] = null;
    }
};

Engine.restartScene = function () {
    if (Engine.loopID) {
        cancelAnimationFrame(Engine.loopID);
        Engine.looped = false;
    }

    Engine.status = Engine._statusRun;
    Engine.clearScene();
    Engine.initModules();
    for (var key in Engine.modules) {
        if (Engine.modules[key] && Engine.modules[key].visible) {
            Engine.modules[key].preparingToRestart();
        }
    }

    Engine.clearIntervals();
    Engine.initIntervals();
    Engine.loop();
    if (Engine.backgroundAudio) {
        Engine.backgroundAudio.load();
        Engine.backgroundAudio.play();
    }
};

Engine.pauseScene = function () {
    Engine.status = Engine._statusPause;
    for (var key in Engine.modules) {
        currModule = Engine.modules[key];
        if (currModule && currModule.visible) {
            currModule.pause();
        }
    }
};

Engine.continueScene = function () {
    Engine.status = Engine._statusRun;
    for (var key in Engine.modules) {
        currModule = Engine.modules[key];
        if (currModule && currModule.visible) {
            currModule.continue();
        }
    }
};

Engine.startScene = function () {
    Engine.status = Engine._statusRun;
    for (var key in Engine.modules) {
        Engine.modules[key].status = Engine._statusRun;
        Engine.modules[key].prepareForRun();
    }

    Engine.loop();
    if (Engine.backgroundAudio) {
        Engine.backgroundAudio.load();
        Engine.backgroundAudio.play();
    }
};

Engine.sceneOver = function () {
    Engine.status = Engine._statusOver;
    Engine.clearIntervals();
    for (var key in Engine.modules) {
        currModule = Engine.modules[key];
        if (currModule && currModule.visible) {
            currModule.over();
        }
    }

    if (Engine.params.overFn) {
        Engine.params.overFn();
    }
};

Engine.DrawGrid = function () {
    var params = Engine.params.grid;
    if (params) {
        var type = (typeof params.type == 'string' ? params.type : '');
        var scope = (typeof params.scope == 'number' ? params.scope : 500);
        var step = (typeof params.step == 'number' ? params.step : 10);
        var lColor = (typeof params.line == 'string' ? params.line : '#000000');
        var bColor = (typeof params.base == 'string' ? params.base : '#FF0000');
        var geometryH = new THREE.Geometry();
        var geometryV = new THREE.Geometry();
        var lpH = '';
        var lpV = '';
        var lr = '';
        if (type == 'xy') {
            geometryH.vertices.push(new THREE.Vector3(-scope, 0, 0));
            geometryH.vertices.push(new THREE.Vector3(scope, 0, 0));
            geometryV.vertices.push(new THREE.Vector3(0, -scope, 0));
            geometryV.vertices.push(new THREE.Vector3(0, scope, 0));
            lpH = 'y';
            lpV = 'x';
        } else if (type == 'yz') {
            geometryH.vertices.push(new THREE.Vector3(0, -scope, 0));
            geometryH.vertices.push(new THREE.Vector3(0, scope, 0));
            geometryV.vertices.push(new THREE.Vector3(0, 0, -scope));
            geometryV.vertices.push(new THREE.Vector3(0, 0, scope));
            lpH = 'z';
            lpV = 'y';
        } else {
            geometryH.vertices.push(new THREE.Vector3(-scope, 0, 0));
            geometryH.vertices.push(new THREE.Vector3(scope, 0, 0));
            geometryV.vertices.push(new THREE.Vector3(0, 0, -scope));
            geometryV.vertices.push(new THREE.Vector3(0, 0, scope));
            lpH = 'z';
            lpV = 'x';
        }

        var loopCount = scope / step * 2;
        var currColor = '';
        for (var i = 0; i <= loopCount; i++) {
            currColor = (i == loopCount / 2 ? bColor : lColor);
            var hLine = new THREE.Line(geometryH, new THREE.LineBasicMaterial({ color: currColor, opacity: 0.5 }));
            hLine.position[lpH] = (i * step) - params.scope;
            Engine.scene.add(hLine);
            var vLine = new THREE.Line(geometryV, new THREE.LineBasicMaterial({ color: currColor, opacity: 0.5 }));
            vLine.position[lpV] = (i * step) - params.scope;
            Engine.scene.add(vLine);
        }
    }
};

Engine.adjustLight = function () {
    for (var key in Engine.params.lights) {
        if (typeof (Engine.params.lights[key].adjustFn) == 'function' && Engine.params.lights[key].adjustFn) {
            Engine.params.lights[key].adjustFn(Engine.lights[key]);
        }
    }

    Engine.render();
};

Engine.prepareForStart = function () {
    Engine.initModules();
    Engine.initAudios();
    Engine.initIntervals();
    var currModule;
    for (var key in Engine.modules) {
        currModule = Engine.modules[key];
        if (currModule && currModule.visible) {
            currModule.preparingToRestart();
        }
    }

    Engine.render();
    Engine.adjustLight();
    if (Engine.backgroundAudio) {
        Engine.backgroundAudio.load();
        Engine.backgroundAudio.play();
    }
};

Engine.render = function () {
    Engine.renderer.render(Engine.scene, Engine.camera);
};

Engine.addModuleObject = function (moduleObj, x, y, z) {
    moduleObj.id = Engine.genUid();
    var moduleKey = (moduleObj.unique ? moduleObj.type : moduleObj.type + '_' + moduleObj.id);
    moduleObj.symbol = moduleKey;
    Engine.modules[moduleKey] = moduleObj;
    Engine.scene.add(moduleObj.mesh);
    moduleObj.updatePose();
    moduleObj.mesh.position.x = (x == null ? moduleObj.mesh.position.x : x);
    moduleObj.mesh.position.y = (y == null ? moduleObj.mesh.position.y : y);
    moduleObj.mesh.position.z = (z == null ? moduleObj.mesh.position.z : z);
    return moduleKey;
};

Engine.removeModuleObject = function (key) {
    Engine.scene.remove(Engine.modules[key].mesh);
};

Engine.getModuleObject = function (key) {
    return Engine.modules[key];
}

Engine.genUid = function () {
    var length = 20;
    var soupLength = Engine.genUid.soup_.length;
    var id = [];
    for (var i = 0; i < length; i++) {
        id[i] = Engine.genUid.soup_.charAt(Math.random() * soupLength);
    }
    return id.join('');
};

Engine.genUid.soup_ = '!#$%()*+,-./:;=?@[]^_`{|}~' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

Engine.createText = function ( callback) {
    var loader = new THREE.FontLoader();
    loader.load('../font/helvetiker_regular.typeface.json', callback);
}

var Module = function () {
    this.status = Engine._statusRun;
    this.visible = true;
    this.unique = false;
    this.speed = 1;
    this.id = '';
    this.symbol = '';
    this.completeFired = false;
    this.mesh = new THREE.Group();
    this.body = new THREE.Group();
    this.head = new THREE.Group();
};

Module.prototype.updatePosition = function () {

};

Module.prototype.updatePose = function () {

};

Module.prototype.preparingToRestart = function () {

};

Module.prototype.pause = function () {

};

Module.prototype.continue = function () {

};

Module.prototype.over = function () {

};

Module.prototype.prepareForRun = function () {

};

Module.prototype.collideAction = function (sourceModule) {

};

Module.prototype.reset = function () {

};

Module.prototype.addMovePath = function () {

};