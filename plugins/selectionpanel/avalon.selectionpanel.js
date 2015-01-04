// avalon 1.3.6
/**
 * @enName selectionpanel
 * @introduce
 */
define(["avalon", "text!./avalon.selectionpanel.html", "css!./avalon.selectionpanel.css", "../ajax/avalon.ajax.js"], function(avalon, template) {
    /**
    *   templateArr = template.split('MS_OPTION_EJS');
    */
    var undefine = void 0

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

    var widget = avalon.ui.selectionpanel = function (element, data, vmodels) {
        var options = data.selectionpanelOptions,
        $element = avalon(element),
        vmId = data.selectionpanelId;
        options.template = options.getTemplate(template, options);

        var inited, id = +(new Date());

        options.currentPage = 1;
        options.pages = [];
        options.previous = false;
        options.next = false;

        var vm = avalon.mix({
            $id : vmId,
            widgetElement : element,
            $skipArray : ["widgetElement", "template"],
            $uid : id,
            items:[],
            keyword:'',
            fixPanelHidden : function (e) {
                e.stopPropagation();
            },
            getFocus: function () {
              element.children[0].children[0].children[0].focus();
            },
            changePage: function (e, page) {
                changePageAction(page);
                e.stopPropagation();
            },
            selectedItem: function (key, value) {
                vmodel.callback(key, value);
            },
            nextPage: function (e) {
                e.stopPropagation();
                if(vmodel.next) return;
                vmodel.currentPage++;
                resetItems();
            },
            prevPage: function (e) {
                e.stopPropagation();
                if(vmodel.previous) return;
                vmodel.currentPage--;
                resetItems();
            },
            reload: function () {
              resetItems();
            },
            search: function () {
                vmodel.panelVisible = true;
                if(vmodel.datatype == "server"){
                    //vmodel.keyword = "";
                    getServerData(vmodel.keyword);
                }else if(vmodel.datatype == "local"){
                    //vmodel.keyword = "";
                    reloadLocalData(vmodel.keyword);
                }
            },
            $init :  function (continueScan) {
                if (inited) return;
                inited = true;
                vmodel.template = vmodel.template.replace(/\{\{MS_COMBOX_ID\}\}/g, id);
                element.innerHTML = vmodel.template;

                resetItems();

                if (continueScan) {
                    continueScan();
                }
            }
        }, options);

        var vmodel = avalon.define(vm);

        function reloadLocalData(keyword){
            if(keyword == ""){
                vmodel.items = vmodel.localdata;
            }
            vmodel.items = [];
            for(var i = 0; i < vmodel.localdata.length; i++){
                if(vmodel.localdata[i].value.indexOf(keyword)>=0){
                    vmodel.items.push(vmodel.localdata[i]);
                }
            }
        }
        function changePageAction(page){
            vmodel.currentPage = page;
            for(var i = 0; i < vmodel.pages.length; i++){
                if(page == vmodel.pages[i].page){
                    vmodel.pages[i].active = true;
                }else{
                    vmodel.pages[i].active = false;
                }
            }

            // 切换页码刷新数据
            getServerData();

        }

        function resetItems(){
            var keyword = vmodel.keyword;
            if(vmodel.localdata && vmodel.datatype == 'local'){
                reloadLocalData(keyword);
            }else if(vmodel.datatype == 'server' && vmodel.url ){
                getServerData(keyword);
            }else{
                throw Error("数据配置错误");
            }
        }

        function getServerData(keyword){
            async.url = vmodel.url;
            var data = {
                pagesize: vmodel.pagesize,
                pageindex: vmodel.currentPage
            }
            if(keyword){
                data.keyword = keyword;
            }

            avalon.ajax(avalon.mix({
                    data: data
                },
                async)).done(function(res) {
                if(typeof(res) === 'object'){
                    vmodel.total = res.total;
                    vmodel.items = res.options;
                    vmodel.total = 61;
                    resetPages(vmodel.total);
                }else{
                    throw Error("远程数据错误"+res);
                }

            });
        }

        function resetPages(total){
            var currentPage = vmodel.currentPage;
            var totalPage = Math.ceil(total/vmodel.pagesize);
            var showPages = vmodel.showpages;
            var bottom = (Math.floor((currentPage-1)/showPages))*showPages+1;
            var top = (Math.floor((currentPage-1)/showPages))*showPages+showPages;
            top = top <= totalPage?top:totalPage;

            vmodel.pages.splice(0, vmodel.pages.length);

            for(var i = bottom; i <= top; i++){
                var page = {page:i};
                if(i == currentPage){
                    page.active = true;
                }
                vmodel.pages.push(page);
            }

            if(currentPage == 1){
                vmodel.previous = true;
            }else{
                vmodel.previous = false;
            }
            if(currentPage == totalPage){
                vmodel.next = true;
            }else{
                vmodel.next = false;
            }
        }

        return vmodel;
    };

    widget.defaults = {
        /**
         *datatype: 数据来源类型,
         * local:本地数据源，配合localdata使用
         * server: 远程数据源， 配合url使用
         * */
        datatype:'local',
        /**
         * localdata: 本地数据，当datatype为local时生效
         * */
        localdata:[{key:1, value:'安徽'}, {key:2, value:'江苏'}],
        /**
         * url: 远程数据url，当datatype为server时生效
         * */
        url:'',
        /**
         * 下拉面板的宽度
         * */
        width:'100',
        /**
         * 分页时每次最多显示的分页数
         * */
        showpages:'3',
        /**
         * 每页显示的记录条数
         * */
        pagesize:'10',
        /**
         * searchable: 是否可搜索
         * */
        searchable:true,
        /**
         * 搜索无结果时显示信息
         * */
        noResult:'无相关数据...',
        placeholder:'搜索...',
        callback:avalon.noop(),
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
