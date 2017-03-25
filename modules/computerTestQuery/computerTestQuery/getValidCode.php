<?php
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
// var_dump($body);
// echo base64_encode($body);
file_put_contents('validcode.jpg',$body);
//其实做客户端的sessionID转发,主要还是一个本站cookies的命名空间的管理
chunk_split();