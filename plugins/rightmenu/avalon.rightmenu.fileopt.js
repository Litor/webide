define(["avalon", "./avalon.rightmenu.js", "./mmRequest"], function(avalon, rightmenu) {
    var undefine = void 0

    function createFile(options){
        alert(options.path)
        avalon.ajax(avalon.mix({
                data: options.path
            },
            async)).done(function(res) {
            avalon.vmodels[options.fileExplorerId].reload();
        }).fail(function(res) {
           alert();
        })
    }

    function createFolder(options){

    }

    function rename(options){

    }

    var async = {
        enable: false,
        url: "./avalon.tree.data.php",
        contentType: "application/x-www-form-urlencoded",
        dataType: "json",
        autoParam: [],
        dataFilter: undefine,
        otherParam: {},
        type: "post"
    }

    avalon.ui.rightmenu.AddExtention({
        menu:[
            {id: 'createFile', value: '新建文件', click: createFile},
            {id: 'createFolder', value: '新建文件夹', click: createFolder},
            {id: 'rename', value: '重命名', click: rename}
        ],
        path:'',
        fileExplorerId: ''
    });
});