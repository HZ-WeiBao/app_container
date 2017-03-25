<?php
require_once("./include.php");

if (isset($_GET['studentCode']) && isset($_GET['validCode'])){
    $studentCode = sqlFilter($_GET['studentCode']);
    $validCode = sqlFilter($_GET['validCode']);

    if(strlen($studentCode) < 1 || strlen($validCode) < 4){
        echo json_encode([
            'error'=>'输入有误~'
        ]);
        exit();
    }
    //
    $ch = curl_init();
    curl_setopt_array($ch,[
        CURLOPT_URL=>"http://query.5184.com/query/fxl/ncre_score_2016_b.jsp?name0={$studentCode}&rand={$validCode}&serChecked=on",
        CURLOPT_HTTPHEADER=>[
            'Host: query.5184.com',
            'Connection: keep-alive',
            'Pragma: no-cache',
            'Cache-Control: no-cache',
            'Upgrade-Insecure-Requests: 1',
            'User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko)Chrome/56.0.2924.18 Safari/537.36',
            'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'DNT: 1',
            'Referer: http://query.5184.com/query/fxl/ncre_score_2016_b.htm',
            'Accept-Encoding: gzip, deflate, sdch',
            'Accept-Language: zh-CN,zh;q=0.8',
        ],
        CURLOPT_RETURNTRANSFER=>1,
        CURLOPT_COOKIE=>'JSESSIONID='.$_COOKIE['computerTestQueryID']
    ]);
    curl_setopt($ch,CURLOPT_PROXY,'127.0.0.1:8887');//设置代理服务器
    curl_setopt($ch,CURLOPT_SSL_VERIFYPEER,0);//若PHP编译时不带openssl则需要此行
    $page = curl_exec($ch);
    echo $page;
    // echo json_encode($mark_arr);
}elseif(isset($_GET['act'])){
    if($_GET['act'] == 'getValidCode'){
        $ch = curl_init();
        curl_setopt_array($ch,[
            CURLOPT_URL=>'http://query.5184.com/query/image.jsp',
            CURLOPT_HTTPHEADER=>[
                'Host: query.5184.com',
                'Connection: keep-alive',
                'Pragma: no-cache',
                'Cache-Control: no-cache',
                'User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko)Chrome/56.0.2924.18 Safari/537.36',
                'Accept: image/webp,image/*,*/*;q=0.8',
                'DNT: 1',
                'Referer: http://query.5184.com/query/fxl/ncre_score_2016_b.htm',
                'Accept-Encoding: gzip, deflate, sdch',
                'Accept-Language: zh-CN,zh;q=0.8'
            ],
            CURLOPT_HEADER=>1,
            CURLOPT_RETURNTRANSFER=>1,
            CURLOPT_FOLLOWLOCATION=>0,
            CURLOPT_TIMEOUT=>120,
        ]);
        $page = curl_exec($ch);

        //分离body和header,比较原始的操作,真的,使用工具粒度大了之后,就不想用,或者不习惯使用小李杜的工具
        //来做本以为已经有粒度较大的工具的函数了

        if (curl_getinfo($ch, CURLINFO_HTTP_CODE) == '200') {
            $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
            $header = substr($page, 0, $headerSize);
            $body = substr($page, $headerSize);
        }
        //处理header
        // var_dump($header);

        //提取set-cookies
        preg_match('/Set-Cookie: JSESSIONID=(.*);/U',$header,$cookies);
        // var_dump($cookies);

        $sessionID = $cookies[1];
        setcookie('computerTestQueryID',$sessionID);
        //然后把图片转化为base64
        echo 'data:image/*;base64,'.chunk_split(base64_encode($body));
    }
    //通用的
    if($_GET['act'] == 'feeback'){
        $post = file_get_contents('php://input', 'r');
        $data = json_decode($post,true);
        $chk = insert('feeback',[
            'type'=>'计算机查询',
            'problem'=> htmlspecialchars($data['content'],ENT_QUOTES)
        ]);
        if($chk){
            echo json_encode([
                'isOk'=>true
            ]);
        }
    }elseif($_GET['act'] == 'init_num'){
        $like_sql = select('like_log',['count'],['name'=>appName]);
        $use_sql = select('log',['count'],['name'=>appName]);
        $like = mysql_fetch_row($like_sql)[0];
        $use = mysql_fetch_row($use_sql)[0];
        echo json_encode([
            'num_of_like'=>intval($like),
            'num_of_use'=>intval($use),
        ]);
    }elseif($_GET['act'] == 'like'){
        logLike(appName);
    }
}