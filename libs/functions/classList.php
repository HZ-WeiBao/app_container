<?php

class classList extends __base__ {
  public function getData(){
    return $this->Curl->get()->url('ZNPK/KBFB_ClassSel.aspx')->getResponse();
  }
  public function parse(){
    $options = array();
    foreach($this->dom->getElementsByTagName('select') as $key=>$select){
      foreach($select->getElementsByTagName('option') as $option){
        $options[$key][] = array(
          'value' => $option->getAttribute('value'),
          'text'  => $option->textContent
        );
      }
    }
    return $options[1];//0 是学期列表 1 是该学期班级列表
  }
  private function store(){
    //文件保存
    $this->DataMgr->write('KBFB_ClassSel','html',$this->raw);
    //数据库保存
    $this->edu_class_listModel->write($this->data);
  }
}