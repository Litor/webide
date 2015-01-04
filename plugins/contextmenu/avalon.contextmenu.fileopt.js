define(["avalon", "./avalon.contextmenu.js", "./mmRequest"], function(avalon, rightmenu) {
    var undefine = void 0

    function createFile(options){
        alert("Create File ->id:" + options.id)
        avalon.ajax(avalon.mix({
                data: {id:options.id, params:options.params}
            },
            async)).done(function(res) {

        }).fail(function(res) {

        })
    }

    function createFolder(options){
        alert("Create Folder ->id:" + options.id)
    }

    function rename(options){
        alert("rename ->id:" + options.id)
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

    avalon.ui.contextmenu.AddExtention({
        menu:[
            {id: 'createFile', value: '新建文件', click: createFile},
            {id: 'createFolder', value: '新建文件夹', click: createFolder},
            {id: 'rename', value: '重命名', click: rename}
        ],
        path:'',
        fileExplorerId: ''
    });
});