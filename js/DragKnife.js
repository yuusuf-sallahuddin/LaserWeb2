onToolChange = function(evt) {
    var tool = $('#ToolChoose').val();
    if(tool == 'DragKnife')
    {
        
        $('#DragKnifeFeatureOffset').removeClass('hidden')
        $('#DragKnifeFeatureThreshold').removeClass('hidden');
        fileParentGroup.updateMatrix();
        var grp = fileObject;
        var clipperPaths = [];
        var angleThreshold = $('#knifeAngle').val();
        var knifeOffset = $('#knifeAngle').val();
        console.log('prepare drag knife path');
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
        clipperPaths.forEach(function(data){
            var lastVector = null;
            var curVector = null;
            var ArrVect = [];
            console.log(data);
            for (i = 0; i < data.length; i++)
            {   
                //need previous point for make a vector
                if(i > 0)
                {
                    if(curVector == null)
                    {
                        curVector = new THREE.Vector3((data[i]['X']-data[i-1]['X']),(data[i]['Y']-data[i-1]['Y']),0);
                    }
                    else
                    {
                        lastVector = curVector;
                        curVector = new THREE.Vector3((data[i]['X']-data[i-1]['X']),(data[i]['Y']-data[i-1]['Y']),0);
                    }
                    ArrVect.push(curVector);
                    if(ArrVect.length > 1)
                    {
                        var angle = ArrVect[ArrVect.length-1].angleTo(ArrVect[ArrVect.length-2])*180/Math.PI
                        console.log('Angle : ' + angle);
                        if(angle >= angleThreshold)
                        {
                           var toeditVect = ArrVect[ArrVect.length-2];
                        }
                    }
                }
            }
            
        });
    }
    else
    {
        $('#DragKnifeFeatureOffset').addClass('hidden');
        $('#DragKnifeFeatureThreshold').addClass('hidden');
    }
}   
