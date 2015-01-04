// avalon 1.3.6
/**
 * @enName combobox
 * @introduce
 */
define(["avalon", "text!./avalon.combobox.html", "css!./avalon.combobox.css","../selectionpanel/avalon.selectionpanel.js",  "./mmRequest"], function(avalon, template) {

    var undefine = void 0

    var widget = avalon.ui.combobox = function (element, data, vmodels) {
        var options = data.comboboxOptions,
        $element = avalon(element),
        vmId = data.comboboxId;
        options.template = options.getTemplate(template, options);

        var inited, id = +(new Date());

        options.panelVisible = false;

        options["selectionpanel_"+id] = {
            datatype: options.datatype,
            localdata:options.localdata,
            url: options.url,
            pagesize:options.pagesize,
            showpages: options.showPages,
            searchable: options.searchable,
            width: options.boxwidth,
            callback: function(key, value){
                vmodel.selectedKey = key;
                vmodel.selectedValue = value;
            }
        }

        var vm = avalon.mix({
            $id : vmId,
            widgetElement : element,
            $skipArray : ["widgetElement", "template"],
            $uid : id,
            items:[],
            total:0,
            currentPage:1,
            selectedKey:'',
            selectedValue:'',
            showPanel: function (e) {
              vmodel.panelVisible = !vmodel.panelVisible;
                if(vmodel.panelVisible){
                    avalon.vmodels["selectionpanel_"+id].getFocus();
                    avalon.vmodels["selectionpanel_"+id].reload();
                }
                e.stopPropagation();
            },
            $init :  function (continueScan) {
                if (inited) return;
                inited = true;
                vmodel.template = vmodel.template.replace(/\{\{SELECTIONPANEL\}\}/g, "selectionpanel_"+id);
                element.innerHTML = vmodel.template;

                if (continueScan) {
                    continueScan();
                }
            }
        }, options);

        var vmodel = avalon.define(vm);

        avalon(document).bind("click", function () {
            vmodel.panelVisible = false;
        });

        return vmodel;
    };

    widget.defaults = {
        /**
         * datatype:数据来源类型 local or server
         * */
        datatype:'server',
        /**
         * localdata:本地数据
         * 格式:{key:'', value:''}
         * */
        localdata:[{key:1, value:'安徽'}, {key:2, value:'江苏'}],
        /**
         * url: 远程数据url
         * */
        url:'./data.json',
        /**
         * pageSize: 分页大小
         * */
        pageSize:10,
        /**
         * showPages: 每页显示的页码数
         * */
        showPages:3,
        /**
         * id: combobox对应属性名称
         * */
         id:'province',
        /**
         * boxwidth: 下拉面板的宽度
         * */
        boxwidth:'100%',
        /**
         * width: 下拉框宽度
         * */
        width:'200',
        /**
         * noResult: 无结果显示时的提示信息
         * */
        noResult:'无数据...',
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
