// avalon 1.3.6
/**
 * @enName singlepageapp
 * @introduce
 */
define(["avalon", "text!./avalon.singlepageapp.html", "css!./avalon.singlepageapp.css", "../ajax/avalon.ajax.js", "../mmRouter.js"], function(avalon, template) {
    /**
    *   templateArr = template.split('MS_OPTION_EJS');
    */
    var undefine = void 0

    var widget = avalon.ui.singlepageapp = function (element, data, vmodels) {
        var options = data.singlepageappOptions,
        $element = avalon(element),
        vmId = data.singlepageappId;
        options.template = options.getTemplate(template, options);
        var menu = [];

        var async = {
            enable: false,
            url: "",
            contentType: "application/x-www-form-urlencoded",
            dataType: "json",
            autoParam: [],
            dataFilter: undefine,
            otherParam: {},
            type: "post"
        }

        var inited, id = +(new Date());

        options.topmenu = [];
        options.modules = [];
        options.currentMenuIndex = 1;
        options.currentModuleUrl = "";
        options.currentPath = "";
        options.contentWidth = 0;
        options.contentHeight = 0;
        options.leftHeight = 0;
        options.currentModuleId = -1;
        options.currPath = 0;

        var vm = avalon.mix({
            $id : vmId,
            widgetElement : element,
            $skipArray : ["widgetElement", "template"],
            $uid : id,
            changeMainMenu: function (menuIndex) {
                vmodel.currentMenuIndex = menuIndex;
                vmodel.currentModuleId = -1;
                setDefaultModule();
            },
            selectModule: function (module) {
                var menu = getCurrentMenu();
                menu.lastModuleId = module.id;
                vmodel.currentPath = menu.title + "->" + module.title;
                vmodel.currentModuleUrl = module.url;
                vmodel.currentModuleId = module.id;
            },
            $init :  function (continueScan) {
                if (inited) return;
                inited = true;
                vmodel.template = vmodel.template.replace(/\{\{MS_COMBOX_ID\}\}/g, id);
                element.innerHTML = vmodel.template;

                configMenu();

                if (continueScan) {
                    continueScan();
                }
                resetWindowSize();
            }
        }, options);

        var vmodel = avalon.define(vm);

        function getCurrentMenu(){
            for(var i = 0;i < menu.length; i++){
                if(menu[i].index == vmodel.currentMenuIndex){
                    return menu[i];
                }
            }
        }

        function configMenu(){
            async.url = options.menu;
            avalon.ajax(avalon.mix({},
                async),null,"加载菜单..").done(function(res) {
                if(typeof(res) === 'object'){
                    if(res.error){
                        throw new Error("菜单读取错误"+res.error);
                        return;
                    }
                    var index = 1
                    var result = res.result;
                    menu = initMenu(result, 1);
                    avalon.history.start({
                        basepath: "/"
                    })
                    for(var i = 0;i <result.length; i++){
                        result[i].index = index++;
                        var t = {title:result[i].title, active:result[i].active, index:result[i].index, id:result[i].id};
                        vmodel.topmenu.push(t);
                    }
                    var currentPath = avalon.router.getLastPath();
                    if(currentPath != "/"){
                        var t = getModuleById(menu, currentPath, 1);
                        vmodel.currentMenuIndex = t.menu.index;
                        vmodel.currentModuleId = t.module.id;
                    }
                    setDefaultModule();
                }else{
                    throw new Error("菜单读取错误"+res);
                }

            });
        }

        function callback() {
            vmodel.currPath = this.path
        }

        function initMenu(menu, deep){
            for(var i = 0; i < menu.length; i++){
                if(!menu[i].modules || menu[i].modules.length == 0){
                    menu[i].noSubModules = true;
                    if(menu[i].url)
                        avalon.router.get(menu[i].url, callback)
                }else{
                    initMenu(menu[i].modules, deep+1);
                }
                if(deep == 1)
                    menu[i].lastModuleId = -1;
            }
            return menu;
        }

        function setDefaultModule(){
            var currentMenu = getCurrentMenu();
            var currentModuleId = currentMenu.lastModuleId==-1?firstModuleId(currentMenu.modules):currentMenu.lastModuleId;
            currentModuleId = vmodel.currentModuleId == -1?currentModuleId:vmodel.currentModuleId;
            var currentModule = getModuleById(currentMenu.modules, currentModuleId, 1).module;
            vmodel.currentModuleUrl = currentModule.url;
            vmodel.currentModuleId = currentModule.id;
            vmodel.modules = currentMenu.modules;
            vmodel.currentPath = currentMenu.title + "->" + currentModule.title;

        }

        function firstModuleId(modules){
            var firstModuleId = null;
            if(modules.length>0){
                if(!modules[0].modules || modules[0].modules.length == 0){
                    firstModuleId = modules[0].id;
                }else{
                    firstModuleId = modules[0].modules[0].id;
                }
            }
            return firstModuleId;
        }

        function getModuleById(modules, moduleId, deep){
            var module = null;
            for(var i = 0; i < modules.length; i++){
                if(modules[i].modules && modules[i].modules.length > 0){
                    module = getModuleById(modules[i].modules, moduleId, deep+1);
                }else{
                    if(modules[i].id == moduleId){
                        module = modules[i];
                    }
                }
                if(module){
                    break;
                }
            }
            if(deep == 1){
                return {menu: modules[i], module:module};
            }else{
                return module;
            }

        }

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

        window.onresize = function () {
            resetWindowSize();
        }

        return vmodel;
    };

    widget.defaults = {
        menu:'menu.json',
        loginouturl:'l oginout.html',
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
