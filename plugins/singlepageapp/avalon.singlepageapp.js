// avalon 1.3.6
/**
 * @enName singlepageapp
 * @introduce
 */
define(["avalon", "text!./avalon.singlepageapp.html", "css!./avalon.singlepageapp.css"], function(avalon, template) {
    /**
    *   templateArr = template.split('MS_OPTION_EJS');
    */
    var widget = avalon.ui.singlepageapp = function (element, data, vmodels) {
        var options = data.singlepageappOptions,
        $element = avalon(element),
        vmId = data.singlepageappId;
        options.template = options.getTemplate(template, options);

        var inited, id = +(new Date());

        var vm = avalon.mix({
            $id : vmId,
            widgetElement : element,
            $skipArray : ["widgetElement", "template"],
            $uid : id,
            changeMenu: function (menu) {
                vmodel.currentAppId = menu.path;
                resetModules(menu.path);
            },
            selectModule: function (appId, moduleId) {
                vmodel.currentPath = appId + "/" + moduleId;
                vmodel.currentModuleId = moduleId;
            },
            $init :  function (continueScan) {
                if (inited) return;
                inited = true;
                vmodel.template = vmodel.template.replace(/\{\{MS_COMBOX_ID\}\}/g, id);
                element.innerHTML = vmodel.template;


                if (continueScan) {
                    continueScan();
                }
            }
        }, options);

        var vmodel = avalon.define(vm);

        function resetWindowSize() {
            var windowHeight = document.getElementsByTagName("body")[0].offsetHeight;
            var windowWidth = document.getElementsByTagName("body")[0].offsetWidth;
            var leftHeight = windowHeight - element.children[0].children[0].offsetHeight - 2;
            var contentWidth = windowWidth - element.children[0].children[1].offsetWidth - 5;
            var contentHeight = leftHeight - 30;
            vmodel.contentWidth = contentWidth;
            vmodel.contentHeight = contentHeight;
            vmodel.leftHeight = leftHeight;
        }

        function resetModules(path){
            vmodel.modules.splice(0, vmodel.modules.length);
            if(path == 2){

                var modules = [
                    {
                        "id": "21",
                        appId: '2',
                        "title": "服务管理"
                    },
                    {
                        "id": "22",
                        appId: '2',
                        "title": "APP管理"
                    }
                ];
                pushModules(modules);
            }else if(path == 'sys'){
                var modules =  [{
                    "id": "10",
                    "title": "权限管理",
                    appId: 'sys',
                    "subModules": [
                        {
                            "id": "111",
                            "title": "用户管理",
                            appId: 'sys',
                            "url":"/1/121"
                        },
                        {
                            "id": "121",
                            "title": "角色管理",
                            appId: 'sys',
                            "url":"/1/131"
                        }
                    ]
                },
                    {
                        "id": "account",
                        "title": "帐号申请",
                        appId: 'sys',
                        "url":"/1/141"
                    },
                    {
                        "id": "role",
                        "title": "角色申请",
                        appId: 'sys',
                        "url":"/1/142"
                    }]
                pushModules(modules);
            }

            function pushModules(modules){
                for(var i = 0; i < modules.length; i++){
                    vmodel.modules.push(modules[i]);
                }
            }
        }

        window.onresize = function () {
            resetWindowSize();
        }
        window.onload = function () {
            resetWindowSize();
        }
        return vmodel;
    };

    widget.defaults = {
        leftHeight:'400',
        contentWidth:'1',
        contentHeight:'1',
        currentPath:'sys/111',
        currentModuleId:'111',
        currentAppId:'sys',
        topmenu:[{name:'系统管理', path:'sys', active:true}, {name:'开发平台', path:'2', active:true}],
        modules:[{
            "id": "10",
            "title": "权限管理",
            appId: 'sys',
            "subModules": [
                {
                    "id": "111",
                    "title": "用户管理",
                     appId: 'sys',
                    "url":"/1/121"
                },
                {
                    "id": "121",
                    "title": "角色管理",
                    appId: 'sys',
                    "url":"/1/131"
                }
            ]
        },
            {
                "id": "account",
                "title": "帐号申请",
                appId: 'sys',
                "url":"/1/141"
            },
            {
                "id": "role",
                "title": "角色申请",
                appId: 'sys',
                "url":"/1/142"
            }],
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

  //组件嵌套时 外部组件向内部组件传值
  var duplexVM = avalon.getModel(options.duplex, [vmodel].concat(vmodels)),
  duplexArr = duplexVM && duplexVM[1][duplexVM[0]]

   //新建dom元素
   popup = popup || document.createElement("div");
   popup.innerHTML = options.template;
   document.body.appendChild(popup)

   //抽取data-tooltip-text、data-tooltip-attr属性，组成一个配置对象
   var widgetData = avalon.getWidgetData(elem, widget)
*/
