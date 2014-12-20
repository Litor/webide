// avalon 1.3.6
/**
 * @enName fileexplorer
 * @introduce
 */
define(["avalon", "text!./avalon.fileexplorer.html", "css!./avalon.fileexplorer.css", "css!./awesome/css/font-awesome.min.css", "rightmenu/avalon.rightmenu.fileopt"], function(avalon, template) {

    var counter = 0
    function getCnt() {
        return counter++
    }

    var _depth = 1;
    var templateArr = template.split('\{\{MS_FILE_EXPLORER\}\}');
    var mainTemplate = templateArr[0];
    var subTemplate = templateArr[1];

    function setFileStates(files){
        for(var i = 0; i < files.length; i++){
            if(files[i].subs){
                files[i].fold = false;
                files[i]._depth = _depth;
                _depth++;
                setFileStates(files[i].subs);
                _depth--;
            }
        }

        return files;
    }

    var widget = avalon.ui.fileexplorer = function (element, data, vmodels) {
        var options = data.fileexplorerOptions,
        $element = avalon(element),
        vmId = data.fileexplorerId;
        options.template = options.getTemplate(template, options);

        var vmodel = null;
        var inited, id = +(new Date());
        var outVmodel = vmodels && vmodels[0];

        var _vm = avalon.mix(options,{
            $id: vmId,
            widgetElement : element,
            $skipArray : ["widgetElement", "template"],
            width: options.width,
            height: options.height,
            $uid : id,
            //files : setFileStates(options.files),
            fold : function (file) {
                file.fold = !file.fold;
                avalon.vmodels['wiscodemirror'].load("file1", file.name);
            },
            saveFile : function (path, content) {

            },
            _rescan : function () {
                var nodes = vmodel.widgetElement.children, counter = 0
                for(var i = 0, len = nodes.length; i < len; i++) {
                    var node = nodes[i]
                    if(node.nodeType === 1 && node.tagName.toLowerCase() === "li") {
                        var file = node.getElementsByTagName("ul")[0] || node.getElementsByTagName("ol")[0]
                        if(file) {
                            var ele = avalon(file), d = ele.data()
                            if(d.widget === "fileexplorer") {
                                var opt = avalon.mix({}, options);
                                file.setAttribute("ms-widget", "fileexplorer")
                               var  name = data.fileexplorerId + "r" + getCnt()
                                var subData = vmodel.files[d.widgetIndex], obj = {}
                                if(subData.subs) {
                                    obj = avalon.mix(opt, {
                                        files: subData.subs
                                    })
                                }else{
                                    continue;
                                }
                                obj.index = d.widgetIndex
                                var subVmodel = avalon.define(name, function(svm) {
                                    svm.files = obj.files
                                    svm._depth = vmodel._depth+1;
                                    svm.$skipArray = ["files", "_depth"]
                                })
                                avalon.scan(file, [subVmodel].concat(vmodels))
                            }
                        }
                        counter++
                    }
                }
            },
            $init :  function (continueScan) {
                var _vmodels = [vmodel].concat(vmodels)
                if (inited) return;
                inited = true;
                vmodel.template = mainTemplate;

                if(outVmodel && outVmodel._depth != void 0) {
                    vmodel._depth = outVmodel._depth + 1;
                    vmodel.template = subTemplate;
                }

                element.innerHTML = vmodel.template;
                if (continueScan) {
                    continueScan();
                }
            }
        });

        if(!outVmodel._depth){
            _vm.files =  setFileStates(options.files);
            _vm._depth = options._depth;
        }else{
            _vm.files = outVmodel.files;
        }

        vmodel = avalon.define(_vm);
        if(!outVmodel._depth) {
            avalon.mix(vmodel, options);
        }
        element.onselectstart = function () {
            return false;
        }

        return vmodel;
    };

    widget.defaults = {
        files : [{name:'文件夹1', path: "./folder1", type: 'folder',
                    subs:[
                        {name:'file1.js', path: "./folder1/file1.js", type: 'js'},
                        {name:'file2.js', path: "./folder1/file2.js", type: 'js'}
                    ]
                },{name:'文件夹2', path: "./folder1", type: 'folder',
            subs:[
                {name:'file3.js', path: "./folder1/file3.js", type: 'js'},
                {name:'file4.js', path: "./folder1/file4.js", type: 'js'},
                {name:'子文件夹', path: "./folder1/file5.js", type: 'folder', subs:[
                    {name:'file5.js', path: "./folder1/file6.js", type: 'js'},
                    {name:'file6.js', path: "./folder1/file7.js", type: 'js'}
                ]}
            ]
        }],
        width:250,
        height:300,
        getTemplate: function (str, options) {
            return str;
        },
        _depth: 1
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
