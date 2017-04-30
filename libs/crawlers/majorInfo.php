<?php

class majorInfo extends __base__ {
  public function getData(){
    set_time_limit(3600);
    $KBFB_LessonSel = $this->Curl->get()
      ->url('ZNPK/Private/List_XNXQKC.aspx',array(
        'xnxq' => $this->getXNXQ() ))
      ->getResponse();

    preg_match('/parent.theKC.innerHTML=\'(.+)\';<\/script>/',(string)$KBFB_LessonSel,$domStr);

    if( isset($domStr[1]) ){
      $majors = array();
      $dom = $this->getDom($domStr[1]);
      $this->getOptionsTo($majors,
        $dom->getElementsByTagName('select'),'Sel_KC');
      
      $counting = 0;
      foreach($majors as &$major){
        $KBFB_RoomSel_rpt = $this->getDom($this->Curl->post()
          ->url('ZNPK/KBFB_LessonSel_rpt.aspx')
          ->data(http_build_query(array(
            'Sel_XNXQ' => $this->getXNXQ(),
            'gs'       => '2',
            'txt_yzm'  => '',
            'Sel_KC'   => $major['id'] )))
          ->referer('Referer:http://119.146.68.54/Jwweb/ZNPK/KBFB_LessonSel.aspx')
          ->getResponse());
        
        $tables = $KBFB_RoomSel_rpt->getElementsByTagName('table');
        if($tables->length == 4){
          $trs = $tables->item(3)->getElementsByTagName('tr');
          $lastTdInfo = array();
          for($i = 1; $i < $trs->length; $i++){
            $tds = $trs->item($i)->getElementsByTagName('td');
            $courseTable = array(
              'teacher'   => $tds->item(0)->textContent,
              'classType' => $tds->item(3)->textContent,
              'class'     => $tds->item(5)->textContent,
              'week'      => $tds->item(6)->textContent,
              'section'   => $tds->item(7)->textContent,
              'room'      => $tds->item(8)->textContent
            );

            if($courseTable['teacher'] == ''){
              $courseTable['teacher']   = $lastTdInfo['teacher'];
              $courseTable['class']     = $lastTdInfo['class'];
              $courseTable['classType'] = $lastTdInfo['classType'];
            }else{
              $lastTdInfo['teacher']     = $courseTable['teacher'];
              $lastTdInfo['class']       = $courseTable['class'];
              $lastTdInfo['classType']   = $courseTable['classType'];
            }

            $major['course'][] = $courseTable;
          }
        }
        // $counting++;
        // if($counting > 500)
        //   break;
      }
    }
    return $majors;
  }
  public function parse(){
    return $this->raw;
  }
  public function store(){
    $this->edu_major_listModel->write($this->data);
    $this->edu_major_infoModel->write($this->data);
  }
}
