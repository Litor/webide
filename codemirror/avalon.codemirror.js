// avalon 1.3.6
/**
 * @enName codemirror
 * @introduce
 */
define(["avalon", "text!./avalon.codemirror.html",  "./codemirror/addon/search/search.js",
"./codemirror/addon/edit/matchbrackets.js", "./codemirror/addon/edit/closebrackets.js", "./codemirror/addon/comment/comment.js",
"./codemirror/addon/wrap/hardwrap.js", "./codemirror/addon/fold/foldcode.js", "./codemirror/addon/fold/brace-fold.js",
"./codemirror/mode/javascript/javascript.js", "./codemirror/keymap/sublime.js", "css!./codemirror/lib/codemirror.css",
"css!./codemirror/addon/fold/foldgutter.css", "css!./codemirror/addon/dialog/dialog.css", "css!./codemirror/theme/monokai.css","css!./avalon.codemirror.css"], function(avalon, template) {

    var widget = avalon.ui.codemirror = function (element, data, vmodels) {
        var options = data.codemirrorOptions,
        preKey = null,
        $element = avalon(element),
        vmId = data.codemirrorId;
        options.template = options.getTemplate(template, options);
        var inited, id = +(new Date());

        var vm = avalon.mix({
            $skipArray : ["template"],
            $uid : id,
            options :options,
            getContent: function(){
                return vmodel.editor.getValue();
            },
            load : function (path, content) {
                vmodel.path = path;
                vmodel.content = content;
            },
            $init :  function (continueScan) {
                var _vmodels = [vmodel].concat(vmodels)
                if (inited) return;
                inited = true;
                vmodel.template = vmodel.template.replace(/\{\{MS_COMBOX_ID\}\}/g, id);
                element.innerHTML = vmodel.template;

                require("codemirror/codemirror/lib/codemirror", function (CodeMirror) {
                    vmodel.editor = CodeMirror(element.children[0], {
                        value: vmodel.content,
                        lineNumbers: true,
                        mode: "javascript",
                        keyMap: "sublime",
                        autoCloseBrackets: true,
                        matchBrackets: true,
                        showCursorWhenSelecting: true,
                        theme: "monokai"
                    });
                })

                if (continueScan) {
                    continueScan();
                }
            }
        }, options);

        var vmodel = avalon.define(vm);

        avalon(element).bind("keydown", function (e) {
            if(preKey == 17 && e.keyCode == 83){
                avalon.vmodels['wisfileexplorer'].saveFile(vmodel.path, vmodel.getContent());
            }

            if ((window.event.ctrlKey)&&window.event.keyCode==83){
                event.returnValue=false;
            }
            preKey = e.keyCode;
        })

        vmodel.$watch("content", function () {
            vmodel.editor.setValue(vmodel.content);
        })

        return vmodel;
    };


    widget.defaults = {
        content:"",//文件内容
        width:400,//编辑器宽度
        height:600,//编辑器高度
        path:'',//当前编辑文件路径， 用于保存文件时使用
        /**
         * load: 编辑器重新载入文件方法
         * params: (path, content)path:文件路径; content: 文件内容
         */
        load : avalon.noop(),
        /**
         * getContent: 获取文件内容
         * */
        getContent : avalon.noop(),
        getTemplate: function (str, options) {
            return str;
        }
    };

    return avalon;
});

/**
  //遍历数组元素，依次处理
  [].forEach(function (dataItem, index) {
      if (dataItem.selected) {
          selectedData.push(dataItem);
      }
  });

  //监听view model中属性的变化
  vmodel.$watch("scrollerHeight", function(n) {

  //解析字符串模板为dom对象
  var dom = avalon.parseHTML(options.template);
  });
*/
