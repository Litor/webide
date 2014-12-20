/**
 * Created by jun on 2014/12/19.
 */

var formBuilder = function () {

    var designAreaId = null;

    var propertySetterAreaId = null;

    var components = [{widgetName:'combox'}];

    /**
     * {pageName:'main', properties:[{name:'pageTitle', value:'first page'}], type:'searchGrid', widgets:[//type:searchGrid, form
     *      {widgetName:'widget', nickName:'widget1', parentWidget:'parent1', parentProperty:'property1', tableX:'1', tableY:'1', properties:[
     *          {name:'name1', type:'array', value:''}// type:string, int,
     *      ]}
     * ]}
     *
     *
     * **/
    var currentFormComponents = [{widgetName:'combox', nickName:'combox1', parentWidget:"parent1", parentProperty:"property1", properties:[{name:'items', type:'array', value:[]}]}];

    var layoutType = "";
}