var options = {};
var shape = null;

drawSvg = function(file) {

    if (typeof(fileObject) !== 'undefined') {
      scene.remove(fileObject);
    };

    if ( typeof(inflateGrp) != 'undefined' ) {
      scene.remove(inflateGrp);
    }

    if ( typeof(object) != 'undefined' ) {
      scene.remove(object);
    }
    // see if file is valid
    if (file.length == 0) return;

    var error = this.extractSvgPathsFromSVGFile(file);
    if (error) {
        // do nothing
        console.warn("there was an error with svg file");
    } else {
        fileObject = this.svgParentGroup;
        //this.sceneReAddMySceneGroup();
        fileObject.translateX((laserxmax / 2) * -1);
        fileObject.translateY((laserymax / 2) * -1);
        fileObject.name = 'fileObject';
        scene.add(fileObject)

        console.log('sceneGroup', this.mySceneGroup);

        // Empty File Prep table
        $("#layersbody").empty();

        viewExtents(fileObject)
        $('#layers > tbody:last-child').append('<tr><td>SVG</td><td>  <div class="input-group" style="margin-bottom:5px; width: 100%;"><input class="form-control" name=sp0 id=sp0 value=3200><span class="input-group-addon"  style="width: 30px;">mm/m</span><input class="form-control" name=pwr0 id=pwr0 value=100><span class="input-group-addon"  style="width: 30px;">%</span></div></td></tr>');

        //scene.add(  this.mySceneGroup)
        // get the new 3d viewer object centered on camera
        //chilipeppr.publish('/com-chilipeppr-widget-3dviewer/viewextents' );

        // make sure camera change triggers
        //setTimeout(this.onCameraChange.bind(this), 50);
        //this.onCameraChange(); //.bind(this);

        //this.generateGcode();
    }
};
extractSvgPathsFromSVGFile = function(file) {

    var fragment = Snap.parse(file);
    console.log("fragment:", fragment);

    // make sure we get 1 group. if not there's an error
    var g = fragment.select("g");
    console.log("g:", g);
    if (g == null) {

        // before we give up if there's not one group, check
        // if there are just paths inlined
        var pathSet = fragment.selectAll("path");
        if (pathSet == null) {

            $('#' + this.id + " .error-parse").removeClass("hidden");
            return true;

        } else {
            console.log("no groups, but we have some paths so proceed to code below.");
        }

    }
    $('#' + this.id + " .error-parse").addClass("hidden");

    var groups = fragment.selectAll("g");
    console.log("groups:", groups);

    if (groups.length > 1) {
        console.warn("too many groups in svg. need a flattened svg file.");
        $('#' + this.id + " .error-flattened").removeClass("hidden");
        return true;
    }
    $('#' + this.id + " .error-flattened").addClass("hidden");

    var svgGroup = new THREE.Group();
    svgGroup.name = "svgpath";

    var that = this;

    var opts = that.options;
    console.log("opts:", opts);

    var pathSet = fragment.selectAll("path");

    pathSet.forEach( function(path, i) {

        //if (i > 4) return;

        // handle transforms
        //var path = p1.transform(path.matrix);

        console.log("working on path:", path);
        console.log("len:", path.getTotalLength());
        // console.log("path.parent:", path.parent());

        // if the parent path is a clipPath, then toss it
        if (path.parent().type.match(/clippath/i)) {
            console.warn("found a clippath. skipping. path:", path);
            return;
        }

        // use Snap.svg to translate path to a global set of coordinates
        // so the xy values we get are in global values, not local
        console.log("path.transform:", path.transform());
        path = path.transform(path.transform().global);
        // see if there is a parent transform
        if (path.parent()) {
            console.log("there is a parent. see if transform. path.parent().transform()", path.parent().transform());
            //path = path.transform(path.parent().transform().global);
        }
        //path = path.parent().path();
        //console.log("svg path:", path, "len:", path.getTotalLength());

        /* This was an area where we used snap.svg to render using
        spaced points, but it did not create good resolution. So
        using alternate approach that is more direct. */
        /*
        var len = path.getTotalLength();
        var lenPerPt = len / that.options.pointsperpath;
        console.log("len:", len, "lenPerPt:", lenPerPt, "pointsperpath:", that.options.pointsperpath);

        var spacedPoints = new THREE.Geometry();

        for (var i = 0; i < that.options.pointsperpath; i++ ) {
            var pt = path.getPointAtLength(lenPerPt * i);
            //console.log("pt:", pt);
            spacedPoints.vertices.push(new THREE.Vector3(pt.x, pt.y, 0));
        }

        var material = new THREE.LineBasicMaterial({
            	color: 0x0000ff
            });


        var particles = new THREE.Points( spacedPoints, new THREE.PointsMaterial( { color: 0xff0000, size: 1 } ) );
    particles.position.z = 1;
    //svgGroup.add(particles);

        // solid line
	var line = new THREE.Line( spacedPoints, material );
	line.position.x = 0.5;
	//svgGroup.add( line );
        */

        var material = new THREE.LineBasicMaterial({
            	color: 0x0000ff
            });


        // use transformSVGPath
        console.log("working on path:", path);
        //debugger;
        var paths = that.transformSVGPath(path.realPath);
        // var paths = that.transformSVGPath(path.attr('d'));
        //for (var pathindex in paths) {
        for (pathindex = 0; pathindex < paths.length; pathindex++ ) {

            var shape = paths[pathindex];

            shape.autoClose = true;
            console.log("shape: Number", pathindex , "Value: ", shape);

            if (opts.cut == "dashed") {

		    // figure out how many points to generate
		    var ptCnt = shape.getLength() / (opts.dashPercent / 10);
		    //console.log("ptCnt:", ptCnt);
		    shape.autoClose = false;
		    var spacedPoints = shape.createSpacedPointsGeometry( ptCnt );
		    console.log("spacedPoints", spacedPoints);

		    // we need to generate a ton of lines
		    // rather than one ongoing line
		    var isFirst = true;
		    var mypointsGeo = new THREE.Geometry();

		    for (var iv in spacedPoints.vertices) {
		        var pt = spacedPoints.vertices[iv];
		        //console.log("pt:", pt, "isFirst:", isFirst, "mypointsGeo:", mypointsGeo);

		        if (isFirst) {
		            // first point, start the line
		            mypointsGeo = new THREE.Geometry(); // reset array to empty
		            mypointsGeo.vertices[0] = pt;
				        isFirst = false;
		        } else {
		            // is second point, finish the line
		            mypointsGeo.vertices[1] = pt;
		            var line = new THREE.Line( mypointsGeo, material );
		            svgGroup.add( line );
		            isFirst = true;
		        }
		        //console.log("working on point:", pt);
		    }
		    //charGroup.add( line );

		    var particles = new THREE.Points( spacedPoints, new THREE.PointsMaterial( { color: 0xff0000, size: opts.size / 10 } ) );
		    particles.position.z = 1;
		    //charGroup.add(particles);

		} else {
				// solid line
              var geometry = new THREE.ShapeGeometry( shape );
                var lineSvg = new THREE.Line( geometry, material );
    			svgGroup.add(lineSvg);

    			var particles = new THREE.Points( geometry, new THREE.PointsMaterial( {
    			    color: 0xff0000,
    			    size: 1,
    			    opacity: 0.5,
    			    transparent: true
    			} ) );
    		    //particles.position.z = 1;
            //svgGroup.add(particles);
}


}

});

// since svg has top left as 0,0 we need to flip
// the whole thing on the x axis to get 0,0
// on the lower left like gcode uses
svgGroup.scale.y = -1;
// svgGroup.scale.x = 0.2;
// svgGroup.scale.z = 0.2;

// shift whole thing so it sits at 0,0

var bbox = new THREE.Box3().setFromObject(svgGroup);

console.log("bbox for shift:", bbox);
svgGroup.position.x += -1 * bbox.min.x;
svgGroup.position.y += -1 * bbox.min.y;
svgxpos = bbox.min.x;
svgypos = bbox.min.y;
//textGroup.position.z = 0;

// now that we have an svg that we have flipped and shifted to a zero position
// create a parent group so we can attach some point positions for width/height
// handles for the floating textboxes and a marquee
var svgParentGroup = new THREE.Group();
svgParentGroup.name = "SvgParentGroup";
svgParentGroup.add(svgGroup);

// Add marquee bounding box
var bbox = new THREE.BoundingBoxHelper( svgParentGroup, 0xff0000 );
bbox.update();
var boxHelper = new THREE.BoxHelper( bbox );
boxHelper.position.z = 0.05;
boxHelper.material = dashMat;

var dashMat = new THREE.LineDashedMaterial( {
color: 0x666666,
dashSize: 1,
gapSize: 1,
linewidth: 2 } )
var geometry  = new THREE.Geometry().fromBufferGeometry( boxHelper.geometry );
geometry.computeLineDistances();
//var object = new THREE.LineSegments(geometry , new THREE.LineDashedMaterial( { color: 0xffaa00, dashSize: 3, gapSize: 1, linewidth: 2 } ) );
var object = new THREE.Line( geometry, dashMat );
object.position.z = 0.05;

// Bounding Box
// /svgParentGroup.add(object);
console.log("boxHelper:", boxHelper);
//boxHelper.geometry.computeLineDistances();
//svgGroup.add( boxHelper );

// create width / height textbox 3d objects so we can
// project 3d coords to 2d screen coords
console.log("bbox to figure out height/width locations:", bbox.box);

var widthPt = new THREE.Vector3(bbox.box.max.x / 2, bbox.box.min.y, 0);
var widthGeo = new THREE.Geometry();
//widthGeo.vertices.push(widthPt);
widthGeo.vertices.push(new THREE.Vector3(0,0,0));
var widthParticle = new THREE.Points( widthGeo, new THREE.PointsMaterial( { color: 0x0000ff, size: 5 } ) );
widthParticle.position.x = widthPt.x;
widthParticle.position.y = widthPt.y;
//svgParentGroup.add(widthParticle);

var heightPt = new THREE.Vector3(bbox.box.min.x, bbox.box.max.y / 2, 0);
var heightGeo = new THREE.Geometry();
heightGeo.vertices.push(new THREE.Vector3(0,0,0));
var heightParticle = new THREE.Points( heightGeo, new THREE.PointsMaterial( { color: 0x00ff00, size: 5 } ) );
heightParticle.position.x = heightPt.x;
heightParticle.position.y = heightPt.y;
//svgParentGroup.add(heightParticle);

var alignBoxPt = new THREE.Vector3(bbox.box.min.x, bbox.box.min.y, 0);
var alignBoxGeo = new THREE.Geometry();
alignBoxGeo.vertices.push(new THREE.Vector3(0,0,0));
var alignBoxParticle = new THREE.Points( alignBoxGeo, new THREE.PointsMaterial( { color: 0xffff00, size: 5 } ) );
alignBoxParticle.position.x = alignBoxPt.x;
alignBoxParticle.position.y = alignBoxPt.y;
//svgParentGroup.add(alignBoxParticle);

this.widthParticle = widthParticle;
this.heightParticle = heightParticle;
this.alignBoxParticle = alignBoxParticle;

this.svgParentGroup = svgParentGroup;
this.svgGroup = svgGroup;

// now create our floating menus
this.createFloatItems();

return false;

};

transformSVGPath = function(pathStr) {

            // cleanup
            pathStr = pathStr.replace(/[\r\n]/g, " ");
            pathStr = pathStr.replace(/\s+/g, " ");

            // clean up scientific notation
            //pathStr = pathStr.replace(/\b([+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?)\b/ig, parseFloat(RegExp.$1).toFixed(4));
            if (pathStr.match(/\b([+\-\d]+e[+\-\d]+)\b/i)) {
                console.warn("found scientific notation. $1", RegExp.$1);
                pathStr = pathStr.replace(/\b([+\-\d]+e[+\-\d]+)\b/ig, parseFloat(RegExp.$1).toFixed(4));
            }
            console.log("pathStr:", pathStr);


          const DIGIT_0 = 48, DIGIT_9 = 57, COMMA = 44, SPACE = 32, PERIOD = 46,
              MINUS = 45;

          var DEGS_TO_RADS = Math.PI / 180;

          var path = new THREE.Shape();

          // this is an array that if there is only one shape, meaning
          // the path only has one m, then we will leave this as null
          // however, if there are multiple moveto's in a path, we will
          // actually create a new path for each one and return an array
          // instead
          var paths = [];

          var idx = 1, len = pathStr.length, activeCmd,
              x = 0, y = 0, nx = 0, ny = 0, firstX = null, firstY = null,
              x1 = 0, x2 = 0, y1 = 0, y2 = 0,
              rx = 0, ry = 0, xar = 0, laf = 0, sf = 0, cx, cy;

          function eatNum() {
            var sidx, c, isFloat = false, s;
            // eat delims
            while (idx < len) {
              c = pathStr.charCodeAt(idx);
              if (c !== COMMA && c !== SPACE)
                break;
              idx++;
            }
            if (c === MINUS)
              sidx = idx++;
            else
              sidx = idx;
            // eat number
            while (idx < len) {
              c = pathStr.charCodeAt(idx);
              if (DIGIT_0 <= c && c <= DIGIT_9) {
                idx++;
                continue;
              }
              else if (c === PERIOD) {
                idx++;
                isFloat = true;
                continue;
              }

              s = pathStr.substring(sidx, idx);
              return isFloat ? parseFloat(s) : parseInt(s);
            }

            s = pathStr.substring(sidx);
            return isFloat ? parseFloat(s) : parseInt(s);
          }

          function nextIsNum() {
            var c;
            // do permanently eat any delims...
            while (idx < len) {
              c = pathStr.charCodeAt(idx);
              if (c !== COMMA && c !== SPACE)
                break;
              idx++;
            }
            c = pathStr.charCodeAt(idx);
            return (c === MINUS || (DIGIT_0 <= c && c <= DIGIT_9));
          }

          // keep track if we have already gotten an M (moveto)
          var isAlreadyHadMoveTo = false;

          var canRepeat;
          activeCmd = pathStr[0];
          while (idx <= len) {
            canRepeat = true;
            console.log("swich on activeCmd:", activeCmd);

            switch (activeCmd) {
                // moveto commands, become lineto's if repeated
              case ' ':
                  console.warn("got space as activeCmd. skipping.");
                  break;
              case 'M':
                x = eatNum();
                y = eatNum();
                if (isAlreadyHadMoveTo) {
                    console.warn("we had a moveto already. so creating new path.")
                    paths.push(path);
                    path = new THREE.Shape();
                    firstX = x;
                    firstY = y;
                }
                isAlreadyHadMoveTo = true; // track that we've had a moveto so next time in we create new path
                path.moveTo(x, y);
                activeCmd = 'L';  // do lineTo's after this moveTo
                break;
              case 'm':
                x += eatNum();
                y += eatNum();
                if (isAlreadyHadMoveTo) {
                    console.warn("we had a moveto already. so creating new path.")
                    paths.push(path);
                    path = new THREE.Shape();
                    firstX = x;
                    firstY = y;
                }
                isAlreadyHadMoveTo = true; // track that we've had a moveto so next time in we create new path
                path.moveTo(x, y);
                activeCmd = 'l'; // do lineTo's after this moveTo
                break;
              case 'Z':
              case 'z':
                canRepeat = false;
                if (x !== firstX || y !== firstY)
                  path.lineTo(firstX, firstY);
                break;
                // - lines!
              case 'L':
              case 'H':
              case 'V':
                nx = (activeCmd === 'V') ? x : eatNum();
                ny = (activeCmd === 'H') ? y : eatNum();
                path.lineTo(nx, ny);
                x = nx;
                y = ny;
                break;
              case 'l':
              case 'h':
              case 'v':
                nx = (activeCmd === 'v') ? x : (x + eatNum());
                ny = (activeCmd === 'h') ? y : (y + eatNum());
                path.lineTo(nx, ny);
                x = nx;
                y = ny;
                break;
                // - cubic bezier
              case 'C':
                x1 = eatNum(); y1 = eatNum();
              case 'S':
                if (activeCmd === 'S') {
                  x1 = 2 * x - x2; y1 = 2 * y - y2;
                }
                x2 = eatNum();
                y2 = eatNum();
                nx = eatNum();
                ny = eatNum();
                path.bezierCurveTo(x1, y1, x2, y2, nx, ny);
                x = nx; y = ny;
                break;
              case 'c':
                x1 = x + eatNum();
                y1 = y + eatNum();
              case 's':
                if (activeCmd === 's') {
                  x1 = 2 * x - x2;
                  y1 = 2 * y - y2;
                }
                x2 = x + eatNum();
                y2 = y + eatNum();
                nx = x + eatNum();
                ny = y + eatNum();
                path.bezierCurveTo(x1, y1, x2, y2, nx, ny);
                x = nx; y = ny;
                break;
                // - quadratic bezier
              case 'Q':
                x1 = eatNum(); y1 = eatNum();
              case 'T':
                if (activeCmd === 'T') {
                  x1 = 2 * x - x1;
                  y1 = 2 * y - y1;
                }
                nx = eatNum();
                ny = eatNum();
                path.quadraticCurveTo(x1, y1, nx, ny);
                x = nx;
                y = ny;
                break;
              case 'q':
                x1 = x + eatNum();
                y1 = y + eatNum();
              case 't':
                if (activeCmd === 't') {
                  x1 = 2 * x - x1;
                  y1 = 2 * y - y1;
                }
                nx = x + eatNum();
                ny = y + eatNum();
                path.quadraticCurveTo(x1, y1, nx, ny);
                x = nx; y = ny;
                break;
                // - elliptical arc
              case 'a':
                  // TODO make relative?
                  nx = x + eatNum();
                  ny = y + eatNum();
              case 'A':
                rx = eatNum();
                ry = eatNum();
                xar = eatNum() * DEGS_TO_RADS;
                laf = eatNum();
                sf = eatNum();
                if (activeCmd == 'A') nx = eatNum();
                if (activeCmd == 'A') ny = eatNum();
                if (rx !== ry) {
                  console.warn("Forcing elliptical arc to be a circular one :(",
                               rx, ry);
                }
                // SVG implementation notes does all the math for us! woo!
                // http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
                // step1, using x1 as x1'
                x1 = Math.cos(xar) * (x - nx) / 2 + Math.sin(xar) * (y - ny) / 2;
                y1 = -Math.sin(xar) * (x - nx) / 2 + Math.cos(xar) * (y - ny) / 2;
                // step 2, using x2 as cx'
                var norm = Math.sqrt(
                  (rx*rx * ry*ry - rx*rx * y1*y1 - ry*ry * x1*x1) /
                  (rx*rx * y1*y1 + ry*ry * x1*x1));
                if (laf === sf)
                  norm = -norm;
                x2 = norm * rx * y1 / ry;
                y2 = norm * -ry * x1 / rx;
                // step 3
                cx = Math.cos(xar) * x2 - Math.sin(xar) * y2 + (x + nx) / 2;
                cy = Math.sin(xar) * x2 + Math.cos(xar) * y2 + (y + ny) / 2;

                var u = new THREE.Vector2(1, 0),
                    v = new THREE.Vector2((x1 - x2) / rx,
                                          (y1 - y2) / ry);
                var startAng = Math.acos(u.dot(v) / u.length() / v.length());
                if (u.x * v.y - u.y * v.x < 0)
                  startAng = -startAng;

                // we can reuse 'v' from start angle as our 'u' for delta angle
                u.x = (-x1 - x2) / rx;
                u.y = (-y1 - y2) / ry;

                var deltaAng = Math.acos(v.dot(u) / v.length() / u.length());
                // This normalization ends up making our curves fail to triangulate...
                if (v.x * u.y - v.y * u.x < 0)
                  deltaAng = -deltaAng;
                if (!sf && deltaAng > 0)
                  deltaAng -= Math.PI * 2;
                if (sf && deltaAng < 0)
                  deltaAng += Math.PI * 2;

                path.absarc(cx, cy, rx, startAng, startAng + deltaAng, sf);
                x = nx;
                y = ny;
                break;
              default:
                throw new Error("weird path command: \"" + activeCmd + "\"");
            }
            if (firstX === null) {
              firstX = x;
              firstY = y;
            }
            // just reissue the command
            if (canRepeat && nextIsNum()) {
                console.log('we are repeating');
              continue;
            }
            activeCmd = pathStr[idx++];
          }

          // see if we need to return array of paths, or just a path
          //if (paths.length > 0) {
              // we have multiple paths we are returning
              paths.push(path);
              return paths;
          //} else {
            //return path;
          //}
        };

        createFloatItems = function() {
           console.log("createFloatItems. this.obj3dmeta:", this.obj3dmeta);

           // move width/height textboxes to top of DOM
           // because their absolute positioning requires that
           if (this.isFloatItemsSetup == false) {

               // we need to attach to the controls onchange event so
               // if the user moves the 3d viewer around we re-render where
               // we place the textboxes
               this.obj3dmeta.widget.controls.addEventListener(
                   'change', this.onCameraChange.bind(this)
               );

               $('.test-info').text("did detach");
               // move them and
               // setup the onchange events
               $('#' + this.id + "-widthbox")
                   .detach().appendTo( "body" )
                   .change(this.onWidthChange.bind(this))
                   .removeClass("hidden");
               $('#' + this.id + "-heightbox")
                   .detach().appendTo( "body" )
                   .change(this.onHeightChange.bind(this))
                   .removeClass("hidden");
                   // TODO add onchange
               $('#' + this.id + "-alignbox")
                   .detach().appendTo( "body" )
                   .removeClass("hidden");
               this.isFloatItemsSetup = true;

               // if window resizes, reset the camera and textboxes
               $(window).resize(this.onCameraChange.bind(this));

               // setup aspect locked button
               $('#' + this.id + "-widthbox .btn-aspect").click(this.onAspectLockedBtnClick.bind(this));
               $('#' + this.id + "-heightbox .btn-aspect").click(this.onAspectLockedBtnClick.bind(this));

               // setup align buttons
               $('#' + this.id + "-alignbox button").click(this.onAlignButtonClicked.bind(this));

               // setup xy value changes
               $('#' + this.id + "-alignbox .input-x").on("change", this.onXYChange.bind(this));
               $('#' + this.id + "-alignbox .input-y").on("change", this.onXYChange.bind(this));

           } else {
               console.warn("divs already positioned");
               this.showFloatItems();
           }

           // setup width and height values in the textboxes
           var bbox = new THREE.Box3().setFromObject(this.svgParentGroup);
           console.log("creating textboxes. bbox:", bbox);
           bbox["width"] = bbox.max.x - bbox.min.x;
           bbox["height"] = bbox.max.y - bbox.min.y;
           this.originalBbox = bbox;
           $('#' + this.id + "-widthbox .input-widthbox").val(bbox.width.toFixed(3));
           $('#' + this.id + "-heightbox .input-heightbox").val(bbox.height.toFixed(3));
           $('#' + this.id + "-alignbox .input-x").val("0");
           $('#' + this.id + "-alignbox .input-y").val("0");

           // we now need to reposition our textboxes as if the camera was moved
           //setTimeout(this.onCameraChange.bind(this), 50);
           //this.onCameraChange(); //.bind(this);

       };

       showFloatItems = function() {
          //  $('#' + this.id + "-widthbox").removeClass("hidden");
          //  $('#' + this.id + "-heightbox").removeClass("hidden");
          //  $('#' + this.id + "-alignbox").removeClass("hidden");
       };

        getSettings = function() {
           // get text
          //  this.options["svg"] = $('#' + this.id + ' .input-svg').val();
          //  this.options["pointsperpath"] = parseInt($('#' + this.id + ' .input-pointsperpath').val());
           //
          //  this.options["holes"] = $('#' + this.id + ' .input-holes').is(":checked");
          //  this.options["cut"] = $('#' + this.id + ' input[name=com-chilipeppr-widget-svg2gcode-cut]:checked').val();
          //  this.options["dashPercent"] = $('#' + this.id + ' .input-dashPercent').val();
          //  this.options["mode"] = $('#' + this.id + ' input[name=com-chilipeppr-widget-svg2gcode-mode]:checked').val();
          //  this.options["laseron"] = $('#' + this.id + ' input[name=com-chilipeppr-widget-svg2gcode-laseron]:checked').val();
          //  this.options["lasersvalue"] = $('#' + this.id + ' .input-svalue').val();
          //  this.options["millclearanceheight"] = parseFloat($('#' + this.id + ' .input-clearance').val());
          //  this.options["milldepthcut"] = parseFloat($('#' + this.id + ' .input-depthcut').val());
          //  this.options["millfeedrateplunge"] = $('#' + this.id + ' .input-feedrateplunge').val();
          //  this.options["inflate"] = parseFloat($('#' + this.id + ' .input-inflate').val());
          //  this.options["feedrate"] = $('#' + this.id + ' .input-feedrate').val();
           //console.log("settings:", this.options);

           options["pointsperpath"] = 1;
           options["holes"] = 0;
           options["cut"] = 'solid';
           options["dashPercent"] = 20;
           options["mode"] = 'laser';
           options["laseron"] = 'M3';
           options["lasersvalue"] = 255;
           options["millclearanceheight"] = 5.00;
           options["milldepthcut"] = 3.00;
           options["millfeedrateplunge"] = 200.00;
           options["feedrate"] = 300;

           //this.saveOptionsLocalStorage();
       };
