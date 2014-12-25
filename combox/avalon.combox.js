define(["avalon",  "text!./avalon.combox.html", "css!./avalon.combox.css","../smartgrid/avalon.smartgrid","../dialog/avalon.dialog"], function(avalon, template){

    var widget = avalon.ui.combox = function (element, data, vmodels) {

        var options = data.comboxOptions;
        options.template = options.getTemplate(template, options);

        function buildData(node, obj){
            var data = [];
            var fields = node.getElementsByTagName("field");
            for(var i = 0; i < fields.length; i++){
                var t = {};
                t.field = fields[i].getAttribute("id");
                t.width = fields[i].getAttribute("width");
                t.label = fields[i].innerHTML;
                data.push(t);
            }
            return data;
        }

        function getDatas(number) {
            var data = []
            for (var i = 0; i < number; i++) {
                data.push({
                    name: "shirly"+i,
                    age: parseInt(10 + Math.random() * 20),
                    selected: false,
                    salary: parseInt(Math.random() * 100),
                    operate : i % 5 ? 0 : 1,
                    busy : !i%3 && !i%5 ? 0 : 1
                })
            }
            return data
        }

        var vmodel = avalon.define(data.comboxId, function(vm){
            avalon.mix(vm, options);
            var inited, id = +(new Date());
            vm.showpanel = false;
            vm.value = null;
            vm.showvalue= null;
            vm.widgetElement = element
            vm.$skipArray = ["widgetElement", "template"]
            var meta = buildData(element, options);
            vm.$uid = id;
            vm.dialog = {
                onConfirm:function(){
                    var items = avalon.vmodels['smartgrid'+vmodel.$uid].getSelected();
                    if(items.length == 0){
                        alert("请选择");
                        return;
                    }
                    vmodel.showvalue = items[0].name;
                    vmodel.value = items[0].age;
                }
            }
            vm.smartgrid = {
                containerMinWidth:300,
                selectable: {
                    type: "Radio" //为表格添加选中行操作框,可以设置为"Checkbox"或者"Radio"
                },
                onRowSelect:function(data){
                },
                pager:{
                    showPages:3,
                    prevText:"<",
                    nextText:">"
                },
                columns: [
                    {
                        key : "name", //列标识
                        name : "姓名", //列名
                        sortable : true, //是否可排序
                        width: 'auto' //设置列的宽度
                    }, {
                        key : "age",
                        name : "年龄",
                        sortable : true,
                        width:  'auto',
                        type: "Number"
                    }, {
                        key : "salary",
                        name : "薪水",
                        type : "Number",
                        sortable : true,
                        width:  'auto'
                    }
                ],
                data: getDatas(10)
            }
            vm.$init = function (continueScan) {
                if(inited) return;
                inited = true;
                vmodel.template = vmodel.template.replace(/\{\{MS_COMBOX_ID\}\}/g, id)

                element.innerHTML = vmodel.template;
                if(continueScan){
                    continueScan();
                }
            }
            
            vm.$remove = function () {
                alert();
            }

            vm.click = function($event){
                $event.stopPropagation();
                vm.showpanel = !vm.showpanel;
            }

            vm._select = function ($event, id, showText) {
                $event.stopPropagation();
                vm.showvalue = showText;
                vm.value = id;
                vm.showpanel = false;
            }

            avalon.bind(document, "click", function () {
                vm.showpanel = false;
            });

            vm.show = function( id ){
                avalon.vmodels[id].toggle = true;

            }

        });

        return vmodel;
    }

    widget.defaults = {
        url:'',
        pagable:true,
        papesize:10,
        width:150,
        panelwidth:150,
        getTemplate: function(tmpl, opts, tplName) {
            return tmpl
        },
        demo:[{id:1, showText:'北京'},{id:2, showText:'上海'},{id:3, showText:'合肥'},{id:4, showText:'深圳'},{id:5, showText:'南京'},{id:6, showText:'杭州'},{id:8, showText:'武汉'},{id:9, showText:'成都'}]
    }
});