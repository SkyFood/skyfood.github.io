jQuery.fn.banner = function () {

    var container = $(this);

    //设置loop 默认为 false  如果 loop为true, 可以无缝滚动
    var loop = false;

    //切换的时间 默认300
    var speed = 300;

    //自动切换
    var autoplay = 5000;

    // 做自动切换时的一个标记
    var flag = false;

    // 获得 .swiper-wrapper
    var wrapper = container.find(".swiper-wrapper");

	// 获得所有需要切换子无素 .swiper-slide
	var items = wrapper.find(".swiper-slide");

    // 获取.swiper-slide 的数量
    var len = items.length;

    //.swiper-slide 浮动 排成一排
    items.css({
        'float': 'left'
    })

    //取.swiper-container 的宽度
    var w = container.width();

    //设置.swiper-wrapper 的宽度
    //设置loop为true, .swiper-wrapper宽度设为2倍
    //len 为 1 是个例外，需要.swiper-wrapper宽度设为3倍
    if(!loop){
        wrapper.width(w*len);
    }else {
        if( len == 1 ){
            wrapper.width(3*w*len);
        }else {
            wrapper.width(2*w*len);
        }
    }

    //设置.swiper-slide 的宽度
    items.width(w);

    //窗口变化事件
    $(window).resize(function(){
        if( timer ){
            clearInterval(timer);
        }
        w = container.width();
        if(!loop){
            wrapper.width(w*len);
        }else {
            if( len == 1 ){
                wrapper.width(3*w*len);
            }else {
                wrapper.width(2*w*len);
            }
        }
        items.width(w);
        
        if( autoplay ){
            if( typeof autoplay !== 'number' ){
                console.log("autoplayb必须设置为number")
            }else {
                timer = setInterval( moveNext, autoplay);
            }
        }
    })

    //loop为true .swiper-slide全部复制一份
    if(loop){
        //len 为 1 是个例外，需要.swiper-slide复制两份
        if( len==1 ){
            wrapper.append(items.eq(0).clone());
            wrapper.append(items.eq(0).clone());
        }else {
            wrapper.append(items.clone());
        }   

        //.swiper-slide的个数变化，重新取一遍
        // 获得所有需要切换子无素 .swiper-slide
        items = wrapper.find(".swiper-slide");

        // 获取.swiper-slide 的数量
        len = items.length;
    }

    //设置分页
    //向 .swiper-pagination 中添加分页点 span
    var pagination = $(".swiper-pagination")
    if( !loop ){
        for( var i = 0 ; i < len; i++ ){
            pagination.append("<span class='swiper-pagination-bullet'></span>")
        }
    }else {
        if( len >=4 ){
            len_s = len/2;
            for( var i = 0 ; i < len_s; i++ ){
                pagination.append("<span class='swiper-pagination-bullet'></span>")
            }
        }else {
            pagination.append("<span class='swiper-pagination-bullet'></span>")
        }
    }
    
    var bullet =  $(".swiper-pagination-bullet");

    //给.swiper-button-next 绑定 点击事件
    var next = $(".swiper-button-next")
    next.on('click', next_slide);

    //给.swiper-button-prev 绑定 点击事件
    var prev = $(".swiper-button-prev")
    prev.on('click', prev_slide);

    //设置全局变量n 记录切换次数
    var n = 0;
    var m = 0;

    //切换动画用css transform 来做，性能更好一些

    //初始化一遍
    move();

    //next_slide函数  点击swiper-button-next切换到下一张
    function next_slide (){
        if( timer ){
            clearInterval(timer);
        }

        flag = true;
        moveNext ();
        flag = false;
        if( autoplay ){
            if( typeof autoplay !== 'number' ){
                console.log("autoplayb必须设置为number")
            }else {
                timer = setInterval( moveNext, autoplay);
            }
        }
    }
    //prev_slide函数  点击swiper-button-prev切换到上一张
    function prev_slide (){
        if( timer ){
            clearInterval(timer);
        }
        movePrev ();

        if( autoplay ){
            if( typeof autoplay !== 'number' ){
                console.log("autoplayb必须设置为number")
            }else {
                timer = setInterval( moveNext, autoplay);
            }
        }
    }

    function moveNext () {
        if(!loop){
            if( n<len-1 ){
                n++;
            }
            else {
                if( !flag ){
                    n = 0;
                }else {
                    n = len-1;
                }
            }
            move();
        }else {
            if( len >= 4 ){
                
                wrapper.css({
                    "transform" : "translate3d(-" + w * (n+1+1) +"px, 0px, 0px)",
                    "transition-duration": speed+"ms",
                });

                setTimeout(function(){
                    wrapper.css({
                        "transform" : "translate3d(-" + w * (n+1) +"px, 0px, 0px)",
                        "transition-duration": "0s",
                    });
                    wrapper.find(".swiper-slide").eq(0).insertAfter(wrapper.find(".swiper-slide").eq(len-1));
                },speed)

                //分页点
                m < len_s -1 ? m++ : m = 0;
                bullet.eq(m).addClass("swiper-pagination-bullet-active").siblings().removeClass("swiper-pagination-bullet-active");
            }else {
                wrapper.css({
                    "transform" : "translate3d(-" + w * (n+1+1) +"px, 0px, 0px)",
                    "transition-duration": speed+"ms",
                });
                setTimeout(function(){
                    wrapper.css({
                        "transform" : "translate3d(-" + w * (n+1) +"px, 0px, 0px)",
                        "transition-duration": "0s",
                    });
                },speed)
            }
        }
    }

    function movePrev () {
        if(!loop){
            if( n > 0 ){
                n--;
            }else {
                n= 0;
            }
            move()
        }else {
            if( len >= 4 ){
                wrapper.css({
                    "transform" : "translate3d(-" + w * n +"px, 0px, 0px)",
                    "transition-duration": speed+"ms",
                });
                setTimeout(function(){
                    wrapper.css({
                        "transform" : "translate3d(-" + w * (n+1) +"px, 0px, 0px)",
                        "transition-duration": "0s",
                    });
                    wrapper.find(".swiper-slide").eq(len-1).insertBefore(wrapper.find(".swiper-slide").eq(0));
                },speed)

                //分页点
                m >0 ? m-- : m = len_s -1;  
                bullet.eq(m).addClass("swiper-pagination-bullet-active").siblings().removeClass("swiper-pagination-bullet-active"); 
            }else {
                wrapper.css({
                    "transform" : "translate3d(-" + w * n +"px, 0px, 0px)",
                    "transition-duration": speed+"ms",
                });
                setTimeout(function(){
                    wrapper.css({
                        "transform" : "translate3d(-" + w * (n+1) +"px, 0px, 0px)",
                        "transition-duration": "0s",
                    });
                },speed)
            }
        }
    }

    //关键执行动画，左右切换，
    function move() {
        //设置loop为true的话，不执行此代码
        if( !loop ){
            if( n == 0 ){
                prev.addClass("swiper-button-disabled");
                next.removeClass("swiper-button-disabled");
            }else if( n == len - 1 ){
                prev.removeClass("swiper-button-disabled");
                next.addClass("swiper-button-disabled");
            }else {
                prev.removeClass("swiper-button-disabled");
                next.removeClass("swiper-button-disabled");
            }
            //wrapper初始化位置
            wrapper.css({
                "transform" : "translate3d(-" + w * n +"px, 0px, 0px)",
                "transition-duration": speed+"ms",
            });
        }else {
            //wrapper初始化位置
            if( len >= 4 ){
                items.eq(len-1).insertBefore(items.eq(0));
            }
            wrapper.css({
                "transform" : "translate3d(-" + w * (n+1) +"px, 0px, 0px)",
                "transition-duration": "0s",
            });
        }
        bullet.eq(n).addClass("swiper-pagination-bullet-active").siblings().removeClass("swiper-pagination-bullet-active");
    }

    //如果len等于 1，去掉左右按钮和分页栏
    //设置loop为true的话，不执行此代码
    if( !loop ){
       if ( len == 1 ) {
           next.hide();
           prev.hide();
           pagination.hide();
       }else {
           next.show();
           prev.show();
           pagination.show();
       } 
    }

    if( autoplay ){
        if( typeof autoplay !== 'number' ){
            console.log("autoplayb必须设置为number")
        }else {
            var timer = setInterval( moveNext, autoplay);
        }
    }
}

