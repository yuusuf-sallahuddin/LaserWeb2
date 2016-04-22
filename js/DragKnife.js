onToolChange = function(evt) {
    var tool = $('#ToolChoose').val();
    if(tool == 'DragKnife')
    {
        
        $('#DragKnifeFeatureOffset').removeClass('hidden')
        $('#DragKnifeFeatureThreshold').removeClass('hidden');
        fileParentGroup.updateMatrix();
        var grp = fileObject;
        var clipperPaths = [];
        var clipperPathsFinal = [];
        var angleThreshold = $('#knifeAngle').val();
        var knifeOffset = parseFloat($('#knifeOffset').val());
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
        console.log(clipperPaths);
        clipperPaths.forEach(function(data){
            var lastVector = null;
            var curVector = null;
            var ArrVect = [];
            var FinalPath = [];
            console.log(data);
            if(data.length > 3){
                for (i = 0; i < data.length; i++)
                {   
                console.log('index en cours :'+i);
                //need previous point for make a vector
                if((data.length-1) == i)
                {
                    console.log("FinalPath");
                    console.log(FinalPath);
                    clipperPathsFinal.push(FinalPath);
                    //newClipperPaths = FinalPath;
                }
                else if(i > 0)
                {
                    curVector = new THREE.Vector3((data[i]['X']-data[i-1]['X']),(data[i]['Y']-data[i-1]['Y']),0);
                    if((data.length-1) > i)
                    {
                        nextVector = new THREE.Vector3((data[i+1]['X']-data[i]['X']),(data[i+1]['Y']-data[i]['Y']),0);
                    }
                    var angle = curVector.angleTo(nextVector)*180/Math.PI;
                    curVector.setLength(curVector.length()+knifeOffset);
                    FinalPath.push({X:data[i-1]['X']+curVector.x,Y:data[i-1]['Y']+curVector.y});
                    //if angle > threshold do swiwel move
                    if(angle > angleThreshold)
                    {
                        var origin_angle = curVector.angleTo(new THREE.Vector3(1,0,0));
                        var end_angle = nextVector.angleTo(new THREE.Vector3(1,0,0));
                        console.log(origin_angle);
                        console.log(end_angle);
                        
                        var curve = new THREE.EllipseCurve(
                            data[i]['X'], data[i]['Y'],             // ax, aY
                            knifeOffset*10, knifeOffset*10,            // xRadius, yRadius
                            origin_angle, end_angle, // aStartAngle, aEndAngle
                            false             // aClockwise
                        ); 
                        var points = curve.getSpacedPoints( 20 );
                        var path = new THREE.Path();
                        var geometry = path.createGeometry( points );
                        console.log(geometry);
                        for(var j = 0;j<geometry.vertices.length;j++)
                        {
                            FinalPath.push({X:geometry.vertices[j].x,Y:geometry.vertices[j].y})
                        }
                    }
                }
                else
                {
                    FinalPath.push({X:data[i]['X'],Y:data[i]['Y']});
                }
            }
            }
        });
        //var newClipperPaths = simplifyPolygons(clipperPathsFinal);
        /*if (newClipperPaths.length < 1) {
            console.error("Clipper Simplification Failed!:");
            printLog('Clipper Simplification Failed!', errorcolor)
        }
        //var inflatedPaths = getInflatePath(newClipperPaths, options.inflate);
        /*console.log("inflated");
        console.log(inflatedPaths);*/
        DragKnifeGrp = drawClipperPaths(clipperPathsFinal, 0x00ff00, 0.8, 0, 0, false, false, "DragKnifeGrp"); // (paths, color, opacity, z, zstep, isClosed, isAddDirHelper, name)
        DragKnifeGrp.name = 'DragKnifeGrp';
        console.log("dragKnife");
        console.log(DragKnifeGrp);
        fileParentGroup.updateMatrix();
        DragKnifeGrp.position.x = fileParentGroup.position.x;
        DragKnifeGrp.position.y = fileParentGroup.position.y;
        //currentWorld();
        scene.add(DragKnifeGrp);
        console.log(scene);
    }
    else
    {
        $('#DragKnifeFeatureOffset').addClass('hidden');
        $('#DragKnifeFeatureThreshold').addClass('hidden');
    }
}   
