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
        var jsonAdd = { "id": $li.attr('id'),"block_type":$li.attr("data-block-type")};
        $li.find('ul:eq(0)').children('li').each(function() {
            if (!jsonAdd.sub_blocks) { 
                jsonAdd.sub_blocks = [];
            }
            jsonAdd.sub_blocks.push(obj.saveChildToJson($(this)));
        });

        return jsonAdd;
    },
    loadSortable: function(){
        $( "ul.sub_block" ).sortable({
            connectWith: "ul",
            handle: ".move",
            tolerance: "pointer",
            cursor: "move",
            dropOnEmpty: true,
            placeholder: "highlight",
            start: function (event, ui) {
               
            },

        });


    }
})

var obj = new Operations()
obj.loadSortable()
// sub block template for runtime append
list_tag='<li class="has_child hassub {1}"  id="{0}" data-block-type="{1}">'
sub_block = '<i class="fas fa-arrow-alt-right"></i> <span class="title">What do you want to add?</span>\
<div class="button-block">\
<button type="button" class="btn btn-gray block"><i class="fal fa-cube"></i> Block</button>\
<button type="button" class="btn btn-lightblue branch"><i class="fal fa-code-branch"></i> Branch</button>\
<button type="button" class="btn btn-lightgree embedded_data"><i class="fal fa-database"></i> Embedded Data</button>\
<button type="button" class="btn btn-lightpink randomiser"><i class="far fa-retweet"></i> Randomiser</button>\
<button type="button" class="btn btn-lightblue web_service"><i class="far fa-wifi"></i> Web Service</button>\
<button type="button" class="btn btn-lightblue group"><i class="fas fa-folder"></i> Group</button>\
<button type="button" class="btn btn-lightblue authenticator"><i class="fas fa-lock"></i> Authenticator</button>\
<button type="button" class="btn btn-error end_of_survey"><i class="fas fa-exclamation-triangle"></i> End of Survey</button>\
<button type="button" class="btn btn-lightpink reference_survey"><i class="fal fa-file-alt"></i> Reference Survey</button>\
<button type="button" class="btn btn-lightblue table_of_contents"><i class="far fa-list-alt"></i> Table of Contents</button>\
</div>\
<div class="block_options">\
<a href="#" class="addNewBlock">Add Below</a> | \
<a href="#" class="move">Move</a> |\
<a href="#" class="delete_block deleteBlock">Delete</a></div>\
<ul class="sub_block has_child ">'

// end_sub_block='</ul></li>';

randomiser_text = '<i class="fas fa-arrow-alt-right"></i>\
                  <span class="title"><i class="far fa-retweet"></i> Randomiser</span>\
                  <div class="block_description">\
                   Randomly present <button class="minus"><i class="fas fa-minus-circle"></i></button> <input type="text" class="qty" value="0"> <button class="plus"><i class="fas fa-plus-circle"></i></button> of the following elemenys <input type="checkbox" class="check"> Evenly present Elements\
                  </div>\
                  <div class="block_options">\
                    <a href="#" class="addNewBlock">Add Below</a> | \
                    <a href="#" class="move">Move</a> |\
                    <a href="#" class="delete_block deleteBlock">Delete</a></div>\
                    <ul class="sub_block has_child ">'
                  
// Add new sub clock

$(document).on("click",".addNewBlock",function(e) {
    e.preventDefault();
    ul =  $(this).closest('li').find('ul:eq(0)')
    if($(ul).next().is("span")){
        
    }else{
        $("<span class='submenu-btn'></span>").insertAfter(ul);
    }
    
    ul.removeClass('open').addClass('open')
    ul.next().addClass('active');
    child_counter = ul.children('li').length
    var parent_id = $(ul).parent().attr('id')
    var new_id = parent_id + '_B' + child_counter
    new_bl = list_tag.fixture(new_id,'OPT')+sub_block+'</ul></li>'
    ul.append(new_bl); 
    obj.loadSortable()
})

$(document).on("click",".randomiser",function(e) {
    var li = $(this).closest('li')
    var ul_content = $(li).find('ul').html()
    $(li).html(randomiser_text);
    $(li).append('</ul');
    $(li).find('ul').html(ul_content)
    $(li).addClass('RAND')
    $(li).attr('data-block-type','RAND')
    if($(li).find('ul:first').children().length>0){
        $(li).find('ul:first').removeClass('open').addClass('open')
        $(li).find('ul:first').after('<span class="submenu-btn active"></span>');
        // $(li).find('span:first').addClass('active')
    }
    
    $(li).attr('data-block-type','RAND')
    
})

$(document).on("click", ".delete_block", function(){
    $(this).closest('div').closest("li").remove();
   })
// list_tag='<li class="has_child hassub {1}"  id="{0}" data-block-type="{1}">'

// sub_block_item = '<i class="fas fa-arrow-alt-right"></i> <span class="title">What do you want to add?</span>\
//                     <div class="button-block">\
//                     <button type="button" class="btn btn-gray block"><i class="fal fa-cube"></i> Block</button>\
//                     <button type="button" class="btn btn-lightblue branch"><i class="fal fa-code-branch"></i> Branch</button>\
//                     <button type="button" class="btn btn-lightgree embedded_data"><i class="fal fa-database"></i> Embedded Data</button>\
//                     <button type="button" class="btn btn-lightpink randomiser"><i class="far fa-retweet"></i> Randomiser</button>\
//                     <button type="button" class="btn btn-lightblue web_service"><i class="far fa-wifi"></i> Web Service</button>\
//                     <button type="button" class="btn btn-lightblue group"><i class="fas fa-folder"></i> Group</button>\
//                     <button type="button" class="btn btn-lightblue authenticator"><i class="fas fa-lock"></i> Authenticator</button>\
//                     <button type="button" class="btn btn-error end_of_survey"><i class="fas fa-exclamation-triangle"></i> End of Survey</button>\
//                     <button type="button" class="btn btn-lightpink reference_survey"><i class="fal fa-file-alt"></i> Reference Survey</button>\
//                     <button type="button" class="btn btn-lightblue table_of_contents"><i class="far fa-list-alt"></i> Table of Contents</button>\
//                     </div>\
//                     <div class="block_options">\
//                     <a href="#" class="addNewBlock">Add Below</a> | \
//                     <a href="#" class="move">Move</a> |\
//                     <a href="#" class="delete_block deleteBlock">Delete</a></div><ul class="sub_block has_child ">';

// randomiser_block = '<i class="fas fa-arrow-alt-right"></i>\
//                       <span class="title"><i class="far fa-retweet"></i> Randomiser</span>\
//                       <div class="block_description">\
//                        Randomly present <button class="minus"><i class="fas fa-minus-circle"></i></button> <input type="text" class="qty" value="0"> <button class="plus"><i class="fas fa-plus-circle"></i></button> of the following elemenys <input type="checkbox" class="check"> Evenly present Elements\
//                       </div>\
//                       <div class="block_options">\
//                         <a href="#" class="addNewBlock">Add Below</a> | \
//                         <a href="#" class="move">Move</a> |\
//                         <a href="#" class="delete_block deleteBlock">Delete</a></div>\
//                         <ul class="sub_block has_child ">'

var success = false;
$.when(
$.ajax('/load-blocks',   // request url
    {
        success: function (data, status, xhr) {// success callback function
           $('.main_block').children('li').each(function(){
                var block= $(this)
                var ul = block.find(".sub_block")
                var main_block_id= block.attr("id")
                var objects = data.data 
                var string = []
                $.each(objects, function (index, element) {
                     var id = objects[index].id
                     if(main_block_id == id){
                       if(objects[index].sub_blocks.length != 0){

                          string = child_lists(objects[index].sub_blocks,string,objects[index].id, main_block_id)
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


 function child_lists(objects, string, current_id, main_block_id){
         
         for(var i = 0 ; i < objects.length; i++){

            string.push(list_tag.fixture(objects[i].id, objects[i].block_type))
               // string.push(sub_block)
               if(objects[i].block_type=="RAND"){
                    
                    string.push(randomiser_text)

                }else{
                    
                    string.push(sub_block)
                }

            if(objects[i].sub_blocks != undefined){
               child_lists(objects[i].sub_blocks, string, objects[i].id,main_block_id);
            }else{
               string.push('</ul></li>')
            }
         }
         
         if(main_block_id != current_id){
            string.push('</ul><span class="submenu-btn"></span>')
            string.push('</li>')
         }

         return string
    }


