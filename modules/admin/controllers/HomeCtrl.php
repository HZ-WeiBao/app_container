<?php

class HomeCtrl extends BaseCtrl {
  public function actionIndex($arg=array()){
    //获取module信息
    $modules = array();
    foreach($this->module_statisticsModel->orderBy(array('useNum'))->DESC()->findAll() as $module){
      $module->config = new ConfigMgr($module->moduleName);
      $module->commentNum = 0;
      $module->unReadNum = 0;
      $modules[$module->moduleName] = $module;
    }
    //未读留言还有留言总数
    foreach($this->module_commentModel->findAll('1') as $comment){
      $modules[$comment->moduleName]->commentNum++;
      if($comment->isRead != '1')
          $modules[$comment->moduleName]->unReadNum++;
    }
    //总数统计~
    $total = array(
      'likeNum' => 0,
      'commentNum' => 0,
      'useNum' => 0
    );

    foreach($modules as $module)
      foreach($total as $key => &$value)
        $value += $module->{$key};
  
    parent::actionIndex(array(
      'modules' => $modules,
      'total' => (object)$total
    ));
  }

  public function actionCommentMgr(){
    global $_JSON;
    //我靠现在需要存在性的检测啊,感觉这个挺好性能的我觉得还是算了

    if(@$_JSON->module != ''){
      $comments = $this->module_commentModel->findAll('moduleName = ? and isRead is null',array($_JSON->module));
      $this->module_commentModel->isRead = 1;
      $this->module_commentModel->save();
      if(count($comments) > 0){
        $unReadList = View::render('Home/CommentList',array(
          'comments' => $comments
          ),true);
      }else{
        $unReadList = '<span class="message">有吗?没找到~</span>';
      }
      View::render('this',array(
        'module' => $_JSON->module,
        'config' => new ConfigMgr($_JSON->module),
        'unReadList' => $unReadList
      ));
    }else
      View::render('Home_/Error',array(
        'message' => '参数出错了'
      ));
  }
  public function actionCommentList(){
    global $_JSON;

    if(@$_JSON->module != '' && @$_JSON->tab != ''){
      switch($_JSON->tab){
        case 'UnRead':
          $comments = $this->module_commentModel->findAll('moduleName = ? and isRead is null',array($_JSON->module));
        break;
        case 'Read':
          $comments = $this->module_commentModel->findAll('moduleName = ? and isRead = 1',array($_JSON->module));
        break;
        case 'All':
          $comments = $this->module_commentModel->findAll('moduleName = ? ',array($_JSON->module));
        break;
        default :$comments = array();
      }
      if(count($comments) > 0)
        View::render('this',array(
          'comments' => $comments
        ));
      else
        echo '<span class="message">有吗?没找到~</span>';
    }else
      View::render('Home_/Error',array(
        'message' => '参数出错了'
      ));
  }

  public function actionCommentStar(){
    global $_JSON;
    if(@$_JSON->id != ''){
      $this->module_commentModel->findOne('id = ?',array($_JSON->id));
      $this->module_commentModel->markStar = 1;
      $this->module_commentModel->save();
      echo 'done';
    }else{
      header("HTTP/1.1 404 Arguments Error");
    }
  }
  public function actionCommentLike(){
    global $_JSON;
    if(@$_JSON->id != ''){
      $this->module_commentModel->findOne('id = ?',array($_JSON->id));
      $this->module_commentModel->inc('likeNum')->save();
      echo 'done';
    }else{
      header("HTTP/1.1 404 Arguments Error");
    }
  }
  public function actionCommentUnStar(){
    global $_JSON;
    if(@$_JSON->id != ''){
      $this->module_commentModel->findOne('id = ?',array($_JSON->id));
      $this->module_commentModel->markStar = null;
      $this->module_commentModel->save();
      echo 'done';
    }else{
      header("HTTP/1.1 404 Arguments Error");
    }
  }
  public function actionCommentUnLike(){
    global $_JSON;
    if(@$_JSON->id != ''){
      $this->module_commentModel->findOne('id = ?',array($_JSON->id));
      $this->module_commentModel->dec('likeNum')->save();
      echo 'done';
    }else{
      header("HTTP/1.1 404 Arguments Error");
    }
  }
  public function actionReply(){
    global $_JSON;
    if(@$_JSON->id != ''){
      $this->module_commentModel->findOne('id = ?',array($_JSON->id));
      $this->module_commentModel->reply = $_JSON->content;
      $this->module_commentModel->save();
      echo 'done';
    }else{
      header("HTTP/1.1 404 Arguments Error");
    }
  }
}