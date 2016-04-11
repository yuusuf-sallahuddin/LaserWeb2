onInflateChange = function(evt) {
    console.log('triggered');
}
onToolChange = function(evt) {
    var tool = $('#ToolChoose').val();
    if(tool == 'DragKnife')
    {
        $('#DragKnifeFeatureOffset').removeClass('hidden')
        $('#DragKnifeFeatureThreshold').removeClass('hidden');
        fileParentGroup.updateMatrix();
        var grp = fileObject;
        grp.traverse(function (child){
            console.log(child);
        });
    }
    else
    {
        $('#DragKnifeFeatureOffset').addClass('hidden');
        $('#DragKnifeFeatureThreshold').addClass('hidden');
    }
}   
function calcThreshold()
{
    
}