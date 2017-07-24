小小的框架~

start: 2017/2/6
end  : 2017/4/18

nginx配置

server {
    set $host_path "/mnt/d/DEV/Github/weibao/app_container/public";
    set $root_path "/mnt/d/DEV/Github/weibao/app_container";
    set $modules_path "/mnt/d/DEV/Github/weibao/app_container/modules";
    
    listen       83;
    server_name  localhost;
    root   $host_path;
    set $F_bootstrap "index.php";
    
    charset utf-8;
    #set $limit_rate 5k;
    
    location ~ \.(js|css)$ {
      if ( $uri ~ "^\/(\w+)\/((\w+)\/)*[\w\.]+\.(js|css)$" ) {
          set $modules $1;
          set $controller $3;
      }
      
      if ( $controller ~ "^(\w+)_$" ){
          set $controllerF $1;
      }
      
      if ( $controllerF != "" ){
          set $modules "frame";
          rewrite ^/([a-zA-Z]+)/([a-zA-Z_]+/)*(.*)$ /frame/views/$controllerF/$3 break;
          root $root_path ;
      }
      
      if ( $modules = "frame" ){
          root $root_path ;
      }
      
      if ( $modules = "js" ) {
         root $host_path ;
      }
      
      if ( $modules = "css" ) {
         root $host_path ;
      }
      
      if ( $modules = "data" ) {
         root $host_path ;
      }
      
      root $modules_path ;
    }

    location / {
        index  $F_bootstrap;
        try_files $uri $uri/ /$F_bootstrap?$args;
    }  

    location ~ \.php {
        fastcgi_split_path_info  ^(.+\.php)(.*)$;

        set $fsn /$F_bootstrap;
        if (-f $document_root$fastcgi_script_name){
            set $fsn $fastcgi_script_name;
        }

        fastcgi_pass   127.0.0.1:8888;
        include fastcgi_params;
        fastcgi_param  SCRIPT_FILENAME  $document_root$fsn;

        #PATH_INFO and PATH_TRANSLATED can be omitted, but RFC 3875 specifies them for CGI
        fastcgi_param  PATH_INFO        $fastcgi_path_info;
        fastcgi_param  PATH_TRANSLATED  $document_root$fsn;
    }

    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}