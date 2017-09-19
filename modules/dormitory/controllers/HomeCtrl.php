<?php

class HomeCtrl extends BaseCtrl {
  public function actionIndex($args=[]){
    parent::actionIndex([
      openid => $_SESSION['openid'] ?? ''
    ]);
  }
  public function actionVote(){
    View::render('this',[
      openid => $_SESSION['openid'] ?? ''
    ]);
  }

  public function actionLoadMore(){
    global $_JSON;
    if($_JSON->page <= 2)
      echo '{
        "status": 0,
        "data": [{"dormnum":"14#121","imgUrl":"/img/qixi-bg.jpg","description":"一个人的宿舍","voteNum":1107},{"dormnum":"14#121","imgUrl":"/img/qixi-bg.jpg","description":"一个人的宿舍","voteNum":1107},{"dormnum":"14#121","imgUrl":"/img/qixi-bg.jpg","description":"一个人的宿舍","voteNum":1107},{"dormnum":"14#121","imgUrl":"/img/qixi-bg.jpg","description":"一个人的宿舍","voteNum":1107}]
      }';
    else 
      echo '{
        "status": 0,
        "data": []
      }';
  }
}