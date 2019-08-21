import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
declare var AMap: any;
declare var RemoGeoLocation: any;

@Component({
    selector: 'map',
    templateUrl: './map.component.html'
})
export class MapComponent {
    count = 0;
    title = '高德map';
    city = '';
    pointList: number[] = [116.397428, 39.90923];
    constructor() {

    }

    ngOnInit() {
        //this.gethistorical();
        //  this.getCircle();
        // this.getpolygon();
        // this.getLine();
          this.getlocaltion();
    }

    //轨迹回放
    gethistorical() {
        var marker, lineArr = [
            [112.54711, 37.794917],
            [112.544632, 37.796698],
            [112.543357, 37.801004],
            [112.544318, 37.801398],
            [112.545455, 37.802072],
            [112.548588, 37.802128],
            [112.548942, 37.803073],
            [112.549011, 37.803831],
            [112.549113, 37.806442],
            [112.549269, 37.807358],
            [112.551356, 37.807404]
        ];

        var map = new AMap.Map("container", {
            resizeEnable: true,
            center: [112.546925, 37.794941],
            zoom: 17
        });

        marker = new AMap.Marker({
            map: map,
            position: [112.547247, 37.794907],
            icon: "https://webapi.amap.com/images/car.png",
            offset: new AMap.Pixel(-26, -13),
            autoRotation: true,
            angle: -90,
        });

        // 绘制轨迹
        var polyline = new AMap.Polyline({
            map: map,
            path: lineArr,
            showDir: true,
            strokeColor: "#28F",  //线颜色
            // strokeOpacity: 1,     //线透明度
            strokeWeight: 6,      //线宽
            // strokeStyle: "solid"  //线样式
        });

        var passedPolyline = new AMap.Polyline({
            map: map,
            // path: lineArr,
            strokeColor: "#AF5",  //线颜色
            // strokeOpacity: 1,     //线透明度
            strokeWeight: 6,      //线宽
            // strokeStyle: "solid"  //线样式
        });


        marker.on('moving', function (e) {
            passedPolyline.setPath(e.passedPath);
        });

        map.setFitView();

        //开始移动
        marker.moveAlong(lineArr, 200);
        //暂停移动
        // marker.pauseMove();
        // //继续播放
        // marker.resumeMove();
        // //停止播放
        // marker.stopMove();
    }

    //圆
    getCircle() {
        //初始化地图对象，加载地图
        var map = new AMap.Map("container", {
            resizeEnable: true,
        });
        var marker = new AMap.Marker({
            map: map,
            icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
            position: [112.557453, 37.801733]
        });
        var lineArr = [
            [112.55329, 37.801598],
            [112.553891, 37.80726],
            [112.561315, 37.804242],
            [112.557582, 37.801971]
        ];
        var circle = new AMap.Circle({
            map: map,
            center: lineArr[0],          //设置线覆盖物路径
            radius: 500,
            strokeColor: "#3366FF", //边框线颜色
            strokeOpacity: 0.3,       //边框线透明度
            strokeWeight: 3,        //边框线宽
            fillColor: "#FFA500", //填充色
            fillOpacity: 0.35//填充透明度
        });
        map.setFitView();
    }

    //不规则图形
    getpolygon() {  //初始化地图对象，加载地图
        var map = new AMap.Map("container", {
            resizeEnable: true
        });
        var marker = new AMap.Marker({
            map: map,
            icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
            position: [112.571572, 37.789423]
        });
        var polygonArr = [
            [112.567109, 37.79],
            [112.572645, 37.792916],
            [112.575048, 37.786642]
        ];
        var polygon = new AMap.Polygon({
            map: map,
            path: polygonArr,//设置多边形边界路径
            strokeColor: "#FF33FF", //线颜色
            strokeOpacity: 0.2, //线透明度
            strokeWeight: 3,    //线宽
            fillColor: "#1791fc", //填充色
            fillOpacity: 0.35//填充透明度
        });

        map.setFitView();

    }

    //起点-终点路线
    getLine() {
        var map = new AMap.Map("container", {
            resizeEnable: true,
            center: [112.547088, 37.794912],//地图中心点
            zoom: 13 //地图显示的缩放级别
        });
        //构造路线导航类
        map.plugin(['AMap.Driving'], () => {
            // 设置地位标记为自定义标
            let driving = new AMap.Driving({
                map: map,
                panel: "panel"
            });
            // 根据起终点经纬度规划驾车导航路线
            driving.search(new AMap.LngLat(112.547088, 37.794912), new AMap.LngLat(112.546982, 37.807023), function (status, result) {
                // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
                if (status === 'complete') {
                    console.log('绘制驾车路线完成')
                } else {
                    console.log('获取驾车数据失败：' + result)
                }
            });
            //  添加插件
            map.addControl(new driving);
        });


    }

    //获取自己的定位
    getlocaltion() {

        // //   实例化一个地图
        let map = new AMap.Map('container', {
            resizeEnable: true,
        });
        // //  设置我们需要的目标城市
        // map.setCity("成都"); // 或者输入精度
        //  自定义一个标识(marker)
        let customMarker = new AMap.Marker({
            // 这个是在高德API里面的参考手册的基础类里面
            // 自定义偏移量
            offset: new AMap.Pixel(-14, -34), // 使用的是Pixel类
            // 这个是在高德API里面的参考手册的覆盖物里面
            //  自定义图标
            icon: new AMap.Icon({ // 复杂图标类
                // 设定图标的大小
                size: new AMap.Size(27, 36),
                // 图片地址
                imgae: '//vdata.amap.com/icons/b18/1/2.png',
                imageOffset: new AMap.Pixel(-28, 0)// 相对于大图的取图位置
            })
        });
        //  添加地图插件：地图工具条
        map.plugin(['AMap.ToolBar'], () => {
            // 设置地位标记为自定义标
            let toolBar = new AMap.ToolBar({
                locationMarker: customMarker
            });
            //  添加插件
            map.addControl(new toolBar);
        });
        //  添加比例尺插件
        map.plugin(['AMap.Scale'], () => {
            //   初始化插件
            let scale = new AMap.Scale();
            //   加载插件
            map.addControl(new scale);
        });
        //  加载地图实景
        map.plugin(["AMap.MapType"], () => {
            let type = new AMap.MapType();
            map.addControl(type);
        });
        // //  加载鹰眼
        map.plugin(["AMap.OverView"], () => {
            let view = new AMap.OverView({
                // 鹰眼是否展示
                visible: true,
                // 鹰眼是否展开
                isOpen: true
            });
            map.addControl(view);
            // 调用方法 显示鹰眼窗口
            view.show();
        });
        // 添加定位
        map.plugin('AMap.Geolocation', () => {
            let geolocation = new AMap.Geolocation({
                enableHighAccuracy: true, // 是否使用高精度定位，默认:true
                timeout: 10000,          // 超过10秒后停止定位，默认：无穷大
                maximumAge: 0,           // 定位结果缓存0毫秒，默认：0
                convert: true,           // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                showButton: true,        // 显示定位按钮，默认：true
                buttonPosition: 'LB',    // 定位按钮停靠位置，默认：'LB'，左下角
                buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                showMarker: true,         //    定位成功后在定位到的位置显示点标记，默认：true
                showCircle: true,        // 定位成功后用圆圈表示定位精度范围，默认：true
                panToLocation: true,     // 定位成功后将定位到的位置作为地图中心点，默认：true
                zoomToAccuracy: true,      // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false

            });
            // 加载插件
            map.addControl(geolocation);
            // 调用方法 获取用户当前的精确位置信息
            geolocation.getCurrentPosition();
            //  定时刷新位置
            geolocation.watchPosition(
                2
            );
            AMap.event.addListener(geolocation, 'complete', (data) => {
                console.log(data);
                // var marker = new AMap.Marker({
                //     icon: '//vdata.amap.com/icons/b18/1/2.png',
                //     position: data.position,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                //     title: data.formattedAddress,
                // });

                // // 将创建的点标记添加到已有的地图实例：
                // map.add(marker);

                console.log("定位成功");
            }); //  返回定位信息
            AMap.event.addListener(geolocation, 'error', () => {
                console.log("定位失败");
            });      // 返回定位出错信息
        });
        //   获取输入类的
        let autoOptions = {
            input: 'tipinput'
        };
        //  加载输入类插件
        map.plugin('AMap.Autocomplete', () => {
            //  实例化
            let auto = new AMap.Autocomplete(autoOptions);
            // 加载插件
            map.addControl(auto);
        });
        // 加载收索类插件
        map.plugin('AMap.PlaceSearch', () => {
            //   实例化
            let placeSearch = new AMap.PlaceSearch({
                map: map
            });  // 构造地点查询类
            //   加载插件
            map.addControl(placeSearch);
            //  注册监听事件，当选中某条记录的时候就会触发
            AMap.event.addListener(new AMap.Autocomplete(autoOptions), "select", (e) => {
                placeSearch.setCity(e.poi.adcode);
                placeSearch.search(e.poi.name);  //关键字查询查询
            });

        });


    }

    // 地图要放到函数里。
    getMap() {
        console.log(this.pointList);
        let map = new AMap.Map('container', {
            resizeEnable: true,
            zoom: 11,
            center: [116.397428, 39.90923]
        });
    }
}
