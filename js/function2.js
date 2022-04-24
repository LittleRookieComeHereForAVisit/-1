var obj = {}
//过滤节点中元素之间的换行符号与空格等
obj.getNode = function(dom){
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
obj.insertAfter = function(parent,child,next){
    return parent.insertBefore(child,next.nextSibing);
}
// 子元素前面插入元素
obj.prependChild = function(parent,child){
    return parent.insertBefore(child,parent.firstChild);
}

obj.getStyle = function(obj,key){
    console.log("函数");
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
obj.bindEvent = function(dom,type,fn){
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
obj.removeEvent =  function(dom,type,fn) {
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
obj.throttle_event = function(fn) {
    clearTimeout(fn._timebar);
    fn._timebar = setTimeout(fn,200);
}
//基于时间的节流函数
obj.throttle = function(fn) {
    if(fn._lock) {
        return
    }
    fn._lock = true;
    fn();
    setTimeout(function() {
        fn._lock = false;
    },1000)
}
obj.getP = function(key) {
    return key === 'opacity' ? '' : 'px';
}
obj.animate = function(dom,obj,time,callback){
    var count = 0;
    //计算总次数 x,不取整不影响结果
    var total = parseInt((time || 1000) / 30);
    
    var style = {}
    for(var key in obj){
        style[key] = parseInt(obj.getStyle(dom,key));
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
            dom.style[key] = style[key] + step[key] * count + obj.getP(key);
        }
        //判断终止条件
        if(count >= total){
            for(var key in obj) {
                dom.style[key] = typeof obj[key] === 'string' ? obj[key] : obj[key] + obj.getP(key);
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
obj.css = function(dom,key,value) {
    //判断key是对象还是字符串
    if( typeof key === 'string') {
        //设置样式
        dom.style[key] = value;
    } else {
        // 遍历每组样式
        for(var name in key) {
            // name 表示属性名称， key[name] 表示样式值
            obj.css(dom,name,key[name])
        }
    }

} 

// 获取定位元素在页面中的位置
obj.offset = function(dom) {
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

// 放大镜
// 使用方法:  imageZoom(app,'./images/0.png',400,400);
obj.imageZoom = function(dom,url,width,height) {
    //创建图片两种方式: new Image() document.createElement('img');
    var img  = new Image();

    var mask = document.createElement('div');

    var big = document.createElement('div');

    dom.appendChild(mask);
    dom.appendChild(big);
    //设置样式
    obj.css(dom,{
        width: width + 'px',
        height: height + 'px',
        position: 'relative',
        backgroundImage: 'url(' + url + ')',
        backgroundSize: 'cover',
        // border: '1px solid #ccc',
        // top: '20px',
        // left: '29px'
    })
    //遮罩层
    obj.css(mask,{
        width: width / 2 + 'px',
        height: height / 2 + 'px',
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'yellow',
        opacity: 0.5,
        cursor: 'move'
    })
    //设置右侧放大器
    obj.css(big,{
        width: width + 'px',
        height: height + 'px',
        position: 'absolute',
        top: 0,
        left: '100%',
        backgroundImage:'url('+url+')',
        border: '1px solid #ccc'
    })
    var pos = obj.offset(dom);
    function demo(e){
            // 获取鼠标位置 就是mask的中心点
            var x = e.pageX - pos.left;
            var y = e.pageY - pos.top;
            // 将中心点换算到顶点位置
            x -= width / 4;
            y -= height / 4; 
            // 边界处理
            if(x < 0 ) { // 超出左边
                x = 0; 
                
            } else if ( x > width/2 ) {     // 超出右边
                // x + width/2 > width;
                x = width/2
            }
            if(y < 0) { // 超出顶边
                y = 0;
            } else if ( y > height / 2 ) {  // 超出底边
                // y + height/2 > height;
                y = height/2
            }
            obj.css(mask,{
                left: x + 'px',
                top: y + 'px'
            })
            if(x > width / 4) {
                x = width / 4;
            }
            if(y > height / 4) {
                y = height / 4;
            }
            obj.css(big,{
            backgroundPositionX: x * -2 +'px', 
            backgroundPositionY: y * -2 + 'px',
            backgroundRepeat: 'no-repeat'
            })
            // console.log(x,y);
        }
    //mask显隐交互
    // mouseover,mouseout(选中时连续发生)    mouseenter mouseleave(只在选中时发生一次) 
    obj.bindEvent(dom,'mouseenter',function(e) {
        //显示mask
        obj.css(mask,'display','block')
        obj.css(big,'display','block')
        obj.bindEvent(dom,'mousemove',demo)
        
    })
    obj.bindEvent(dom,'mouseleave',function(e) {
        obj.css(mask,'display','none')
        obj.css(big,'display','none')
        obj.removeEvent(dom,'mousemove',demo)
    })
}


// 裁剪图片
// dealImage(app,'./images/1.png') 使用方法
obj.dealImage = function(dom,url) {
    var img = new Image();
    // 监听图片加载完成
    
    img.onload = function() {
        var width = img.width / 2;
        var height = img.height / 2;
        //写布局
        var layer = document.createElement('div');
        // 小图片
        var mask  = document.createElement('div');
        // 小圆点
        var dot   = document.createElement('div');
        // 组装
        dom.appendChild(layer);
        dom.appendChild(mask);
        mask.appendChild(dot);
        obj.css(dom,{
            width: width + 'px',
            height: height + 'px',
            backgroundImage: 'url('+url+')',
            position: 'relative',
            top: 0,
            left: 0
            // border: '1px solid pink'
        })
        obj.css(layer,{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#000',
            opacity: 0.5
        })
        obj.css(mask,{
            width: '150px',
            height: '150px',
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundImage: 'url(' + url +')',
            cursor: 'move'
        })
        // 小圆点
        obj.css(dot,{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: 'red',
            position: 'absolute',
            right: '-5px',
            bottom: '-5px',
            cursor: 'default'
        })
        // 局部变量
        var ox, oy, top, left, maskLeft, maskTop;
        // 小圆点移动
        function moveDot(e){
            var dx = e.clientX;
            var dy = e.clientY;
            // 获取新的坐标
            x = dx - ox + left;
            y = dy - oy + top;
            if(x < 0) {
                x = 0;
            } else if (maskLeft + x > width ) {
                x = width - maskLeft;
            }
            if(y < 0) { 
                y = 0;
            } else if (maskTop + y > height ) {
                y = height - maskTop;
            }
            //修改样式
            obj.css(mask,{
                width: x + 'px',
                height: y + 'px'
            })  
        }
        //鼠标按下，可以拉拽
        obj.bindEvent(dot,'mousedown',function(e){
            e.stopPropagation();
            // 获取它的位置
            ox = e.clientX;
            oy = e.clientY;
            // 小圆点的偏移量就是小图片的宽高
            top  = parseInt(obj.getStyle(mask,'height'));
            left = parseInt(obj.getStyle(mask,'width'));
            // 获取盒子原来的偏移量
            maskLeft = mask.offsetLeft;
            maskTop  = mask.offsetTop;
            // 在页面中拖拽
            obj.bindEvent(document,'mousemove',moveDot);
        })
        // 鼠标弹起，取消移动
        obj.bindEvent(dot,'mouseup',function(e){
            obj.removeEvent(document,'mousemove',moveDot);
        })
        // 获取鼠标点击的位置
        var mx, my, mw, mh, mt, ml;
        // 移动小图片
        function MoveMask(e) {
            //  获取位置
            var ox = e.clientX;
            var oy = e.clientY;
            // 获取移动距离
            x = ox - mx + ml;
            y = oy - my + mt;
            // 判断边界
            if (x < 0){
                x = 0;
            } else if (x + mw > width) {
                x = width - mw;
            } 
            if (y < 0) {
                y = 0;
            } else if (y + mh > height) {
                y = height - mh;
            }
            obj.css(mask,{
                backgroundPositionX: -x + 'px',
                backgroundPositionY: -y + 'px',
                left: x + 'px',
                top: y + 'px'
            })
        }
        // 获取位置
        obj.bindEvent(mask,'mousedown',function(e) {
            // 获取当前小圆点位置
            mx  = e.clientX;
            my  = e.clientY;
            // 获取盒子宽高
            mw = parseInt(obj.getStyle(mask,'width'));
            mh = parseInt(obj.getStyle(mask,'height'));
            
            // ml = parseInt(getStyle(mask,'left'));
            // mt = parseInt(getStyle(mask,'top'));
            ml = mask.offsetLeft;
            mt = mask.offsetLeft;
            obj.bindEvent(document,'mousemove',MoveMask);
        })

        obj.bindEvent(mask,'mouseup',function(e){
            // 取消移动
            obj.removeEvent(document,'mousemove',MoveMask);
        })
    }
    img.src = url;
}