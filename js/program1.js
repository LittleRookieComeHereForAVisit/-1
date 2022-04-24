// 放大镜
// 使用方法:  imageZoom(app,'./images/0.png',400,400);
function imageZoom(dom,url,width,height) {
    //创建图片两种方式: new Image() document.createElement('img');
    var img  = new Image();

    var mask = document.createElement('div');

    var big = document.createElement('div');

    dom.appendChild(mask);
    dom.appendChild(big);
    //设置样式
    css(dom,{
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
    css(mask,{
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
    css(big,{
        width: width + 'px',
        height: height + 'px',
        position: 'absolute',
        top: 0,
        left: '100%',
        backgroundImage:'url('+url+')',
        border: '1px solid #ccc'
    })
    var pos = offset(dom);
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
            css(mask,{
                left: x + 'px',
                top: y + 'px'
            })
            if(x > width / 4) {
                x = width / 4;
            }
            if(y > height / 4) {
                y = height / 4;
            }
            css(big,{
            backgroundPositionX: x * -2 +'px', 
            backgroundPositionY: y * -2 + 'px',
            backgroundRepeat: 'no-repeat'
            })
            // console.log(x,y);
        }
    //mask显隐交互
    // mouseover,mouseout(选中时连续发生)    mouseenter mouseleave(只在选中时发生一次) 
    bindEvent(dom,'mouseenter',function(e) {
        //显示mask
        css(mask,'display','block')
        css(big,'display','block')
        bindEvent(dom,'mousemove',demo)
        
    })
    bindEvent(dom,'mouseleave',function(e) {
        css(mask,'display','none')
        css(big,'display','none')
        removeEvent(dom,'mousemove',demo)
    })
}


// 裁剪图片
// dealImage(app,'./images/1.png') 使用方法
function dealImage(dom,url) {
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
        css(dom,{
            width: width + 'px',
            height: height + 'px',
            backgroundImage: 'url('+url+')',
            position: 'relative',
            top: 0,
            left: 0
            // border: '1px solid pink'
        })
        css(layer,{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#000',
            opacity: 0.5
        })
        css(mask,{
            width: '150px',
            height: '150px',
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundImage: 'url(' + url +')',
            cursor: 'move'
        })
        // 小圆点
        css(dot,{
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
            css(mask,{
                width: x + 'px',
                height: y + 'px'
            })  
        }
        //鼠标按下，可以拉拽
        bindEvent(dot,'mousedown',function(e){
            e.stopPropagation();
            // 获取它的位置
            ox = e.clientX;
            oy = e.clientY;
            // 小圆点的偏移量就是小图片的宽高
            top  = parseInt(getStyle(mask,'height'));
            left = parseInt(getStyle(mask,'width'));
            // 获取盒子原来的偏移量
            maskLeft = mask.offsetLeft;
            maskTop  = mask.offsetTop;
            // 在页面中拖拽
            bindEvent(document,'mousemove',moveDot);
        })
        // 鼠标弹起，取消移动
        bindEvent(dot,'mouseup',function(e){
            removeEvent(document,'mousemove',moveDot);
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
            css(mask,{
                backgroundPositionX: -x + 'px',
                backgroundPositionY: -y + 'px',
                left: x + 'px',
                top: y + 'px'
            })
        }
        // 获取位置
        bindEvent(mask,'mousedown',function(e) {
            // 获取当前小圆点位置
            mx  = e.clientX;
            my  = e.clientY;
            // 获取盒子宽高
            mw = parseInt(getStyle(mask,'width'));
            mh = parseInt(getStyle(mask,'height'));
            
            // ml = parseInt(getStyle(mask,'left'));
            // mt = parseInt(getStyle(mask,'top'));
            ml = mask.offsetLeft;
            mt = mask.offsetLeft;
            bindEvent(document,'mousemove',MoveMask);
        })

        bindEvent(mask,'mouseup',function(e){
            // 取消移动
            removeEvent(document,'mousemove',MoveMask);
        })
    }
    img.src = url;
}