// avalon 1.3.6
/**
 * @enName searchbar
 * @introduce
 */
define(["avalon", "text!./avalon.searchbar.html", "css!./avalon.searchbar.css", "./avalon.searchcombox.js"], function(avalon, template) {
    /**
    *   templateArr = template.split('MS_OPTION_EJS');
    */
    var count = 0, order = {};

    function getCnt(){
        return count++;
    }

    function collectModelData(fields, obj){
        var data = [];
        for(var i = 0; i < fields.length; i++){
            (function(){
                var t = {};
                t.label = fields[i].getAttribute("label");
                t.type = fields[i].getAttribute("type");
                t.datatype = fields[i].getAttribute("datatype");
                t.pagesize = fields[i].getAttribute("pagesize");
                t.showpages = fields[i].getAttribute("showpages");
                t.url = fields[i].getAttribute("url");
                t.width = fields[i].getAttribute("width");
                t.removable = fields[i].getAttribute("removable");
                if(t.datatype == "local"){
                    var options = fields[i].children;
                    t.localdata = [];
                    for(var j = 0; j < options.length; j++){
                        t.localdata.push({key: options[j].getAttribute("key"), value: options[j].getAttribute("value")})
                    }
                }
                data.push(t);
            })()
        }
        return data;
    }

    var widget = avalon.ui.searchbar = function (element, data, vmodels) {
        var options = data.searchbarOptions,
        $element = avalon(element),
        vmId = data.searchbarId;
        options.template = options.getTemplate(template, options);

        var inited, id = +(new Date());

        var vm = avalon.mix({
            $id : vmId,
            widgetElement : element,
            alterWraper: null,
            selectedWraper: null,
            $skipArray : ["widgetElement", "template", "alterWraper", "selectedWraper"],
            $uid : id,
            selectedFilters:[],
            containerWidth:0,
            filters:collectModelData(element.children),
            removeSelectedFilter: function (filterLabel) {
                for(var i = 0; i < vmodel.selectedFilters.length; i++){
                    if(vmodel.selectedFilters[i].label == filterLabel){
                        vmodel.selectedFilters.splice(i, 1);
                    }
                }
            },
            $init :  function (continueScan) {
                if (inited) return;
                inited = true;
                vmodel.template = vmodel.template.replace(/\{\{MS_COMBOX_ID\}\}/g, id);
                element.innerHTML = vmodel.template;

                vmodel.alterWraper = element.children[0].children[0].children[1];
                vmodel.selectedWraper = element.children[0].children[1].children[1];

                renderAlterFilters();

                vmodel.alterLabel += "：";
                vmodel.selectedLabel += "：";

                vmodel.containerWidth = element.offsetWidth - 70;

                if (continueScan) {
                    continueScan();
                }
            }
        }, options);

        for(var i = 0;  i < vm.filters.length; i++){
            (function(){
                var filter = vm.filters[i];
                order[filter.label] =  i;
                var nickName =  "$searchfilter" + getCnt();
                vm.filters[i].nickName = nickName;
                vm[nickName] = vm.filters[i];
                vm[nickName].afterSelect = function (key, value) {
                    var selectedItem = {
                        label:filter.label,
                        key:key,
                        value:value,
                        removable:filter.removable?true:false};
                    addSelectedFilter(selectedItem);
                }
            })();

        }

        var vmodel = avalon.define(vm);

        function addSelectedFilter(selectedItem){
            var existIndex = -1;
            for(var i = 0; i < vmodel.selectedFilters.length; i++){
                if( vmodel.selectedFilters[i].label == selectedItem.label){
                    vmodel.selectedFilters.splice(i, 1);
                    break;
                }
            }

            vmodel.selectedFilters.push(selectedItem);
            orderSelectedFilter();
        }

        function orderSelectedFilter(){
            vmodel.selectedFilters.sort(function (a, b) {
               if(order[a.label] > order[b.label])
                   return 1;
                else if(order[a.label] == order[b.label])
                    return 0;
                else
                    return -1;

            });
        }
        function renderAlterFilters(){
            for(var i = 0; i < vmodel.filters.length; i++){
                var filter = vmodel.filters[i];
                var filterDom = document.createElement("div");
                var nick = filter.nickName;
                filterDom.setAttribute("ms-widget", "search"+filter.type+","+nick+","+nick);
                filterDom.setAttribute("class", "oni-searchbar-filter");
                vmodel.alterWraper.appendChild(filterDom);
            }
        }

        return vmodel;
    };

    widget.defaults = {
        alterLabel:'待选条件',
        selectedLabel:'已选条件',
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
