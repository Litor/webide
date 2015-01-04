// avalon 1.3.6
/**
 * @enName ajax
 * @introduce
 */
define(["avalon", "text!./avalon.ajax.html", "css!./avalon.ajax.css","../mmRequest"], function(avalon, template) {

    var count = 0;

    function getCnt(){
        return count++;
    }

    var id = null;

    var defaultMesage = "加载中..";

    var dom = null;
    Promise.prototype.olddone = Promise.prototype.done;
    Promise.prototype.done = function (onSuccess) {
        function success(){
            var htmlDom = document.getElementById("tips-"+id);
            setTimeout(function(){
                var htmlDom = document.getElementById("tips-"+id);
                //htmlDom.children[0].setAttribute("class", htmlDom.children[0].getAttribute("class").replace("slideIn", "slideOut"));
                if(htmlDom.removeNode){
                    htmlDom.removeNode(true)
                }else{
                    htmlDom.remove();
                }
            },300);
            onSuccess(arguments[0]);
        }
        return this.olddone(success);
    }

    var ajax = avalon.ajax;
    avalon.ajax = function (opts, promise, message) {
        id = getCnt();
        message = message?message:defaultMesage;
        dom = avalon.parseHTML(template.replace(/\{\{ID\}\}/g, id).replace(/\{\{MESSAGE\}\}/g, message));
        document.getElementsByTagName("body")[0].appendChild(dom);

        return ajax(opts, promise);
    }




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
