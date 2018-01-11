<?php

include 'base.php';

$relative_path_existed_file_exists = excuteTime(function(){
  loop(function(){
    file_exists('existsFile.txt');
  });
});

$relative_path_none_existed_file_exists = excuteTime(function(){
  loop(function(){
    file_exists('existsFile.txt');
  });
});

$relative_path_existed_is_file = excuteTime(function(){
  loop(function(){
    is_file('noneExistsFile.txt');
  });
});

$relative_path_none_existed_is_file = excuteTime(function(){
  loop(function(){
    is_file('noneExistsFile.txt');
  });
});

$relative_path_existed_is_readable = excuteTime(function(){
  loop(function(){
    is_readable('noneExistsFile.txt');
  });
});

$relative_path_none_existed_is_readable = excuteTime(function(){
  loop(function(){
    is_readable('noneExistsFile.txt');
  });
});

////////////

$direct_path_existed_file_exists = excuteTime(function(){
  loop(function(){
    file_exists(__DIR__.'existsFile.txt');
  });
});

$direct_path_none_existed_file_exists = excuteTime(function(){
  loop(function(){
    file_exists(__DIR__.'existsFile.txt');
  });
});

$direct_path_existed_is_file = excuteTime(function(){
  loop(function(){
    is_file(__DIR__.'noneExistsFile.txt');
  });
});

$direct_path_none_existed_is_file = excuteTime(function(){
  loop(function(){
    is_file(__DIR__.'noneExistsFile.txt');
  });
});

$direct_path_existed_is_readable = excuteTime(function(){
  loop(function(){
    is_readable(__DIR__.'noneExistsFile.txt');
  });
});

$direct_path_none_existed_is_readable = excuteTime(function(){
  loop(function(){
    is_readable(__DIR__.'noneExistsFile.txt');
  });
});


echoLine("relative_path_existed_file_exists:\t".$relative_path_existed_file_exists.'ms');
echoLine("relative_path_existed_is_file:\t\t".$relative_path_existed_is_file.'ms');
echoLine("relative_path_existed_is_readable:\t".$relative_path_existed_is_readable.'ms');

echoLine();

echoLine("relative_path_none_existed_file_exists:\t".$relative_path_none_existed_file_exists.'ms');
echoLine("relative_path_none_existed_is_file:\t".$relative_path_none_existed_is_file.'ms');
echoLine("relative_path_none_existed_is_readable:\t".$relative_path_none_existed_is_readable.'ms');

///////
echoLine();

echoLine("direct_path_existed_file_exists:\t".$direct_path_existed_file_exists.'ms');
echoLine("direct_path_existed_is_file:\t\t".$direct_path_existed_is_file.'ms');
echoLine("direct_path_existed_is_readable:\t".$direct_path_existed_is_readable.'ms');

echoLine();

echoLine("direct_path_none_existed_file_exists:\t".$direct_path_none_existed_file_exists.'ms');
echoLine("direct_path_none_existed_is_file:\t".$direct_path_none_existed_is_file.'ms');
echoLine("direct_path_none_existed_is_readable:\t".$direct_path_none_existed_is_readable.'ms');



