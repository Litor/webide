// avalon 1.3.6
/**
 * @enName singlepageapp
 * @introduce
 */
define(["avalon", "text!./avalon.singlepageapp.html", "css!./avalon.singlepageapp.css", "./mmRequest"], function(avalon, template) {
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

        var vm = avalon.mix({
            $id : vmId,
            widgetElement : element,
            $skipArray : ["widgetElement", "template"],
            $uid : id,
            changeMainMenu: function (menuIndex) {
                vmodel.currentMenuIndex = menuIndex;
                vmodel.modules = findModules(menuIndex);
                setDefaultModule();
            },
            selectModule: function (module) {
                var menu = getCurrentMenu();
                vmodel.currentPath = menu.title + "->" + module.title;
                vmodel.currentModuleUrl = module.url;
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
                async)).done(function(res) {
                if(typeof(res) === 'object'){
                    menu = res;
                    var index = 1;
                    for(var i = 0;i < res.length; i++){
                        res[i].index = index++;
                        var t = {title:res[i].title, active:res[i].active, index:res[i].index};
                        vmodel.topmenu.push(t);
                        vmodel.modules = findModules(vmodel.currentMenuIndex);
                        setDefaultModule();
                    }
                }else{
                    throw Error("菜单读取错误"+res);
                }

            });
        }

        function setDefaultModule(){
            var currentMenu = getCurrentMenu();
            var modules = findModules(currentMenu.index);
            if(modules.length>0){
                if(!modules[0].subModules){
                    vmodel.currentModuleUrl = modules[0].url;
                    vmodel.currentPath = currentMenu.title + "->" + modules[0].title;
                }else{
                    vmodel.currentModuleUrl = modules[0].subModules[0].url;
                    vmodel.currentPath = currentMenu.title + "->" + modules[0].subModules[0].title;
                }
            }
        }

        function findModules(menuIndex){
            for(var i = 0; i < menu.length; i++){
                if(menu[i].index == menuIndex){
                    return menu[i].modules;
                }
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
        window.onload = function () {
            resetWindowSize();
        }
        return vmodel;
    };

    widget.defaults = {
        menu:'menu.json',
        loginOutUrl:'loginout.html',
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
