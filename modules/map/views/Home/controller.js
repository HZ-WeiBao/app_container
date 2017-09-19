
exports.actionIndex = function() {
  //创建地图
  var $container = document.getElementById('container');

  var map = new AMap.Map('container', {
    resizeEnable: true,
    zoom: 17,
    center: [114.418543, 23.037382],
    animateEnable: false
  });

  map.on('zoomchange', function () {
    if(map.getZoom() <= 16){
      $container.classList.add('hiddenAll');
    }else{
      $container.classList.remove('hiddenAll');
    }
  });

  map.plugin('AMap.Geolocation', function () {
    geolocation = new AMap.Geolocation({
      enableHighAccuracy: true,
      timeout: 10,
      buttonOffset: new AMap.Pixel(10, 20),
      zoomToAccuracy: false,
      buttonPosition: 'RB'
    });
    map.addControl(geolocation);
    AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
    AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
  });

  //解析定位结果
  function onComplete(data) {
    var str = ['定位成功'];
    str.push('经度：' + data.position.getLng());
    str.push('纬度：' + data.position.getLat());
    if (data.accuracy) {
      str.push('精度：' + data.accuracy + ' 米');
    }//如为IP精确定位结果则没有精度信息
    str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
    // document.getElementById('tip').innerHTML = str.join('<br>');
  }
  //解析定位错误信息
  function onError(data) {
    // document.getElementById('tip').innerHTML = '定位失败';
  }

  this.Event.locker.checkOverElement = false;

  //加载SimpleMarker
  AMapUI.loadUI(['overlay/SimpleMarker'], function (SimpleMarker) {
    var $positionDisplayer = document.getElementById('positionDisplayer'),
      $positionPicker = document.getElementById('positionPicker'),
      $inputPointInfo = document.getElementById('inputPointInfo'),
      $pointName = document.getElementById('pointName'),
      $pointType = document.getElementById('pointType'),
      $pointOldName = document.getElementById('pointOldName'),
      $pin = document.getElementById('pin'),
      $showOldNameSwitcher = document.getElementById('showOldNameSwitcher'),
      $showTypeSelector = document.getElementById('showTypeSelector'),

      //数据点
      notedPoints = [{ "name": "北苑食堂", "oldName": "附中食堂", "type": 2, "location": { "O": 23.044042350139996, "M": 114.41836460575638, "lng": 114.418365, "lat": 23.044042 } }, { "name": "北苑2栋", "oldName": "14栋", "type": 0, "location": { "O": 23.044504392690225, "M": 114.41815968500401, "lng": 114.41816, "lat": 23.044504 } }, { "name": "5号楼", "oldName": "附中楼", "type": 1, "location": { "O": 23.04097683558732, "M": 114.41895040027072, "lng": 114.41895, "lat": 23.040977 } }, { "name": "6号楼", "oldName": "艺术楼", "type": 1, "location": { "O": 23.041085437938953, "M": 114.41998251434882, "lng": 114.419983, "lat": 23.041085 } }, { "name": "2号楼", "oldName": "田家炳大楼", "type": 1, "location": { "O": 23.040514780937038, "M": 114.41738828183873, "lng": 114.417388, "lat": 23.040515 } }, { "name": "1号楼", "oldName": "旭日大楼", "type": 1, "location": { "O": 23.03897952381948, "M": 114.41793759829403, "lng": 114.417938, "lat": 23.03898 } }, { "name": "图书馆", "oldName": "叶竹君", "type": 1, "location": { "O": 23.036553683300394, "M": 114.41855021489886, "lng": 114.41855, "lat": 23.036554 } }, { "name": "行政楼", "oldName": "", "type": 1, "location": { "O": 23.03795370562612, "M": 114.42082150945993, "lng": 114.420822, "lat": 23.037954 } }, { "name": "11号楼", "oldName": "教学实验大楼", "type": 1, "location": { "O": 23.04016330221881, "M": 114.42061015129951, "lng": 114.42061, "lat": 23.040163 } }, { "name": "学术交流中心", "oldName": "培训楼", "type": "1", "location": { "O": 23.039152302657815, "M": 114.42116805077461, "lng": 114.421168, "lat": 23.039152 } }, { "name": "鹅城音乐厅", "oldName": "", "type": 1, "location": { "O": 23.038579662873303, "M": 114.4212753391352, "lng": 114.421275, "lat": 23.03858 } }, { "name": "3号楼", "oldName": "实验楼", "type": 1, "location": { "O": 23.03933989102341, "M": 114.41623867037072, "lng": 114.416239, "lat": 23.03934 } }, { "name": "4号楼", "oldName": "", "type": 1, "location": { "O": 23.039685447855362, "M": 114.41563785555138, "lng": 114.415638, "lat": 23.039685 } }, { "name": "服装楼", "oldName": "", "type": 1, "location": { "O": 23.04018897193802, "M": 114.41577089313489, "lng": 114.415771, "lat": 23.040189 } }, { "name": "快递站", "oldName": "", "type": 2, "location": { "O": 23.0380968663149, "M": 114.41610241443101, "lng": 114.416102, "lat": 23.038097 } }, { "name": "中苑5栋(规划)", "oldName": "", "type": 0, "location": { "O": 23.036486544872428, "M": 114.4146561673789, "lng": 114.414656, "lat": 23.036487 } }, { "name": "中苑4栋", "oldName": "原1栋", "type": 0, "location": { "O": 23.036215029561234, "M": 114.4148922017722, "lng": 114.414892, "lat": 23.036215 } }, { "name": "中苑3栋", "oldName": "原2栋", "type": 0, "location": { "O": 23.035762831907526, "M": 114.41534817730474, "lng": 114.415348, "lat": 23.035763 } }, { "name": "中苑2栋", "oldName": "原6栋", "type": 0, "location": { "O": 23.035142785507308, "M": 114.41538036381291, "lng": 114.41538, "lat": 23.035143 } }, { "name": "中苑6栋", "oldName": "原3栋", "type": 0, "location": { "O": 23.03562657989416, "M": 114.4147934965132, "lng": 114.414793, "lat": 23.035627 } }, { "name": "中苑7栋", "oldName": "原5栋", "type": 0, "location": { "O": 23.0353698728848, "M": 114.4147398523329, "lng": 114.41474, "lat": 23.03537 } }, { "name": "中苑8栋", "oldName": "原7栋", "type": 0, "location": { "O": 23.03497987476163, "M": 114.41468084373457, "lng": 114.414681, "lat": 23.03498 } }, { "name": "中苑9栋", "oldName": "原8栋", "type": 0, "location": { "O": 23.034782406927043, "M": 114.41505098857863, "lng": 114.415051, "lat": 23.034782 } }, { "name": "少康楼", "oldName": "", "type": "少康楼", "location": { "O": 23.03437266024711, "M": 114.41467011489851, "lng": 114.41467, "lat": 23.034373 } }, { "name": "中苑食堂", "oldName": "万人饭堂", "type": 2, "location": { "O": 23.034471394500798, "M": 114.41576982059462, "lng": 114.41577, "lat": 23.034471 } }, { "name": "中苑10栋", "oldName": "原12栋", "type": 0, "location": { "O": 23.033974760441435, "M": 114.41533101118341, "lng": 114.415331, "lat": 23.033975 } }, { "name": "中苑11栋", "oldName": "原9栋", "type": 0, "location": { "O": 23.033643999187863, "M": 114.41471946752802, "lng": 114.414719, "lat": 23.033644 } }, { "name": "中苑12栋", "oldName": "原10栋", "type": 0, "location": { "O": 23.033339895708167, "M": 114.4142313054873, "lng": 114.414231, "lat": 23.03334 } }, { "name": "中苑13栋", "oldName": "原11栋", "type": 0, "location": { "O": 23.033065411969144, "M": 114.41378605879083, "lng": 114.413786, "lat": 23.033065 } }, { "name": "南苑3栋", "oldName": "原22栋", "type": 0, "location": { "O": 23.03439774763543, "M": 114.41777283312979, "lng": 114.417773, "lat": 23.034398 } }, { "name": "南苑1栋", "oldName": "原20栋", "type": 0, "location": { "O": 23.033869518247744, "M": 114.41709155204, "lng": 114.417092, "lat": 23.03387 } }, { "name": "南苑2栋", "oldName": "原21栋", "type": 0, "location": { "O": 23.03343804697885, "M": 114.41789085032644, "lng": 114.417891, "lat": 23.033438 } }, { "name": "南苑4栋", "oldName": "原17栋", "type": 0, "location": { "O": 23.033368932478904, "M": 114.4157279169932, "lng": 114.415728, "lat": 23.033369 } }, { "name": "南苑5栋", "oldName": "原16栋", "type": 0, "location": { "O": 23.032741963610047, "M": 114.4154414570213, "lng": 114.415441, "lat": 23.032742 } }, { "name": "南苑6栋(规划)", "oldName": "", "type": 0, "location": { "O": 23.03218608165513, "M": 114.41539317725903, "lng": 114.415393, "lat": 23.032186 } }, { "name": "南苑7栋", "oldName": "原18栋", "type": 0, "location": { "O": 23.031772377693493, "M": 114.41567856428185, "lng": 114.415679, "lat": 23.031772 } }, { "name": "南苑8栋", "oldName": "原19栋", "type": 0, "location": { "O": 23.03127375898659, "M": 114.41598111750784, "lng": 114.415981, "lat": 23.031274 } }, { "name": "南苑9栋(规划)", "oldName": "", "type": 0, "location": { "O": 23.030770201588616, "M": 114.41634804366834, "lng": 114.416348, "lat": 23.03077 } }, { "name": "中苑1栋", "oldName": "原15栋", "type": 0, "location": { "O": 23.03514091413985, "M": 114.416214766606, "lng": 114.416215, "lat": 23.035141 } }, { "name": "教职工餐厅", "oldName": "", "type": 2, "location": { "O": 23.039451408363714, "M": 114.42094625927734, "lng": 114.420946, "lat": 23.039451 } }, { "name": "北苑1栋", "oldName": "13栋", "type": 0, "location": { "O": 23.044202239808154, "M": 114.417802710312, "lng": 114.417803, "lat": 23.044202 } }, { "name": "教职工宿舍", "oldName": "", "type": 0, "location": { "O": 23.036045161000253, "M": 114.42201699731254, "lng": 114.422017, "lat": 23.036045 } }, { "name": "正门", "oldName": "", "type": 3, "location": { "O": 23.03808891978227, "M": 114.42209960931729, "lng": 114.4221, "lat": 23.038089 } }, { "name": "东北门", "oldName": "", "type": "3", "location": { "O": 23.0425110341717, "M": 114.41983260606173, "lng": 114.419833, "lat": 23.042511 } }],
      
      //类型
      buildingType = [
        '宿舍',
        '教学楼',
        '生活', //食堂,快递站,小卖铺,银行,热水卡
        '路标'
      ],

      buildingTypeToClassName = [
        'type_dormitory',
        'type_classroom',
        'type_live',
        'type_location'
      ];
  
    function notePoint(info){
      var $dom = new SimpleMarker({
        containerClassNames: buildingTypeToClassName[info.type],

        iconStyle: 'blue',
        iconLabel: {
          innerHTML: info.name + ' <span class="oldName">' + '| ' + info.oldName + '</span>'
        },

        //显示定位点
        // showPositionPoint: true,

        map: map,
        position: info.location
      });
    }

    // $container.addEventListener('touchmove',function(){
    //   var point = map.getCenter();

    //   requestAnimationFrame(function(){
    //     $positionDisplayer.innerText = 'x:' + point.lng + ' y:' + point.lat;
    //   });
    // });

    //录入数据
    $pin.addEventListener('touchend',function(){
      var point = map.getCenter(),
        info = {
          name: $pointName.value,
          oldName: $pointOldName.value,
          type: $pointType.value,
          location: point
        };
      
      notedPoints.push(info);
      notePoint(info);
    });

    window.exportNotedPoints = function(){
      return JSON.stringify(notedPoints);
    };

    //导入之前生成的点
    notedPoints.forEach(function(point){
      notePoint(point);
    });

    //旧名称显示控制器
    $showOldNameSwitcher.addEventListener('click',function(){
      if ($showOldNameSwitcher.classList.contains('on')){
        $showOldNameSwitcher.classList.remove('on');
        $container.classList.remove('showOldName');
      }else{
        $showOldNameSwitcher.classList.add('on');
        $container.classList.add('showOldName');
      }
    });

    setTimeout(function(){
      $showOldNameSwitcher.dispatchEvent(new MouseEvent({}));
    },100);

    //类型选择器
    $showTypeSelector.addEventListener('change',function(){
      if($showTypeSelector.value != ''){
        $container.setAttribute(
          'class', 
          'noneAnimation subNoneAnimation hiddenRest ' +
          'show_' + buildingTypeToClassName[$showTypeSelector.value]
        );
      }else
        $container.setAttribute('class','noneAnimation subNoneAnimation');
    });
  });
};