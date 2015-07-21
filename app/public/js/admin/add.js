seajs.use(['jquery','validForm','fnDialog'],function($,validForm,dialog){
    $(function(){
        var topDialog=dialog.dialog;
        dialog.editor({width:"700",callback:function(){if($('.ckeditor').size()){CKupdate();}$("form:first").submit()}});
        validForm.form({success:function(a){if(a.status){dialog.tips({content:a.info,callback:function(){topDialog.close(true);topDialog.remove()}})}else{dialog.alert({content:a.info})}}});
    })
});