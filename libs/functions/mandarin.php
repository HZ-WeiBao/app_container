<?php

class mandarin extends __base__ {
  public function getData(){
    $posfield = "__VIEWSTATE=&txtStuID={$this->id}&txtName={$this->name}&txtIDCard={$this->cardId}&btnLogin==%E6%9F%A5++%E8%AF%A2&txtCertificateNO=&txtCardNO=";

    return $this->Curl->post()->direct
            ->url('http://gd.cltt.org/Web/Login/PSCP01001.aspx')
            ->data($posfield)
            ->referer('http://gd.cltt.org/Web/Login/PSCP01001.aspx')->getResponse();
  }

  public function parse(){
    
    $i = function($tds,$num){
      return trim($tds->item($num)->textContent);
    };

    try{
      $table = $this->dom->getElementById('LooUpSocreList_Div')
              ->getElementsByTagName('table')->item(0);
      $tds = $table->getElementsByTagName('td');

      $imgSrc = $tds->item(5)->getElementsByTagName('img')->item(0)->getAttribute('src');
      $imgSrc = str_replace('../','http://gd.cltt.org/Web/',$imgSrc);
      $grade = array(
        'id' =>     $i($tds,7),
        'cardId'=>  $i($tds,4),
        'name'=>    $i($tds,2),
        'examTime'=>$i($tds,11),
        'score'=>   $i($tds,13),
        'grade'=>   $i($tds,15),
        'certificateId'=>$i($tds,17),
        'province'=>$i($tds,19),
        'examLocation'=>$i($tds,21),
        'selfieUrl'=>$imgSrc
      );
    }catch(Error $e){
      return false;
    }
    return $grade;
  }
  public function store(){
    $this->edu_mandarinModel->write($this->data);
  }

  public function get($id='', $name='', $cardId=''){
    $entry = new edu_mandarinModel;
    if($entry->findOne('(id = ? and name = ?) or (id = ? and cardId = ?) or (name = ? and cardId = ?)',
    array(
      $id,$name,$id,$cardId,$name,$cardId
    ))->success())
      return $entry;
    
    $this->id = $id;
    $this->name = $name;
    $this->cardId = $cardId;
    if($this->data)
      $this->store();
    return $this->data;
  }
}