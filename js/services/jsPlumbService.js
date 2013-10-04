angular.module('tabitha').provide.factory('jsPlumbService', function() {
	return {
		create: function() {
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
		},
		redrawRelationships: function() {
			jsPlumb.deleteEveryEndpoint();
			var elements = $(".jsPlumbElement");
			$(".jsPlumbElement").each(function() {
				var classes = $(this).attr('class').split(" "),
					link = false;

				for (var j = 0; j < classes.length; j++) {
					if(classes[j].substring(0,11) == 'jsPlumbLink')
						link = classes[j].substring(12);
				}
				if(link !== false) {
					jsPlumb.connect({
						source: 'jsPlumbElement-'+link,  // just pass in the current node in the selector for source 
						target: $(this).attr('id'),
						// here we supply a different anchor for source and for target, and we get the element's "data-shape"
						// attribute to tell us what shape we should use, as well as, optionally, a rotation value.
						anchors:[
							[ "Perimeter", { shape: 'Rectangle' }],
							[ "Perimeter", { shape: 'Rectangle' }]
						]
					});						
				}

			});
		}
	}
});