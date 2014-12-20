// avalon 1.3.6
/**
 * @enName propertyconfiger
 * @introduce
 */
define(["avalon", "text!./avalon.propertyconfiger.html", "css!./avalon.propertyconfiger.css"], function(avalon, template) {
    /**
    *   templateArr = template.split('MS_OPTION_EJS');
    */
    var widget = avalon.ui.propertyconfiger = function (element, data, vmodels) {
        var options = data.propertyconfigerOptions,
        $element = avalon(element),
        vmId = data.propertyconfigerId;
        options.template = options.getTemplate(template, options);

        //var currentFormComponents = avalon.vmodels['$formbuilder'].getCurrentFormComponents();

        var currentFormComponents = [{pageName:'main', properties:[{propertyName:'pageTitle', propertyValue:'first page'}], type:'searchGrid', widgets:[
            {widgetName:'widget', nickName:'widget1', parentWidget:'parent1', parentProperty:'property1', tableX:'1', tableY:'1', properties:[
                {propertyName:'name1', propertyType:'string', propertyValue:'name1'}]}
        ]}]

        var originalProperties = null;

            function getProperties(){
                for(var i = 0; i < currentFormComponents.length; i++){
                    if(currentFormComponents[i].pageName == vmodel.page){
                        if(vmodel.widget != ""){
                            for(var j = 0; j < currentFormComponents[i].widgets.length; j++){
                                if(vmodel.widget == currentFormComponents[i].widgets[j].widgetName){
                                    originalProperties = currentFormComponents[i].widgets[j].properties;
                                    pushProperties(currentFormComponents[i].widgets[j].properties);
                                }
                            }
                        }else{
                            originalProperties = currentFormComponents[i].properties;
                            pushProperties(currentFormComponents[i].properties);
                        }
                        break;
                    }
                }

            }

        function pushProperties(arr){
            vmodel.properties.length = 0;
            for(var i = 0; i < arr.length; i++){
                vmodel.properties.push(avalon.mix(true, arr[i]));
            }
        }

        var inited, id = +(new Date());

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

                if (continueScan) {
                    continueScan();
                }
            }
        }, options);

        vm.properties = [];

        var vmodel = avalon.define(vm);

        getProperties();

        vmodel.$watch("page", function () {
            getProperties();
        });

        vmodel.$watch("widget", function () {
            getProperties();
        });

        vmodel.properties.$watch("length", function () {
            alert();
        });

        return vmodel;
    };

    widget.defaults = {
        page:'main',
        widget:'widget',
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
*/
