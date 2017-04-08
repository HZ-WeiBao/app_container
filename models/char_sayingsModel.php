<?php

class char_sayingsModel extends Sql {
  public function write($oneMonth){
    // var_dump($oneMonth);
    foreach($oneMonth as $pages){
      foreach($pages as $info){
        // var_dump($info);die();
        if(isset($info['sayings']))
        foreach($info['sayings'] as $saying){
          preg_match_all('/「/',$saying,$test);
          if(count($test[0]) == 1){
            preg_match('/「\d+」【看(.+)】(.+)/',$saying,$sayingSplit);
            $this->content = $sayingSplit[2];
            $this->category = $sayingSplit[1];
            $this->save();
          }
        }
      }
    }
  }

  public function writeFromForum($pages){
    foreach($pages as $page){
      foreach($page as $list){
        if(isset($list['sayings']))
        foreach($list['sayings'] as $saying){
          $this->content = $saying['content'];
          $this->category = $saying['category'];
          $this->save();
        }
      }
    }
  }
}