// avalon 1.3.6
/**
 * @enName input
 * @introduce
 */
define(["avalon", "text!./avalon.input.html", "css!./avalon.input.css"], function(avalon, template) {
    /**
    *   templateArr = template.split('MS_OPTION_EJS');
    */
    var widget = avalon.ui.input = function (element, data, vmodels) {
        var options = data.inputOptions,
        $element = avalon(element),
        vmId = data.inputId;
        options.template = options.getTemplate(template, options);

        //var currentFormComponents = avalon.vmodels['$formbuilder'].getCurrentFormComponents();

        function getPropertyDetail(){
            for(var i = 0; i < currentFormComponents.length; i++){
                if(currentFormComponents[i].pageName == vmodel.pageName){
                    var page =currentFormComponents[i];
                    for(var j = 0; j < page.components.length; j++){
                        var component = page.components[j];
                        if(component.componentName == vmodel.componentName){
                            for(var k = 0; k < component.property.length; k++){
                                var property = component.property[k];
                                if(property.propertyName == vmodel.propertyName){
                                    return property.detail;
                                }
                            }
                        }

                    }
                }
            }

            return false;
        }

        //options.detail = getPropertyDetail;
        options.detail = {value:'china'};

        var inited, id = +(new Date());


        var vm = avalon.mix({
            $id : vmId,
            widgetElement : element,
            $skipArray : ["widgetElement", "template"],
            $uid : id,
            changeValue: function (prop, value) {
                options.detail[prop] = value;
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
        pageName:'',
        componentName:'',
        propertyName:'',
        name:'名称',
        detail:{value:'china'},
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
