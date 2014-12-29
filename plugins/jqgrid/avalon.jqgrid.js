// avalon 1.3.6
/**
 * @enName jqgrid
 * @introduce
 */
define(["avalon", "text!./avalon.jqgrid.html", "css!./avalon.jqgrid.css"], function(avalon, template) {

    var count = 0;
    function getCnt(){
        return count++;
    }

    if(!jQuery){
        throw Error("jQuery未找到,请通过script引入jQuery!");
        return;
    }
    if(!jQuery.jgrid){
        throw Error("jgrid未找到,请通过script引入jqgrid相关文件!");
        return;
    }

    function buildData(fields, obj){
        var data = [];
        for(var i = 0; i < fields.length; i++){
            var t = {};
            t.label = fields[i].getAttribute("label");
            t.width = fields[i].getAttribute("width");
            t.name = fields[i].getAttribute("name");
            data.push(t);
        }
        return data;
    }


    var widget = avalon.ui.jqgrid = function (element, data, vmodels) {
        var options = data.jqgridOptions,
        $element = avalon(element),
        vmId = data.jqgridId;
        options.template = options.getTemplate(template, options);

        var colModel = buildData(element.children);
        var inited, id = +(new Date());

        var vm = avalon.mix({
            $id : vmId,
            widgetElement : element,
            $skipArray : ["widgetElement", "template"],
            $uid : id,
            pagerId:"genId_"+getCnt(),
            tableId:"genId_"+getCnt(),
            $init :  function (continueScan) {
                if (inited) return;
                inited = true;
                vmodel.template = vmodel.template.replace(/\{\{MS_COMBOX_ID\}\}/g, id);
                element.innerHTML = vmodel.template;

                if (continueScan) {
                    continueScan();
                }
                jQuery(element.children[0].children[0]).jqGrid({
                    url: vmodel.url,
                    datatype: vmodel.dataType,
                    colModel: colModel,
                    viewrecords: vmodel.viewrecords, // show the current page, data rang and total records on the toolbar
                    width: vmodel.width,
                    height: vmodel.height,
                    rowNum: vmodel.rowNum,
                    loadonce: true,
                    pager: jQuery(element.children[0].children[1])
                })


            }
        }, options);

        var vmodel = avalon.define(vm);

        return vmodel;
    };

    widget.defaults = {
        /**
         *url: 数据源url
         * */
        url:'data.json',
        /**
         * dataType: 数据格式
         * */
        dataType:'json',
        /**
         * rowNum: 每页显示条数
         * */
        rowNum:'30',
        /**
         * width: grid宽度
         * */
        width:'1000',
        /**
         * height: grid高度
         * */
        height:'300',
        /**
         * viewrecords:是否显示总记录数
         * */
        viewrecords:true,
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
