angular.module('tabitha').provide.factory('jsPlumbService', function() {
	var defaultType = '',
	plumbTypes = {
	},
	// this is the paint style for the connecting lines..
	connectorPaintStyle = {
		lineWidth:4,
		strokeStyle:"#deea18",
		joinstyle:"round",
		outlineColor:"#eaedef",
		outlineWidth:2
	},
	// .. and this is the hover style. 
	connectorHoverStyle = {
		lineWidth:4,
		strokeStyle:"#5C96BC",
		outlineWidth:2,
		outlineColor:"white"
	},
	endpointHoverStyle = {fillStyle:"#FF0000"},
	// the definition of source endpoints (the small blue ones)
	sourceEndpoint = {
		endpoint:"Dot",
		paintStyle:{ 
			strokeStyle:"#000000",
			fillStyle:"transparent",
			fillStyle:"#D10000",
			radius:7,
			lineWidth:2 
		},				
		isSource:true,
		connector:[ "Flowchart", { stub:[40, 60], gap:10, cornerRadius:5, alwaysRespectStubs:true } ],								                
		connectorStyle:connectorPaintStyle,
		hoverPaintStyle:endpointHoverStyle,
		connectorHoverStyle:connectorHoverStyle,
        dragOptions:{},
        overlays:[
        	[ "Label", { 
            	location:[0.5, 1.5], 
            	label:"",
            	cssClass:"endpointSourceLabel" 
            } ]
        ]
	},
	// the definition of target endpoints (will appear when the user drags a connection) 
	targetEndpoint = {
		endpoint:"Dot",					
		paintStyle:{ fillStyle:"#D10000",radius:9 },
		hoverPaintStyle:endpointHoverStyle,
		maxConnections:-1,
		dropOptions:{ hoverClass:"hover", activeClass:"active" },
		isTarget:true,			
        overlays:[
        	[ "Label", { 
        		location:[0.5, -0.5], 
        		label:"Inherit From", 
        		cssClass:"endpointTargetLabel" 
        	} ]
        ]
	}

	return {
		setDefaults: function(defaultTypeSet, moduleTypes) {
			jsPlumb.importDefaults({
				Endpoint : ["Dot", { radius: 1 }],
				HoverPaintStyle : {strokeStyle:"#1e8151", lineWidth:2 },
				ConnectionOverlays : [
					[ "Arrow", { 
						location:1,
						id:"arrow",
			            length:10,
			            width:12,
			            foldback:0.8
					} ]
				],
				Connector : "Straight",
				PaintStyle : { fillStyle:"blue", lineWidth : 2, strokeStyle : "#aaa" }
			});
			jsPlumb.bind("connection", function(info) {
				console.log(info);
			});


			$.each(moduleTypes, function(id, value) {
				plumbTypes[id] = value;
			});
			defaultType = defaultTypeSet;
		},
		activate: function(selector, plumbType) {
			if(plumbType)
				var terminus = plumbTypes[plumbType];
			else
				var terminus = plumbTypes[defaultType];

			for (var i = 0; i < terminus.sourceAnchors.length; i++) {
				var sourceUUID = selector + terminus.sourceAnchors[i].placement;
				jsPlumb.addEndpoint(selector, sourceEndpoint, { anchor:terminus.sourceAnchors[i].placement, uuid:sourceUUID });						
			}
			for (var j = 0; j < terminus.targetAnchors.length; j++) {
				var targetUUID = selector + terminus.targetAnchors[j].placement;
				jsPlumb.addEndpoint(selector, targetEndpoint, { anchor:terminus.targetAnchors[j].placement, uuid:targetUUID });						
			}

			jsPlumb.draggable($('#'+selector), { grid: [20, 20] });
		},
		refresh: function() {
			jsPlumb.repaintEverything();
		}
	}
});