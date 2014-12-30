// avalon 1.3.6
/**
 * @enName layoutcell
 * @introduce
 */
define(["avalon", "text!./avalon.layoutcell.html", "css!./avalon.layoutcell.css", "../menupanel/avalon.menupanel.js"], function(avalon, template) {
    /**
    *   templateArr = template.split('MS_OPTION_EJS');
    */
    var widget = avalon.ui.layoutcell = function (element, data, vmodels) {
        var options = data.layoutcellOptions,
        $element = avalon(element),
        vmId = data.layoutcellId;
        options.template = options.getTemplate(template, options);

        var elementClass = "col-md-{{COLSPAN}} col-sm-{{COLSPAN}} col-xs-{{COLSPAN}} col-lg-{{COLSPAN}}";
        var elementStyle = "height:{{HEIGHT}}";
        var inited, id = +(new Date());

        var vm = avalon.mix({
            $id : vmId,
            widgetElement : element,
            $skipArray : ["widgetElement", "template"],
            $uid : id,
            $init :  function (continueScan) {
                if (inited) return;
                inited = true;
                vmodel.template = vmodel.template.replace(/\{\{CELL_WIDGET\}\}/g, vmodel.widgetName);
                element.setAttribute("class", elementClass.replace(/\{\{COLSPAN\}\}/g, vmodel.colSpan));
                element.setAttribute("style", elementStyle.replace(/\{\{HEIGHT\}\}/g, vmodel.height+"px"));
                element.innerHTML = vmodel.template;


                if (continueScan) {
                    continueScan();
                }
            }
        }, options);

        var vmodel = avalon.define(vm);

        vmodel.$watch("colSpan", function () {
            element.setAttribute("class", elementClass.replace(/\{\{COLSPAN\}\}/g, vmodel.colSpan));
        })

        vmodel.$watch("height", function () {
            element.setAttribute("style", elementStyle.replace(/\{\{HEIGHT\}\}/g, vmodel.height+"px"));
        })
        return vmodel;
    };

    widget.defaults = {
        /**
         * height: 单元格高度
         * */
        height:30,
        /**
         *colSpan: 单元格占列数
         * */
        colSpan:1,
        /**
         * dataType: html or widget
         * */
        dataType:'widget',
        /**
         * html: 单元格html内容
         * */
        html: '<span style="color:red">china</span>',
        /**
         *widgetName: widget名称
         * */
        widgetName:'menupanel',
         /**
         * widget: 待渲染widget
         * */
        widget:{},
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
