<?php

class classList extends __base__ {
  public function getData(){
    $this->Curl->get()->url('ZNPK/KBFB_ClassSel.aspx')->run();
  }
  private function store(){}
  public function parse(){}
}