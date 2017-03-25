<?php

class HomeCtrl extends BaseCtrl {
  public function actionQuery(){
    $url = 'http://gd.cltt.org/Web/Login/PSCP01001.aspx';

    $json = file_get_contents('php://input');
    $post = json_decode($json,true);

    $studentID = $post['studentID'];
    $studentName = $post['studentName'];
    $studentIDCard = $post['studentIDCard'];

    $posfield = "__VIEWSTATE=&txtStuID={$studentID}&txtName={$studentName}&txtIDCard={$studentIDCard}&btnLogin==%E6%9F%A5++%E8%AF%A2&txtCertificateNO=&txtCardNO=";

    $ch = curl_init();
    curl_setopt_array($ch,[
        CURLOPT_URL=>$url,
        CURLOPT_RETURNTRANSFER=>true,
        CURLOPT_POST=>true,
        CURLOPT_POSTFIELDS=>$posfield,
        CURLOPT_REFERER=>'http://jx.cltt.org/Web/Login/PSCP01001.aspx'
    ]);

    $reulst = curl_exec($ch);

    //找到结果
    if(preg_match('/border:0">.+<\/table>/isu',$reulst,$match)){
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
        echo json_encode([
            'dom'=>$dom,
            'selfieUrl'=>$selfieUrl
        ]);
    }else{
        echo json_encode([
            'dom'=>'<div style="text-align:center;width:100%;margin-top:30px;">查询未果~~</div>',
        ]);
    }
  }
}