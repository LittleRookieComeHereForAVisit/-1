//过滤节点中元素之间的换行符号与空格等
function getNode(dom) {
    // 返回包含所有节点的数组 类数组
    var arr = [];
    var reg = /^\s*$/
    // 遍历所有的节点,过滤掉换行符文本节点
    for(var i = 0; i < dom.childNodes.length; i++) {
        // 如果是文本阶段,要过滤掉
        // 存储节点
        if(dom.childNodes[i].nodeType === 3){
        if(!reg.test(dom.childNodes[i].data)){
            // 如果不是换行符,存储节点
            arr.push(dom.childNodes[i]);
        }
        } else {
            // 其他类型节点之间存储
            arr.push(dom.childNodes[i]);
        }
    }
    // 返回结果
    return arr;
}
/**
 * 在元素后面插入元素
 * @param {*} parent  父元素
 * @param {*} child   插入元素
 * @param {*} next    参考元素
 */
function insertAfter(parent,child,next){
    return parent.insertBefore(child,next.nextSibing);
}
// 子元素前面插入元素
function prependChild(parent,child){
    return parent.insertBefore(child,parent.firstChild);
}

function getStyle(obj,key){
    if(window.getComputedStyle){
        // key = key.replace(/([A-Z])/g,function(match,$1){
        //     return '-'+ $1.toLowerCase();
        // });
        // return getComputedStyle(obj).getPropertyValue(key);
        return getComputedStyle(obj)[key];
    }else {
        var style = obj.currentStyle;
        if(style){
            key = key.replace(/-([a-zA-Z])?/g,function(mathc,$1){
                return ($1 || '').toUpperCase();
            })
            return style.key;
        }else{
            alert('您的浏览器不支持获取计算样式功能.')
        }
    }    
}

/**
         *  @dom 元素
         *  @type 事件类型
         *  @fn 事件回调函数
         **/
 function bindEvent(dom,type,fn){
    //判断火狐浏览器，通过ua判断
    if(type === 'mousewheel' && /firefox/i.test(navigator.userAgent)) {
        type = 'DOMMouseScroll';

    }
    if(dom.addEventListener) {
        dom.addEventListener(type,fn);
    } else if (dom.attachEvent) {
        dom.attachEvent('on'+type,function(e){
            //兼容性
            e.target = e.srcElement;
            e.currentTarget = this;
            fn.call(dom,e);
        });
    } else {
        var oldFn = dom['on' + type];
        //如果以及绑定过，先执行之前的
        dom['on' + type] = function (e){
            oldFn && oldFn(e || window.event);
            fn(e || window.event);
        }
    }
}
//解除事件绑定
function removeEvent(dom,type,fn) {
    //判断火狐浏览器，通过ua判断
    if(type === 'mousewhell' && /firefox/i.test(navigator.userAgent)) {
        type = 'DOMMouseScroll';
        
    }
    if (dom.removeEventListener) {
        dom.removeEventListener(type,fn);
    } else if (dom.detachEvent) {
        dom.detachEvent('on' + type, fn)
    } else {
        dom['on' + type] = null;
    }
}
// 基于操作,封装节流函数
function throttle_event(fn) {
    clearTimeout(fn._timebar);
    fn._timebar = setTimeout(fn,200);
}
//基于时间的节流函数
function throttle(fn) {
    if(fn._lock) {
        return
    }
    fn._lock = true;
    fn();
    setTimeout(function() {
        fn._lock = false;
    },1000)
}
function getP(key) {
    return key === 'opacity' ? '' : 'px';
}
function animate(dom,obj,time,callback){
    var count = 0;
    //计算总次数 x,不取整不影响结果
    var total = parseInt((time || 1000) / 30);
    
    var style = {}
    for(var key in obj){
        style[key] = parseInt(getStyle(dom,key));
    }
    var step = {}
    for(var key in obj){
        step[key] = (parseInt(obj[key]) - style[key]) / total;     
    }
    
    var tiembar = setInterval(function(){
        //更新次数
        count++;
        for(var key in step) {
            //修改样式
            dom.style[key] = style[key] + step[key] * count + getP(key);
        }
        //判断终止条件
        if(count >= total){
            for(var key in obj) {
                dom.style[key] = typeof obj[key] === 'string' ? obj[key] : obj[key] + getP(key);
            }   
            //清除样式
            clearInterval(tiembar);
            // if(callback){
            //     callback();
            // }
            callback && callback();           
        }
    },20)
}
//封装一个设置样式的方法
// 两种用法 css(dom,width,'200px') css(dom,{color:'red,width:'200px'})
function css(dom,key,value) {
    //判断key是对象还是字符串
    if( typeof key === 'string') {
        //设置样式
        dom.style[key] = value;
    } else {
        // 遍历每组样式
        for(var name in key) {
            // name 表示属性名称， key[name] 表示样式值
            css(dom,name,key[name])
        }
    }

} 

// 获取定位元素在页面中的位置
function offset(dom) {
    var result = {
        left: dom.offsetLeft,
        top: dom.offsetTop
    }

    while(dom != document.body) {
        dom = dom.offsetParent;

        result.left += dom.offsetLeft + dom.clientLeft;
        result.top  += dom.offsetTop + dom.clientTop;
    }

    return result;
}
//寄生函数
function inherit(child,parent) {
    function F() {
        // 修改构造函数
        this.constructor = child;
    }
    // 让寄生类的原型等于父类的原型
    F.prototype = parent.prototype;
    // 用寄生类实例为子类赋值
    child.prototype = new F();
    // 修改构造函数
    // child.prototype.constructor = child;第二种写法
    return child;
    
}
