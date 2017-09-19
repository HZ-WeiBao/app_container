<?php

class mandarinNew extends __base__ {
  public function getData(){
    $posfield = "name={$this->name}&stuID={$this->id}&idCard={$this->cardId}";

    return $this->Curl->post()->direct
            ->url('http://www.cltt.org/StudentScore/ScoreResult')
            ->data($posfield)
            ->referer('http://www.cltt.org/StudentScore')
            ->getResponse();
  }

  public function parse(){
    // return $this->raw;

    $i = function($tds,$num){
      return trim($tds->item($num)->textContent);
    };

    $j = function($tds,$num){
      $str = trim($tds->item($num)->textContent);
      return explode('：',$str)[1];
    };

    try{
      $table = $this->dom->getElementsByTagName('table')->item(0);
      $tds = $table->getElementsByTagName('span');

      $imgSrc = $tds->item(0)->getElementsByTagName('img')->item(0)->getAttribute('src');
      
      $ps = $this->dom->getElementsByTagName('p');
      foreach ($ps as $p) {
        if(trim($p->getAttribute('class')) == 'cont-box-tit txtcenter'){
          $spans = $p->getElementsByTagName('span');
          break;
        }
      }
      
      $grade = array(
        'id' =>     $i($tds,5),
        'cardId'=>  $i($tds,7),
        'name'=>    $i($tds,1),
        'examTime'=>$j($spans,0),
        'score'=>   $i($tds,2),
        'grade'=>   $i($tds,4),
        'certificateId'=>$i($tds,6),
        'province'=>$j($spans,1),
        'examLocation'=>$j($spans,2),
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
    // if($entry->findOne('(id = ? and name = ?) or (id = ? and cardId = ?) or (name = ? and cardId = ?)',
    // array(
    //   $id,$name,$id,$cardId,$name,$cardId
    // ))->success())
    //   return $entry;
    
    $this->id = $id;
    $this->name = $name;
    $this->cardId = $cardId;
    if($this->data)
      $this->store();
    return $this->data;
  }
}