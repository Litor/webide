// avalon 1.3.6
/**
 * @enName ztree
 * @introduce
 */
define(["avalon", "text!./avalon.ztree.html", "css!./avalon.ztree.css", "../mmRequest", "../contextmenu/avalon.contextmenu.fileopt.js"], function(avalon, template) {
    /**
    *   templateArr = template.split('MS_OPTION_EJS');
    */
    var undefine = void 0
    var curMenu = null, zTree_Menu = null;

    var count = 0;

    function getCnt(){
        return count++;
    }

    var onExpand = function (event, treeId, treeNode) {
        onExpandAction(treeNode)
    };

    var setting = {
        view: {
            showLine: false,
            selectedMulti: false,
            dblClickExpand: false
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            beforeClick: beforeClick,
            onExpand:onExpand
        },
        edit:{
            enable: false,
            showRemoveBtn:false
        }

    }

    var onExpandAction = null;

    var async = {
        enable: false,
        url: "",
        contentType: "application/x-www-form-urlencoded",
        dataType: "json",
        autoParam: [],
        dataFilter: undefine,
        otherParam: {},
        type: "post"
    }

    var widget = avalon.ui.ztree = function (element, data, vmodels) {
        var options = data.ztreeOptions,
        $element = avalon(element),
        vmId = data.ztreeId;
        options.template = options.getTemplate(template, options);

        var inited, id = +(new Date());

        var vm = avalon.mix({
            $id : vmId,
            widgetElement : element,
            $skipArray : ["widgetElement", "template"],
            $uid : "ztree_"+getCnt(),

            $init :  function (continueScan) {
                if (inited) return;
                inited = true;
                vmodel.template = vmodel.template.replace(/\{\{MS_COMBOX_ID\}\}/g, id);
                element.innerHTML = vmodel.template;

                async.url = vmodel.url;
                avalon.ajax(avalon.mix({},
                    async)).done(function(res) {
                    if(typeof(res) === 'object'){
                        zTree_Menu = jQuery.fn.zTree.init(jQuery(element.children[0]), setting, res);
                        addNodeContextMenu(zTree_Menu.getNodes());
                        avalon.scan(element, vmodel);
                    }else{
                        throw Error("菜单读取错误"+res);
                    }

                });

                if (continueScan) {
                    continueScan();
                }
            }
        }, options);


        var vmodel = avalon.define(vm);

        function addNodeContextMenu(nodes){
            for(var i = 0; i < nodes.length; i++){
                var nodeId = nodes[i].tId + "_span";
                var nodeDOM = document.getElementById(nodeId);
                if(nodeDOM && !nodeDOM.hasAttribute("avalonctrl")){
                    nodeDOM.setAttribute("ms-widget", "contextmenu");
                    if(nodes[i].params){
                        nodeDOM.setAttribute("data-params", nodes[i].params);
                    }
                    nodeDOM.setAttribute("data-id", nodes[i].id);
                }
                if(nodes[i].isParent){
                    addNodeContextMenu(nodes[i].children);
                }
            }
        }

        onExpandAction = function (treeNode) {
            addNodeContextMenu(treeNode.children);
            avalon.scan(element, vmodel);
        }

        return vmodel;
    };

    function beforeClick(treeId, node) {
        if (node.isParent) {
            zTree_Menu.expandNode(node);
            onExpandAction(node);
        }
        return !node.isParent;
    }

    widget.defaults = {
        /**
         * url: 树节点数据url
         * */
        url:'data.json',
        /**
         * contextMenu: 右键菜单配置
         * */
        contextMenu:[],
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
