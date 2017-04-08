<?php

class classRoomInfo extends __base__ {
  public function getData(){
    set_time_limit(0);
    $KBFB_RoomSel = $this->getDom(
      $this->Curl->get()->url(
        'ZNPK/KBFB_RoomSel.aspx')->getResponse());
    
    $campuses = array();
    $this->getOptionsTo($campuses,
      $KBFB_RoomSel->getElementsByTagName('select'),'Sel_XQ');
    
    //抓取buildings

    foreach($campuses as &$campus){
      $List_JXL = $this->Curl->get()->url(
        'ZNPK/Private/List_JXL.aspx',array(
          'w'  => 150,
          'id' => $campus['id']))
        ->referer('Referer:http://119.146.68.54/Jwweb/ZNPK/KBFB_RoomSel.aspx')
        ->getResponse();

      preg_match('/parent.theJXL.innerHTML=\'(.+)\';<\/script>/',(string)$List_JXL,$domStr);

      if( isset($domStr[1]) ){
        $dom = $this->getDom($domStr[1]);
        $this->getOptionsTo($campus['buildings'],
          $dom->getElementsByTagName('select'),'Sel_JXL');
      }

      //然后会拿该buildings的课室~
      foreach($campus['buildings'] as &$building){
        $List_ROOM = $this->Curl->get()->url(
          'ZNPK/Private/List_ROOM.aspx',array(
            'w'  => 150,
            'id' => $building['id']))
          ->referer('Referer:http://119.146.68.54/Jwweb/ZNPK/KBFB_RoomSel.aspx')
          ->getResponse();

        preg_match('/parent.theROOM.innerHTML=\'(.+)\';<\/script>/',(string)$List_ROOM,$domStr);

        
        if( isset($domStr[1]) ){
          $dom = $this->getDom($domStr[1]);
          $this->getOptionsTo($building['rooms'],
            $dom->getElementsByTagName('select'),'Sel_ROOM');
        }
        
        //然后是拿room的课表数据咯~~
        foreach($building['rooms'] as &$room){
          $KBFB_RoomSel_rpt = $this->getDom($this->Curl->post()
            ->url('ZNPK/KBFB_RoomSel_rpt.aspx')
            ->data(http_build_query(array(
              'Sel_XNXQ' => $this->getXNXQ(),
              'rad_gs'   => '2',
              'txt_yzm'  => '',
              'Sel_XQ'   => $this->getXQ(),
              'Sel_JXL'  => $building['id'],
              'Sel_ROOM' => $room['id'] )))
            ->referer('Referer:http://119.146.68.54/Jwweb/ZNPK/KBFB_RoomSel.aspx')
            ->getResponse());
          
          //应该是直接使用item()
          $tables = $KBFB_RoomSel_rpt->getElementsByTagName('table');
          if($tables->length >= 3){//有课表的table
            //还是需要检查一下是那种表
            
            // if($room['id'] == 1010703 ){
            //   var_dump($tables->item(2)->textContent);
            //   die();
            // }
            if(strpos($tables->item(1)->textContent, '临时活动') > -1){//说明只有临时活动
              $trs = $tables->item(2)->getElementsByTagName('tr');
              for($i = 1; $i < $trs->length; $i++){
                $tds = $trs->item($i)->getElementsByTagName('td');

                $activity = array(
                  'name' => $tds->item(2)->textContent,
                  'organization' => $tds->item(4)->textContent,
                  'week' => $tds->item(0)->textContent,
                  'section' => $tds->item(1)->textContent
                );

                $room['activity'][] = $activity;
              }
            }else{
              $trs = $tables->item(3)->getElementsByTagName('tr');
              $lastTdInfo = array();
              for($i = 1; $i < $trs->length; $i++){
                $tds = $trs->item($i)->getElementsByTagName('td');
                //检查数据
                $course = array(
                  'name' => $tds->item(0)->textContent,
                  'teacher' => $tds->item(7)->textContent,
                  'class' => $tds->item(10)->textContent,
                  'week' => $tds->item(11)->textContent,
                  'section' => $tds->item(12)->textContent
                );

                if($course['name'] == '')
                  $course['name'] = $lastTdInfo['name'];
                else
                  $lastTdInfo['name'] = $course['name'];

                if($course['teacher'] == ''){
                  $course['teacher'] = $lastTdInfo['teacher'];
                  $course['class'] = $lastTdInfo['class'];
                }else{
                  $lastTdInfo['teacher'] = $course['teacher'];
                  $lastTdInfo['class']   = $course['class'];
                }

                $room['course'][] = $course;
              }
            }
          }
          if($tables->length >= 6){//有临时活动表的talbe
            $trs = $tables->item(5)->getElementsByTagName('tr');
            for($i = 1; $i < $trs->length; $i++){
              $tds = $trs->item($i)->getElementsByTagName('td');

              $activity = array(
                'name' => $tds->item(2)->textContent,
                'organization' => $tds->item(4)->textContent,
                'week' => $tds->item(0)->textContent,
                'section' => $tds->item(1)->textContent
              );

              $room['activity'][] = $activity;
            }
          }
        }
      }
    }

    return $campuses;
  }
  public function parse(){
    return $this->raw;
  }
  public function store(){
    $this->edu_classroom_listModel->write($this->data);
    $this->edu_classroom_courseModel->write($this->data);
    $this->edu_classroom_activityModel->write($this->data);
  }
}