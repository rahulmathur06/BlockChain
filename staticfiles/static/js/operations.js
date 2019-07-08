// Object Definition

String.prototype.format = String.prototype.fixture = function() {
    var s = this,
    i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

var Operations = function(selector) {
    this.selector = selector;

}

Operations.Constructor = function(param, attrs) {
    var el = new Operations(param);
    return el.init(attrs);
};


Operations.extend = function(methods) {
    Object.keys(methods).forEach(function(m) {
        Operations.prototype[m] = methods[m]
    })
}





$(".main_block > li .collapse_btn").click(function(){
    $(this).siblings('.menu_details').toggle('active');
    $(this).siblings('.submenu-btn').toggle('active');
    $(this).toggleClass('active');
    $(this).siblings('.main_block > li > .sub_block').removeClass('open');
});

$('.main_block li:has(ul)').addClass('hassub');
$(".hassub").append('<span class="submenu-btn"></span>');

$(document).on("click",".submenu-btn",function() {
    if ($(this).prev().hasClass('open')) {
        $(this).prev().removeClass('open');
    }
    else {
        $(this).prev().addClass('open');
        $(this).addClass('active');
    }
});

$(document).on("click",".submenu-btn.active",function() {
    $(this).removeClass('active');
});

var jsonCollectot = [];
Operations.extend({
    addParentBlock:  function(elem) {
        let parent_template = ''

    },
    addChildBlock: function(elem){

    },
    makeAsParentBlock: function(parent,child){

    },
    makeAsChildBlock: function(child, parent){

    },
    saveToJson: function(){
        $('.main_block').children('li').each(function(){
            if($(this).find('ul:eq(0)').children('li').length > 0){
                jsonCollectot.push(obj.saveChildToJson($(this)))
            }
        })
        $.post('/update-blocks', {'content': JSON.stringify(jsonCollectot)}, function(response, code){
            if(response.code == 200){
                alert(response.message)
                location.reload()
            }
            else{
                alert(response.errors)
            }
        })
    },
    saveChildToJson: function($li){
        var jsonAdd = { "id": $li.attr('id')};
        $li.find('ul:eq(0)').children('li').each(function() {
            if (!jsonAdd.sub_blocks) { 
                jsonAdd.sub_blocks = [];
            }
            jsonAdd.sub_blocks.push(obj.saveChildToJson($(this)));
        });
        return jsonAdd;
    },
    loadSortable: function(){
        // $( "ul.main_block" ).sortable({
        //     connectWith: "ul",
        //     dropOnEmpty: true,
        //     handle: ".move",
        //     tolerance: "pointer",
        //     cursor: "move",
        //     change: function( event, ui ) {
        //     // Any event that required to perform on bloch position change
        //     },
        // });


        $( "ul.sub_block" ).sortable({
            connectWith: "ul",
            handle: ".move",
            tolerance: "pointer",
            cursor: "move",
            dropOnEmpty: true,
            change: function( event, ui ) {
            // Any event that required to perform on bloch position change
            },

        });
    }
})

var obj = new Operations()
obj.loadSortable()
// sub block template for runtime append

sub_block = '<li class="has_child hassub" parent_id="{0}" id="{1}">\
<i class="fas fa-arrow-alt-right"></i> <span class="title">What do you want to add?</span>\
<div class="button-block">\
<button type="button" class="btn btn-gray randomiser"><i class="fal fa-cube"></i> Block</button>\
<button type="button" class="btn btn-lightblue randomiser"><i class="fal fa-code-branch"></i> Branch</button>\
<button type="button" class="btn btn-lightgree randomiser"><i class="fal fa-database"></i> Embedded Data</button>\
<button type="button" class="btn btn-lightpink randomiser"><i class="far fa-retweet"></i> Randomiser</button>\
<button type="button" class="btn btn-lightblue randomiser"><i class="far fa-wifi"></i> Web Service</button>\
<button type="button" class="btn btn-lightblue randomiser"><i class="fas fa-folder"></i> Group</button>\
<button type="button" class="btn btn-lightblue randomiser"><i class="fas fa-lock"></i> Authenticator</button>\
<button type="button" class="btn btn-error randomiser"><i class="fas fa-exclamation-triangle"></i> End of Survey</button>\
<button type="button" class="btn btn-lightpink randomiser"><i class="fal fa-file-alt"></i> Reference Survey</button>\
<button type="button" class="btn btn-lightblue randomiser"><i class="far fa-list-alt"></i> Table of Contents</button>\
</div>\
<div class="block_options">\
<a href="#" class="addNewBlock">Add Below</a> | \
<a href="#" class="move">Move</a> |\
<a href="#" class="delete_block deleteBlock">Delete</a></div>\
<ul class="sub_block has_child"></ul>\
<span class="submenu-btn"></span>\
</li>';

// Add new sub clock

$(document).on("click",".addNewBlock",function(e) {
    e.preventDefault();
    ul =  $(this).closest('li').find('ul:eq(0)')
    ul.removeClass('open').addClass('open')
    ul.next().addClass('active');
    child_counter = ul.children('li').length
    console.log(child_counter)
    var parent_id = $(ul).parent().attr('id')
    var new_id = parent_id + '_sub_block_' + child_counter
    ul.append(sub_block.fixture(parent_id, new_id)); 
    obj.loadSortable()
})
var success = false;
$.when(
$.ajax('/load-blocks',   // request url
    {
        success: function (data, status, xhr) {// success callback function

           $('.main_block').children('li').each(function(){
                var user= $(this)
                var ul = user.find(".sub_block")
                var block_code= user.attr("id")
                var objects = data.data 
                var string = []
                $.each(objects, function (index, element) {
                     var id = objects[index].id
                     if(block_code == id){
                       if(objects[index].sub_blocks.length != 0){
                          string = child_lists(objects[index].sub_blocks,string,objects[index].id, block_code)
                       } 
                    }
                     
                 })
                var list_data = ""
                $.each(string, function(key, value){
                    list_data += value 
                })
                $(ul).append(list_data);
              })
            obj.loadSortable()
            }
    })).then(function(){
        if(success) //if its success then call this initializations
              {
                obj.loadSortable()
              }
})
list_item = '<li class="has_child hassub" id="{0}">\
            <i class="fas fa-arrow-alt-right"></i> <span class="title">What do you want to add?</span>\
            <div class="button-block">\
            <button type="button" class="btn btn-gray randomiser"><i class="fal fa-cube"></i> Block</button>\
            <button type="button" class="btn btn-lightblue randomiser"><i class="fal fa-code-branch"></i> Branch</button>\
            <button type="button" class="btn btn-lightgreen randomiser"><i class="fal fa-database"></i> Embedded Data</button>\
            <button type="button" class="btn btn-lightpink randomiser"><i class="far fa-retweet"></i> Randomiser</button>\
            <button type="button" class="btn btn-lightblue randomiser"><i class="far fa-wifi"></i> Web Service</button>\
            <button type="button" class="btn btn-lightblue randomiser"><i class="fas fa-folder"></i> Group</button>\
            <button type="button" class="btn btn-lightblue randomiser"><i class="fas fa-lock"></i> Authenticator</button>\
            <button type="button" class="btn btn-error randomiser"><i class="fas fa-exclamation-triangle"></i> End of Survey</button>\
            <button type="button" class="btn btn-lightpink randomiser"><i class="fal fa-file-alt"></i> Reference Survey</button>\
            <button type="button" class="btn btn-lightblue randomiser"><i class="far fa-list-alt"></i> Table of Contents</button>\
            </div>\
            <div class="block_options">\
            <a href="#" class="addNewBlock">Add Below</a> | \
            <a href="#" class="move">Move</a> |\
            <a href="#" class="delete_block deleteBlock">Delete</a></div><ul class="sub_block has_child">';
 function child_lists(objects, string, id, block_code=null){
         
         for(var i = 0 ; i < objects.length; i++){
            if(objects[i].sub_blocks != undefined){
               string.push(list_item.fixture(objects[i].id))
               child_lists(objects[i].sub_blocks, string, objects[i].id);
            }else{
               string.push(list_item.fixture(objects[i].id))
               string.push('</ul><span class="submenu-btn"></span></li>')
            }
         }
         if(block_code != id){
            string.push('</ul><span class="submenu-btn"></span>')
            string.push('</li>')
         }
         return string
    }

$(document).on("click", ".delete_block", function(){
    $(this).closest('div').closest("li").remove();
   })
$(document).on("click", ".randomiser", function(){
    $("#randimiser_form").show()
   })
$(document).on("click", ".randomiser_close", function(){
    $("#randimiser_form").hide()
   })
// $(document).on("click", ".randomiser", function(){
//     $("#randimiser_form").modal("show")
    
//    })
