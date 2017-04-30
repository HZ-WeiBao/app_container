<?php

class HomeCtrl extends BaseCtrl {
  public function actionIndex($args=array()){
    $saying = $this->char_sayingsModel->limit(1,$this->ConfigMgr->showingNum)->findAll();
    
    if(time() - strtotime($this->ConfigMgr->showingDay) > (3600 * 24)){//3600*24
      $this->ConfigMgr->showingDay = date('Y-m-d',time());
      
      $saying = $this->char_sayingsModel->limit(1,$this->ConfigMgr->showingNum)->findAll();
      $this->ConfigMgr->showingNum++;
      $this->ConfigMgr->save();
    }
    // $this->char_sayingsModel->limit(1,$this->ConfigMgr->showingNum);
    //现在就是需要用到moduleconfig的时候咯
    parent::actionIndex(array(
      'id' => $saying[0]->id,
      'saying' => $saying[0]->content,
      'category' => $saying[0]->category,
      'likeNum' => $saying[0]->likeNum,
    ));
  }
  public function actionLike(){
    global $_JSON;
    $this->char_sayingsModel->findOne('id = ?',array($_JSON->id));
    $this->char_sayingsModel->inc('likeNum')->save();
    echo $this->char_sayingsModel->likeNum;
  }

  public function actionUnLike(){
    global $_JSON;
    $this->char_sayingsModel->findOne('id = ?',array($_JSON->id));
    $this->char_sayingsModel->dec('likeNum')->save();
    echo $this->char_sayingsModel->likeNum;
  }
}