// avalon 1.3.6
/**
 * @enName menubar
 * @introduce
 */
define(["avalon", "text!./avalon.menubar.html", "css!./avalon.menubar.css", "menupanel/avalon.menupanel"], function(avalon, template) {
    /**
    *   templateArr = template.split('MS_OPTION_EJS');
    */
    var widget = avalon.ui.menubar = function (element, data, vmodels) {
        var options = data.menubarOptions,
        $element = avalon(element),
        vmId = data.menubarId;
        options.template = options.getTemplate(template, options);

        var inited, id = +(new Date());

        var vm = avalon.mix({
            $id : vmId,
            widgetElement : element,
            $skipArray : ["widgetElement", "template"],
            $uid : id,
            $filemenu:{
                items:[{value:'New File', click:avalon.noop()}, {value:'Save', click:avalon.noop()}, {divider:true},{value:'Refresh', click:avalon.noop()},{divider:true},{value:'Close', click:avalon.noop()}],
                width:200
            },
            $viewmenu :{
                items:[{value:'test',click:avalon.noop()}, {value:'test2',click:avalon.noop()}],
                width:200
            },
            $usermenu:{
                items:[{value:'Detail',click:avalon.noop()}, {value:'Logout',click:avalon.noop()}],
                width:100,
                align:'right'
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

        return vmodel;
    };

    widget.defaults = {
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
