<?php

class mandarin extends __base__ {
  public function getData(){
    $posfield = "__VIEWSTATE=&txtStuID={$this->studentID}&txtName={$this->studentName}&txtIDCard={$this->studentIDCard}&btnLogin==%E6%9F%A5++%E8%AF%A2&txtCertificateNO=&txtCardNO=";

    return $this->Curl->post()->direct
            ->url('http://gd.cltt.org/Web/Login/PSCP01001.aspx')
            ->data($posfield)
            ->referer('http://gd.cltt.org/Web/Login/PSCP01001.aspx')->getResponse();

  }
  public function parse(){
    if(preg_match('/border:0">.+<\/table>/isu',$this->raw,$match)){
      //剪掉头部
      $match[0] = str_replace('border:0">','',$match[0]);
      $match[0] = str_replace('</table>','',$match[0]);
      //替换url地址
      $match[0] = str_replace('../common/','http://gd.cltt.org/Web/common/',$match[0]);
      //拿一个证件照
      //http://gd.cltt.org/Web/common/GeneratePhotoByStuID.ashx?stuID=

      //换一种思路,瞬间结构清晰
      preg_match_all('/<td bgcolor="#F6f6f6">.*<\/td>/isU',$match[0],$info);
      // var_dump($info);
      $dom = '<div class="table"><div>名字：</div><span>'.$studentName.'</span></div>';
      for($i = 0 ; $i < count($info[0])/2; $i++){
          $info[0][$i*2] = str_replace('<td bgcolor="#F6f6f6">','',$info[0][$i*2]);
          $info[0][$i*2+1] = str_replace('<td bgcolor="#F6f6f6">','',$info[0][$i*2+1]);
          $info[0][$i*2] = str_replace('</td>','',$info[0][$i*2]);
          $info[0][$i*2+1] = str_replace('</td>','',$info[0][$i*2+1]);
          $info[0][$i*2] = preg_replace('/\s/','',$info[0][$i*2]);
          $info[0][$i*2+1] = preg_replace('/\s/','',$info[0][$i*2+1]);
          $dom .= '<div class="table"><div>'.$info[0][$i*2].'</div><span>'.$info[0][$i*2+1].'</span></div>';
      }
      $selfieUrl = 'http://gd.cltt.org/Web/common/GeneratePhotoByStuID.ashx?stuID='.$info[0][1];
      return [
          'dom'=>$dom,
          'selfieUrl'=>$selfieUrl
      ];
    }
    return false;
  }
  public function store(){
    
  }

  public function get($studentID='', $studentName='', $studentIDCard=''){
    $this->studentID = $studentID;
    $this->studentName = $studentName;
    $this->studentIDCard = $studentIDCard;

    return $this->data;
  }
}