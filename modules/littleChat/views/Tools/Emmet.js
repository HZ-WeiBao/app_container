
function objectClone(obj, copyLevel) {
  var newObj;
  if (obj instanceof Array)
    newObj = [];
  else if (obj instanceof Object && typeof obj === 'object')
    newObj = {};

  for (var i in obj) {
    if (typeof obj[i] !== 'object')
      newObj[i] = obj[i];
    else {
      if (copyLevel == undefined) {
        newObj[i] = objectClone(obj[i], copyLevel);
      } else if (copyLevel > 0) {
        copyLevel--;
        newObj[i] = objectClone(obj[i], copyLevel);
      } else
        newObj[i] = obj[i];
    }
  }
  return newObj;
}

function objectEqual(obj1, obj2) {
  if (obj2 == undefined)
    return false;
  for (var i in obj1) {
    if (typeof obj1[i] !== 'object') {
      if (obj1[i] != obj2[i])
        return false;
    } else
      return objectEqual(obj1[i], obj2[i]);
  }
  return true;
}

function getObjectOf(root, str) {
  var path = str.split('/');
  path.forEach(function (dir) {
    if (root[dir] === undefined)
      root[dir] = {};
    root = root[dir];
  });
  return root;
}

function forEachObject(obj, callback) {
  for (var i in obj)
    callback(obj[i], i);
}

function Emmet(str, data) {
  var connectSymbols = '()+>^*';
  var decorateSymbols = '.#[]{}';
  var root = [];
  var path = [];
  var groupStack = [];
  var groupIndexStack = [];
  var noneDetermineMultiple = [];
  var parsingIndex;
  var elemment = {};
  var lastConnectSymbol = null;
  var console_notice_style = 'color: #673ab7;font-family:微软雅黑;';
  this.data = data;
  this.sourseStr = str;

  //工具函数
  var tool = [];
  tool.top = function (i) {
    i = (i == undefined) ? 1 : 1 + 1;
    return this[this.length - i];
  }
  root.__proto__ =
    path.__proto__ =
    groupStack.__proto__ =
    groupIndexStack.__proto__ =
    noneDetermineMultiple.__proto__ = tool

  var closestSymbolIndex = function (symbolSet, startIndex) {
    for (var i = startIndex; i < this.sourseStr.length; i++) {
      if (symbolSet.indexOf(this.sourseStr[i]) > -1) {
        //把=>排除
        if (this.sourseStr[i] === '>' && this.sourseStr[i - 1] === '=')
          continue;
        else
          return i;
      }
    };
    return i;
  }.bind(this);

  var parseDecorate = function () {
    var nextConnect = closestSymbolIndex(connectSymbols, parsingIndex),
      startIndex = parsingIndex,
      tmp_arr,
      mayDeadLoopCheck = 450000000,//在我的机器大概1s的执行时间
      deadLoopCheck;

    while (startIndex < nextConnect) {
      var nextDecorate = closestSymbolIndex(decorateSymbols, startIndex + 1),
        value, values, tmp, closeSymbolIndex;

      deadLoopCheck = startIndex;
      if (mayDeadLoopCheck-- < 0) {
        console.log("循环次数太多了,可能有死循环,退出编译");
        startIndex++;
        return null;
      }

      if (nextDecorate > nextConnect)
        nextDecorate = nextConnect;

      if ("\n\t\r ".indexOf(str[startIndex]) > -1) {//跳过
        startIndex++;
        continue;
      }

      switch (this.sourseStr[startIndex]) {
        case '.':
          if (elemment.class instanceof Array == false)
            elemment.class = [];
          value = this.sourseStr.slice(startIndex + 1, nextDecorate).trim();

          if (value[0] == '$') {
            getObjectOf(elemment, 'noneDetermineValue/class')[elemment.class.length] = value;
          } else
            value = parseValue(value);

          if (value instanceof Array) {
            value.forEach(function (i) {
              elemment.class.push(i);
            });
          } else //直接量时
            elemment.class.push(value);

          startIndex = nextDecorate;
          break;
        case '#':
          value = this.sourseStr.slice(startIndex + 1, nextDecorate).trim();

          if (value[0] == '$') {
            getObjectOf(elemment, 'noneDetermineValue').id = value;
          } else
            value = parseValue(value);

          elemment.id = value;

          startIndex = nextDecorate;
          break;
        case '[':
          closeSymbolIndex = this.sourseStr.indexOf(']', startIndex + 1);

          value = this.sourseStr.slice(startIndex + 1, closeSymbolIndex).trim();

          function splitAttr(str) {
            var attrs = [], key,
              strLen = str.length,
              equalIndex, separator, endIndex;

            for (var i = 0; i < strLen;) {
              equalIndex = str.indexOf('=', i);

              if (str[equalIndex + 1] == '>')
                equalIndex++;

              separator = str[equalIndex + 1];
              if (separator == '"' || separator == "'") {
                endIndex = str.indexOf(separator, equalIndex + 2);
                key = str.slice(i, endIndex + 1);
              } else {
                endIndex = str.indexOf(' ', equalIndex + 1);
                key = str.slice(i, endIndex);
              }

              if (endIndex == -1) {
                endIndex = strLen;
                key = str.slice(i, endIndex);
                attrs.push(key);
                break;
              }
              attrs.push(key);
              while ("\n\t\r ".indexOf(str[++endIndex]) > -1);
              i = endIndex;
            }

            return attrs;
          }

          tmp = splitAttr(value);
          nodeAttrValues = {};
          objAttrValues = {};
          tmp.forEach(function (str, i) {
            var attr, importKeyValue, importObj;

            importKeyValue = function (fromMatch, attributeType, toWhere) {
              if (fromMatch[1][0] == '$') {
                getObjectOf(elemment, 'noneDetermineValue/' + attributeType + '/key')[fromMatch[1]] = fromMatch[1];
              } else
                fromMatch[1] = parseValue(fromMatch[1]);

              if (fromMatch[2][0] == '$') {
                getObjectOf(elemment, 'noneDetermineValue/' + attributeType + '/value')[fromMatch[1]] = fromMatch[2];
              } else
                fromMatch[2] = parseValue(fromMatch[2]);

              toWhere[fromMatch[1]] = fromMatch[2];
            };
            importObj = function (attributeType, toWhere) {
              if (str[0] == '$') {
                getObjectOf(elemment, 'noneDetermineValue/' + attributeType + '/arr')[i] = str;
              } else {
                tmp_arr = parseValue(str);
                if (tmp_arr instanceof Object)
                  forEachObject(tmp_arr, function (value, key) {
                    toWhere[key] = value;
                  });
                else
                  console.log('%c属性导入仅支持Object类型~~', console_notice_style);
              }
            };

            if (str.indexOf('=>') == -1) {
              attr = str.match(/([a-zA-Z0-9-_@\$]+)=['"]*([^'">]*)['"]*/i);
              if (attr)
                importKeyValue(attr, 'nodeAttribute', nodeAttrValues);
            } else {
              attr = str.match(/([a-zA-Z0-9-_@\$]+)=>['"]*([^'">]*)['"]*/i);
              if (attr)
                importKeyValue(attr, 'objAttribute', objAttrValues);
            }

            if (!attr) {
              if (str.indexOf('=>') == 0) {
                str = str.slice(2);
                importObj('objAttribute', objAttrValues);
              } else if (str.indexOf('=') == 0) {
                str = str.slice(1);
                importObj('nodeAttribute', nodeAttrValues);
              }
            }
          }, this);

          elemment.nodeAttribute = nodeAttrValues;
          elemment.objAttribute = objAttrValues;
          startIndex = closeSymbolIndex + 1;
          break;
        case '{':
          closeSymbolIndex = this.sourseStr.indexOf('}', startIndex + 1);
          if (closeSymbolIndex === nextDecorate) {
            value = this.sourseStr.slice(startIndex + 1, closeSymbolIndex);
            if (value[0] == '$') {
              getObjectOf(elemment, 'noneDetermineValue').content = value;
            } else
              value = parseValue(value);

            elemment.content = value;

            startIndex = nextDecorate + 1;
          } else {
            //error
          }
          break;
      }

      if (deadLoopCheck == startIndex) {
        console.log("parseDecorate检测到deadLoop,退出编译");
        return null;
      }
    }

    return startIndex;
  }.bind(this);

  var parseTagName = function () {
    var fromConnect = closestSymbolIndex(connectSymbols, parsingIndex),
      fromDecorate = closestSymbolIndex(decorateSymbols, parsingIndex),
      smaller = (fromConnect > fromDecorate) ? fromDecorate : fromConnect,
      value = this.sourseStr.slice(parsingIndex, smaller).trim();

    if (value[0] == '$') {
      getObjectOf(elemment, 'noneDetermineValue').tag = value;
    } else
      value = parseValue(value);

    elemment.tag = value;
    return smaller;
  }.bind(this);

  var parseValue = function (value) {
    var address = this.data;
    if (value[0] === '@') {
      value = value.slice(1).split(':');
      value.forEach(function (dir) {
        address = address[dir];
      }.bind(this));

      return (address !== undefined) ? address : '@' + value;
    } else
      return value;
  }.bind(this);

  var getValue = function (str, value) {
    if (value instanceof Object) {
      var path = str.slice(1).split(':');
      var address = value;
      path.forEach(function (dir) {
        if (dir !== '')
          address = address[dir];
      });
      return address;
    } else
      return value;
  }

  var elementBindValue = function (elem, boundArr) {
    var ndv = elem.noneDetermineValue;

    elem.childs &&
      elem.childs.forEach(function (child) {
        elementBindValue(child, boundArr);
      });

    if (ndv === undefined) return;

    ndv.id && (elem.id = getValue(ndv.id, boundArr));
    ndv.content && (elem.content = getValue(ndv.content, boundArr));
    ndv.class &&
      forEachObject(ndv.class, function (value) {
        var arr = getValue(value, boundArr);
        elem.class.shift();
        if (arr instanceof Array)
          elem.class = elem.class.concat(arr);
        else
          elem.class.push(arr);
      });

    var bindAttr = function (attributeType) {
      if (ndv[attributeType]) {
        ndv[attributeType].value &&
          forEachObject(ndv[attributeType].value, function (value, key) {
            elem[attributeType][key] = getValue(value, boundArr);
          });
        ndv[attributeType].key &&
          forEachObject(ndv[attributeType].key, function (value, key) {
            var storeValue = elem[attributeType][key];
            delete elem[attributeType][key];
            elem[attributeType][getValue(value, boundArr)] = storeValue;
          });
        ndv[attributeType].arr &&
          forEachObject(ndv[attributeType].arr, function (value) {
            var obj = getValue(value, boundArr);
            if (obj instanceof Object)
              forEachObject(obj, function (value, key) {
                elem[attributeType][key] = value;
              });
            else
              console.log('%c属性导入仅支持Object类型~~', console_notice_style);
          });
      }
    };
    bindAttr('nodeAttribute');
    bindAttr('objAttribute');
    //done bind
    delete elem.noneDetermineValue;
  }

  var groupGenerator = function (compareScope, NDM) {
    var NDMgroup = [], levelMutiples = [], start = 0;

    var checkGrouped = function (mutiple_big, mutiple_small) {
      return mutiple_big.offset.start >= mutiple_small.offset.start && mutiple_small.offset.end <= mutiple_big.offset.end;
    };

    NDM.forEach(function (mutiple, key) {
      if (objectEqual(mutiple.path.top(), compareScope)) {
        levelMutiples.push(mutiple);
        delete NDM[key];
      }
    });

    levelMutiples.reverse().forEach(function (mutiple, i) {
      var nextMutiple = levelMutiples[i + 1];
      if (nextMutiple == undefined || (
        objectEqual(mutiple.path.top(), nextMutiple.path.top())
        && !checkGrouped(mutiple, nextMutiple)
      )) {
        NDMgroup.push(levelMutiples.reverse().slice(start, i + 1));
        start = i + 1;
      }
    });

    return NDMgroup;
  };

  var parseGroup = function (NDMgroup, scope, boundArr) {
    var boundArr_tmp, offset_tmp;
    NDMgroup.forEach(function (group, key) {
      var group_tmp = objectClone(group);

      mutiple = group_tmp.pop();
      if (mutiple) {
        boundArr_tmp = getValue(mutiple.value, boundArr);
        group_tmp.forEach(function (mutiple_fix_path) {
          mutiple_fix_path.path[mutiple_fix_path.path.length] = scope;
          scope.__proto__ = tool;
        });
        offset_tmp = scope.length;
        multipleElemment(
          boundArr_tmp.length, boundArr_tmp, mutiple.offset, scope, group_tmp
        );
        offset_tmp = scope.length - offset_tmp;
        for (var i0 = key + 1; i0 < NDMgroup.length; i0++) {
          NDMgroup[i0].forEach(function (mutiple) {
            mutiple.offset.start += offset_tmp;
            mutiple.offset.end += offset_tmp;
          });
        }
      }
    });
  };

  var multipleElemment = function (len, boundArr, offset, currentScope, NDM) {
    var scope, path_top_behind,
      mutiple, boundArr_tmp, sameNDMgroup_bak,
      sameNDMgroup = [],
      childNDMgroup = [],
      tplArr = [];

    for (var j = offset.start; j < offset.end; j++)
      tplArr.push(objectClone(currentScope[j]));

    if (NDM) sameNDMgroup = groupGenerator(currentScope, NDM);

    path_top_behind = currentScope.slice(offset.end);
    currentScope.splice(offset.start, (currentScope.length - offset.start));

    for (var i = 0; i < len; i++) {
      scope = [];
      tplArr.forEach(function (elem, key) {
        var newElem = objectClone(elem);

        if (NDM !== undefined && newElem.childs !== undefined && boundArr[i] !== undefined) {
          childNDMgroup = groupGenerator(newElem.childs, objectClone(NDM));
          parseGroup(childNDMgroup, newElem.childs, boundArr[i]);
        }

        scope[offset.start + key] = newElem;
      });

      if (boundArr[i] !== undefined)
        parseGroup(objectClone(sameNDMgroup), scope, boundArr[i]);

      scope.forEach(function (elemment) {
        if (boundArr[i] !== undefined)
          elementBindValue(elemment, boundArr[i]);
        currentScope.push(elemment);
      });
    }
    path_top_behind.forEach(function (elemment) {
      currentScope.push(elemment);
    });
  };

  var parseToDom = function (root) {
    var container = [];
    root.forEach(function (config) {
      var node = document.createElement(config.tag);
      config.id && node.setAttribute('id', config.id);
      config.class && node.setAttribute('class', config.class.join(' '));
      if (config.content) {
        (typeof config.content === 'string' || typeof config.content === 'number') && (node.innerHTML = config.content);

        config.content instanceof HTMLElement && node.appendChild(config.content);

        config.content instanceof Array &&
          config.content.forEach(function (elemment) {
            elemment instanceof HTMLElement && node.appendChild(elemment);
          });
      }
      config.nodeAttribute &&
        forEachObject(config.nodeAttribute, function (value, key) {
          node.setAttribute(key, value);
        });
      config.objAttribute &&
        forEachObject(config.objAttribute, function (value, key) {
          if (value instanceof Array && key.indexOf('on') === 0)
            value.forEach(function (eventProcessor) {
              node.addEventListener(key.slice(2), eventProcessor);
            });
          else
            node[key] = value;
        });
      config.childs &&
        parseToDom(config.childs).forEach(function (childNode) {
          node.appendChild(childNode);
        });
      container.push(node);
    });
    return container;
  }

  this.parse = function () {
    var temp, len = this.sourseStr.length,
      deadLoopCheck;

    path.push(root);

    for (parsingIndex = 0; parsingIndex < len;) {
      deadLoopCheck = parsingIndex;

      if ("\n\t\r ".indexOf(str[parsingIndex]) > -1) {//跳过
        parsingIndex++;
        continue;
      }

      if (connectSymbols.indexOf(str[parsingIndex]) > -1) {//处理连接符
        var tempSymbols = str[parsingIndex];
        switch (str[parsingIndex]) {
          case '(':
            groupStack.push({
              path: objectClone(path, 0),
              offset: path.top().length
            });
            break; case ')':
            var start;
            temp = groupStack.pop();
            path = temp.path;
            start = temp.offset;
            groupIndexStack.push({
              start: start,
              end: path.top().length
            });
            break; case '>':
            if (elemment.childs instanceof Array == false)
              elemment.childs = [];

            path.push(elemment.childs);
            break; case '+':
            // break;case "\n":
            // break;case "\t":
            // break;case "\r":
            // break;case " ":
            break; case '*':
            var endIndex = closestSymbolIndex(connectSymbols, parsingIndex + 1),
              value = this.sourseStr.slice(parsingIndex + 1, endIndex).trim();

            if (lastConnectSymbol != ')') {
              offset = {
                start: path.top().length - 1,
                end: path.top().length
              };
            } else
              offset = groupIndexStack.pop();

            if (value[0] === '$') {
              noneDetermineMultiple.push({
                path: objectClone(path, 0),
                offset: offset,
                value: value
              });
            } else {
              value = parseValue(value);
              if (value instanceof Array)
                multipleElemment(
                  value.length, value, offset, path.top(), noneDetermineMultiple);
              else
                multipleElemment(parseInt(value), [], offset, path.top());
            }
            parsingIndex = endIndex - 1;
            break; case '^':
            path.pop();
            break;
        }
        lastConnectSymbol = tempSymbols;
        parsingIndex++;
      } else {
        elemment = {};
        parsingIndex = parseTagName();

        if (decorateSymbols.indexOf(str[parsingIndex]) > -1)//处理修饰符
          parsingIndex = parseDecorate();

        if (path.top())
          path.top().push(elemment);
        else
          console.log('%c注意层级不能溢出,看看 ^ 有没有问题~~', console_notice_style);
      }

      if (deadLoopCheck == parsingIndex) {
        console.log("parse检测到deadLoop,退出编译");
        return null;
      }
    }
    return parseToDom(root);
  };

  this.bindData = function (data) {
    this.data = data;
  };
}

exports.make = function(str,config){
  return new Emmet(str,config);
};

// 还是挂载到window方便不止一丢丢
window.Emmet || (window.Emmet = Emmet);

//这样的使用方式也有点繁琐了
// (new Emmet()).parse()[0]