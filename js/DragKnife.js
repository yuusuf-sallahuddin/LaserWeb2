onToolChange = function(evt) {
    var tool = $('#ToolChoose').val();
    if(tool == 'DragKnife')
    {
        $('#DragKnifeFeatureOffset').removeClass('hidden')
        $('#DragKnifeFeatureThreshold').removeClass('hidden');
        fileParentGroup.updateMatrix();
        var grp = fileObject;
        grp.traverse(function (child){
            if (child.type == "Line") {
                 // let's inflate the path for this line. it may not be closed
                 // so we need to check that.
                 var clipperArr = [];
                 // Fix world Coordinates
                 for (i = 0; i < child.geometry.vertices.length; i++) {
                    var localPt = child.geometry.vertices[i];
                    var worldPt = scene.localToWorld(localPt.clone());
                    var xpos = (worldPt.x + child.position.x);
                    var ypos = (worldPt.y + child.position.y);
                    clipperArr.push({X: xpos, Y: ypos});
                }
                clipperPaths.push(clipperArr);
            }
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