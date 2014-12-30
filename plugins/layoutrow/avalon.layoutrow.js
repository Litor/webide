// avalon 1.3.6
/**
 * @enName layoutrow
 * @introduce
 */
define(["avalon", "text!./avalon.layoutrow.html", "css!./avalon.layoutrow.css","../layoutcell/avalon.layoutcell.js"], function(avalon, template) {
    /**
    *   templateArr = template.split('MS_OPTION_EJS');
    */
    var widget = avalon.ui.layoutrow = function (element, data, vmodels) {
        var options = data.layoutrowOptions,
        $element = avalon(element),
        vmId = data.layoutrowId;
        options.template = options.getTemplate(template, options);

        var inited, id = +(new Date());

        var elementStyle = "height:{{HEIGHT}}";

        for(var i = 0; i < options.cells.length; i++){
            options["layoutcell_"+i] = options.cells[i];
        }

        var vm = avalon.mix({
            $id : vmId,
            widgetElement : element,
            $skipArray : ["widgetElement", "template"],
            $uid : id,
            $init :  function (continueScan) {
                if (inited) return;
                inited = true;
                vmodel.template = vmodel.template.replace(/\{\{MS_COMBOX_ID\}\}/g, id);
                element.innerHTML = vmodel.template;

                element.setAttribute("class", "row");
                element.setAttribute("style", elementStyle.replace(/\{\{HEIGHT\}\}/g, vmodel.height+"px"));

                for(var i = 0; i < options.cells.length; i++){
                    var div = document.createElement("div");
                    div.setAttribute("ms-widget", "layoutcell,layoutcell_"+i+",layoutcell_"+i);
                    element.appendChild(div);
                }

                if (continueScan) {
                    continueScan();
                }
            }
        }, options);

        var vmodel = avalon.define(vm);

        return vmodel;
    };

    widget.defaults = {
        /**
         * cells: layoutcell widget configer array
         * */
        cells:[{},{}],
        /**
         * height: 行高
         * */
        height:30,
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
