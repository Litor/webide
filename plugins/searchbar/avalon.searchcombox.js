// avalon 1.3.6
/**
 * @enName searchcombox
 * @introduce
 */
define(["avalon", "text!./avalon.searchcombox.html","avalon.getModel", "css!./avalon.searchcombox.css", "../selectionpanel/avalon.selectionpanel.js"], function (avalon, template) {
    /**
     *   templateArr = template.split('MS_OPTION_EJS');
     */
    var widget = avalon.ui.searchcombox = function (element, data, vmodels) {
        var options = data.searchcomboxOptions,
            $element = avalon(element),
            vmId = data.searchcomboxId;
        options.template = options.getTemplate(template, options);
        avalon.panels = avalon.panels || [];

        var inited, id = +(new Date());

        options["selectionpanel_"+id] = {
            datatype: options.datatype,
            localdata:options.localdata,
            url: options.url,
            pagesize:options.pagesize,
            showpages: options.showPages,
            searchable: options.searchable,
            width: options.width,
            callback: function(key, value){
                vmodel.afterSelect(key, value);
            }
        }

        var vm = avalon.mix({
            $id: vmId,
            widgetElement: element,
            panelElement: null,
            wrapElement: null,
            $skipArray: ["widgetElement", "template"],
            $uid: id,
            data:[],
            panelVisible:false,
            hidePanel : function () {
                vmodel.panelVisible = false;
            },
            showPanel: function (e) {
                var originShowStatus = vmodel.panelVisible;
                hideAllPanel();
                vmodel.panelVisible = !originShowStatus;
                if(vmodel.panelVisible){
                    if(vmodel.panelVisible){
                        avalon.vmodels["selectionpanel_"+id].getFocus();
                        avalon.vmodels["selectionpanel_"+id].reload();
                    }
                }
                e.stopPropagation();
            },
            $init: function (continueScan) {
                if (inited) return;
                inited = true;
                vmodel.template = vmodel.template.replace(/\{\{SELECTIONPANEL\}\}/g, "selectionpanel_"+id);
                element.innerHTML = vmodel.template;

                element.style.position = "relative";
                avalon.panels.push(vmodel);

                if (continueScan) {
                    continueScan();
                }
            }
        }, options);

        var vmodel = avalon.define(vm);

        avalon(document).bind("click", function () {
            vmodel.panelVisible = false;
        })

        function hideAllPanel(){
            for(var i = 0; i < avalon.panels.length; i++){
                avalon.panels[i].hidePanel();
            }
        }
        return vmodel;
    };

    widget.defaults = {
        /**
         * width: 下拉面板宽度
         * */
        width: '150',
        /**
         * label： 名称
         * */
        label:'label',

        afterSelect: function(){},
        /**
         * datatype:数据来源类型 local or server
         * */
        datatype:'local',
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
        showpages:3,
        /**
         * multi:是否支持多选
         * */
        multi: false,
        placeholder:'搜索...',
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
 */
