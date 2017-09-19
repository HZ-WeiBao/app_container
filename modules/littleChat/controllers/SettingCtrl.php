<?php

class SettingCtrl extends BaseCtrl {
  public function __call($fun,$arg){
    View::render('this');
  }
}