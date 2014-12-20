// avalon 1.3.6
/**
 * @enName menupanel
 * @introduce
 */
define(["avalon", "text!./avalon.menupanel.html", "css!./avalon.menupanel.css"], function(avalon, template) {
    /**
    *   templateArr = template.split('MS_OPTION_EJS');
    */
    var widget = avalon.ui.menupanel = function (element, data, vmodels) {
        var options = data.menupanelOptions,
        $element = avalon(element),
        vmId = data.menupanelId;
        options.template = options.getTemplate(template, options);

        avalon.panels = avalon.panels || [];

        var inited, id = +(new Date());

        for(var i = 0; i < options.items.length; i++){
            if(options.items[i].subitems){
                options.items[i].left = 0;
                options.items[i].top = 0;
                options.items[i].show = false;
            }
        }
        function hideAllSubPanel(){
            for(var i = 0; i < vmodel.items.length; i++){
                if(vmodel.items[i].subitems){
                    vmodel.items[i].show = false;
                }
            }
        }

        function hideAllPanel(){
            for(var i = 0; i < avalon.panels.length; i++){
                avalon.panels[i].hidePanel();
            }
        }

        var vm = avalon.mix({
            $id : vmId,
            widgetElement : element,
            $skipArray : ["widgetElement", "template"],
            $uid : id,
            left :0,
            top:0,
            radius_topLeft:true,
            radius_topRight:true,
            radius_bottomLeft:true,
            radius_bottomRight:true,
            toggle : function (item, ele) {
                hideAllSubPanel();
                item.show = true;
                item.left = ele.offsetLeft+ele.offsetWidth;
                item.top = ele.offsetTop-6;
            },
            hidePanel : function () {
                vmodel.show = false;
            },
            $init :  function (continueScan) {
                if (inited) return;
                inited = true;
                element.appendChild(avalon.parseHTML(vmodel.template));

                if(vmodel.align == 'left'){
                    vmodel.left = element.offsetLeft;
                    vmodel.top = element.offsetHeight + element.offsetTop-2;
                }else if(vmodel.align == 'right'){
                    vmodel.left = element.offsetLeft+element.offsetWidth - vmodel.width-1;
                    vmodel.top = element.offsetHeight + element.offsetTop-2;
                }else if(vmodel.align == 'middle'){
                    vmodel.left = element.offsetLeft + (element.offsetWidth/2)-(vmodel.width/2);
                    vmodel.top = element.offsetHeight + element.offsetTop-2;
                }else if(vmodel.align == "leftside"){
                    vmodel.left = element.offsetLeft+element.offsetWidth;
                    vmodel.top = element.offsetTop-2;
                }

                if(inArray(vmodel.noRadiusCorner, "topleft")){
                    vmodel.radius_topLeft = false;
                }
                if(inArray(vmodel.noRadiusCorner, "topright")){
                    vmodel.radius_topRight = false;
                }

                if(inArray(vmodel.noRadiusCorner, "bottomleft")){
                    vmodel.radius_bottomLeft = false;
                }
                if(inArray(vmodel.noRadiusCorner, "bottomright")){
                    vmodel.radius_bottomRight = false;
                }


                if (continueScan) {
                    continueScan();
                }


                avalon(element.lastChild).bind(vmodel.event, function (e) {
                    e.stopPropagation();
                })
            }
        }, options);

        var vmodel = avalon.define(vm);

        avalon(element).bind(vmodel.event, function (e) {
            var curShow = vmodel.show;
            hideAllSubPanel();
            hideAllPanel();
            vmodel.show = !curShow;
            e.stopPropagation();
        });

        avalon(document).bind("click", function (e) {
            vmodel.show = false;
        })

        avalon.panels.push(vmodel);
        return vmodel;
    };

    function inArray(array, item){
        for(var i = 0; i < array.length; i++){
            if(array[i] == item){
                return true;
            }
        }
        return false;
    }

    widget.defaults = {
        items :[{value:'item1', click:avalon.noop()}, {value:'item2', click:avalon.noop()}, {divider:true}, {value:'item3', click:avalon.noop(), subitems:[{value:'item1', click:avalon.noop()}, {value:'item2', click:avalon.noop()}]}],
        width: 100,
        event : 'click',
        show : false,
        /**
         * align: 设置面板对其方式
         * left, right, middle,leftside, leftside
         * */
        align : 'left',
        /**
         * noRadiusCorner: 设置面板的四个拐角哪些不需要圆角
         * 'topleft', 'topright', 'bottomleft', 'bottomright'
         * */
        noRadiusCorner:['topleft',  'topright'],
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
