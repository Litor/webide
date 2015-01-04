// avalon 1.3.6
/**
 * @enName contextmenu
 * @introduce
 */
define(["avalon", "text!./avalon.contextmenu.html", "css!./avalon.contextmenu.css"], function (avalon, template) {

    var widget = avalon.ui.contextmenu = function (element, data, vmodels) {
        var options = data.contextmenuOptions,
            $element = avalon(element),
            vmId = data.contextmenuId,
            popup;
        options.template = options.getTemplate(template, options);
        var inited, id = +(new Date());
        options.id = avalon(element).data("id");
        options.params = avalon(element).data("params");

        var vmodel = avalon.define({
            $id: vmId,
            $skipArray : ["id", "params", "widgetElement", "template"],
            $uid : id,
            menuData :  options.menu,
            showMenu : false,
            width : options.width,
            options :options,
            hidePanel : function (e) {
                vmodel.showMenu = false;
            },
            $remove: function () {

            },
            $init :  function (continueScan) {
                var _vmodels = [vmodel].concat(vmodels)
                if (inited) return;
                inited = true;

                if (continueScan) {
                    continueScan();
                }
            }
            });

        avalon.mix(vmodel, options);

        avalon(element).bind("mousedown", function (e) {
            if (e.button != 2) return;
            var _vmodels = [vmodel].concat(vmodels);
            popup = popup || document.createElement("div");
            popup.innerHTML = options.template;
            document.body.appendChild(popup)
            avalon(popup).css({
                top: e.pageY + 3,
                left: e.pageX + 3,
                position: "absolute"
            });
            hideAllPanel();
            vmodel.showMenu = true;

            avalon.scan(popup, _vmodels);
        });

        element.oncontextmenu = function () {
            return false;
        }

        avalon.bind(document, "click", function () {
            vmodel.showMenu = false;
        });

        function hideAllPanel(){
            for(var i = 0; i < avalon.panels.length; i++){
                avalon.panels[i].hidePanel();
            }
        }

        avalon.panels = avalon.panels || [];
        avalon.panels.push(vmodel);

        return vmodel;
    };

    avalon.ui.contextmenu.AddExtention = function (defaultsExt) {
        if(defaultsExt) avalon.mix(true, widget.defaults, defaultsExt);
    }

    widget.defaults = {
        menu: [{
            id: "add", value: "添加", click: function (t) {
                console.log(t)
                alert("add");
            }
        }, {
            id: "add2", value: "添加2", click: function () {
                alert("add2");
            }
        }],
        /*
        * 右键面板宽度
        * */
        width:100,
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
