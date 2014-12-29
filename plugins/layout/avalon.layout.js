// avalon 1.3.6
/**
 * @enName layout
 * @introduce
 */
define(["avalon", "text!./avalon.layout.html", "css!./avalon.layout.css", "../menupanel/avalon.menupanel.js", "../combobox/avalon.combobox.js"], function(avalon, template) {
    /**
    *   templateArr = template.split('MS_OPTION_EJS');
    */
        var count = 0;
    function getCnt(){
        return count++;
    }

    var widget = avalon.ui.layout = function (element, data, vmodels) {
        var options = data.layoutOptions,
        $element = avalon(element),
        vmId = data.layoutId;
        options.template = options.getTemplate(template, options);

        var gridTemplate = {colspan:1, name:'ddf', height:30, html:''};
        var selectedColumn = {};


        function preProcess(rows){
            var index = 0;
            for(var i = 0; i < rows.length; i++){
                rows[i].index = index++;
                for(var j = 0; j < rows[i].cols.length; j++){
                    rows[i].cols[j].selected = false;
                }
            }
        }

        var inited, id = +(new Date());

        var vm = avalon.mix({
            $id : vmId,
            widgetElement : element,
            $skipArray : ["widgetElement", "template"],
            $uid : id,
            clear: function () {
                var selectedRowCount = 0;
                var colIndex = null;
                var rowIndex = 0;
                for(column in selectedColumn){
                    selectedRowCount++;
                    rowIndex = column;
                    colIndex = selectedColumn[column];
                }
                if(selectedRowCount > 1 || colIndex.length > 1){
                    alert("一次只能拆分一个单元格!");
                    return;
                }
                vmodel.rows[rowIndex]['cols'][colIndex].html = "";

                preProcess(vmodel.rows);
                selectedColumn = {};

                avalon.scan(element,vmodel)
            },
            insert: function(){
                var selectedRowCount = 0;
                var colIndex = null;
                var rowIndex = 0;
                for(column in selectedColumn){
                    selectedRowCount++;
                    rowIndex = column;
                    colIndex = selectedColumn[column];
                }
                if(selectedRowCount > 1 || colIndex.length > 1){
                    alert("一次只能拆分一个单元格!");
                    return;
                }
                vmodel.rows[rowIndex]['cols'][colIndex].html = "<div ms-widget='combobox'>chi</div>";

                preProcess(vmodel.rows);
                selectedColumn = {};

                avalon.scan(element,vmodel)
            },
            split: function () {
                var selectedRowCount = 0;
                var temp = null;
                var rowIndex = 0;
                for(column in selectedColumn){
                    selectedRowCount++;
                    rowIndex = column;
                    temp = selectedColumn[column];
                }
                if(selectedRowCount > 1 || temp.length > 1){
                    alert("一次只能拆分一个单元格!");
                    return;
                }
                var totalSpan = vmodel.rows[rowIndex]['cols'][temp].colspan;
                vmodel.rows[rowIndex]['cols'][temp].colspan = 1;
                temp++;
                for(var i = 0; i < totalSpan-1; i++){
                    vmodel.rows[rowIndex]['cols'].splice(temp, 0, avalon.mix(false, gridTemplate) );
                }

                selectedColumn = {};
                reScan();

            },
            merge: function () {

                var selectedRowCount = 0;
                for(column in selectedColumn){
                    selectedRowCount++;
                }
                if(selectedRowCount > 1){
                    alert("只有同行的单元格才能合并!");
                    return;
                }
                for(column in selectedColumn){
                    var selected = selectedColumn[column];
                    selected.sort(function (a, b) {
                            if(a>b)return 1;
                            if( a== b)return 0;
                            else return -1;
                        });
                    for(var i = 1; i < selected.length; i++){
                        if((selected[i] - selected[i-1])>1){
                            alert("只有相邻的单元格才能合并!");
                            return;
                        }
                    }
                    var totalspan = 0;
                    for(var i = 0; i < selected.length; i++){
                        totalspan += vmodel.rows[column]['cols'][selected[i]]['colspan'];
                    }
                    vmodel.rows[column]['cols'][selected[0]]['colspan'] = totalspan;
                    vmodel.rows[column]['cols'].splice(selected[0]+1, selected.length-1);

                }
                preProcess(vmodel.rows);
                selectedColumn = {};

                avalon.scan(element,vmodel)
            },
            select: function (colIndex, row) {

                var rowIndex = row.index;
                var rowIndexStr = rowIndex+"";
                if(selectedColumn[rowIndexStr]){
                    var exist = -1;
                    for(var i = 0; i < selectedColumn[rowIndexStr].length; i++){
                        if(selectedColumn[rowIndexStr][i] == colIndex){
                            exist = i;
                            break;
                        }
                    }
                    if(exist == -1){
                        selectedColumn[rowIndexStr].push(colIndex);
                        vmodel.rows[rowIndex]['cols'][colIndex]['selected'] = true;
                    }else{
                        selectedColumn[rowIndexStr].splice(exist, 1);
                        vmodel.rows[rowIndex]['cols'][colIndex]['selected'] = false;
                    }
                    if(selectedColumn[rowIndexStr].length == 0){
                        delete selectedColumn[rowIndexStr];
                    }

                }else{
                    selectedColumn[rowIndexStr] = [colIndex];
                    vmodel.rows[rowIndex]['cols'][colIndex]['selected'] = true;
                }

                avalon.scan(element,vmodel)
                //alert(colIndex)
                console.log(selectedColumn)

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

        function cloneRows(rows){

        }
        if(vmodels[0].$id == "parentVM"){
            vm.rows = vmodels[0].$model.rows;
        }
        preProcess(vm.rows);
        var vmodel = avalon.define(vm);

        function reScan(){
            delete avalon.vmodels[vmId];
            delete avalon.vmodels['parentVM'];
            vm.$id = "parentVM";
            vmodel = avalon.define(vm);
            element.setAttribute("ms-widget", "layout");
            element.innerHTML = "";
            avalon.scan(element, vmodel);
        }
        return vmodel;
    };

    widget.defaults = {
        rows:[{cols:[
            {colspan:6, name:'liuu', height:30,text:"text", widget:"combox", html:'<div ms-widget="menupanel" style="width:50px;">china</div>'},
            {colspan:5, name:'liuu', height:30, html:''}
        ], height:30},{cols:[
            {colspan:6, name:'liuu', height:30, html:''},
            {colspan:5, name:'liuu', height:30, html:''}
        ], height:30}],
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
