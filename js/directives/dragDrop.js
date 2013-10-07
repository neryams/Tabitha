angular.module('tabitha').compileProvider.directive('gbDraggable', function($parse) {
    return {
        // A = attribute, E = Element, C = Class and M = HTML Comment
        link: function(scope, element, attrs) {
            var toolId = scope.$eval(attrs.gbDraggable);
            // Dragging off of toolbar
            if(isNaN(toolId))
                element.draggable({
                    revert: 'invalid',
                    helper: "clone"
                });
            element.data('dragId', toolId);
            element.data('gbDraggable', true);
        }
    };
});
angular.module('tabitha').compileProvider.directive('gbDroppable', function($parse) {
    return {
        // A = attribute, E = Element, C = Class and M = HTML Comment
        link: function(scope, element, attrs) {
            var options = {
                tolerance: 'intersect',
                hoverClass: 'drop-hover',
                accept: function(drag) { 
                    if(angular.element(drag).data('gbDraggable')) { 
                        return true;
                    }
                },
                over: function(event, ui) {
                    $(this).parents('.ui-droppable').addClass('child-drop-hover');
                },
                out: function(event, ui) {
                    $(this).parents('.ui-droppable').removeClass('child-drop-hover');
                },
                drop: function(event, ui) {
                    var drag = angular.element(ui.draggable.context),
                        drop = angular.element(this),
                        dragid = drag.data('dragId'),
                        dropid = drop.data('dropId');

                    if(!drop.hasClass('child-drop-hover')) {
                        if(isNaN(dragid)) {
                        // New cardType being dragged
                            var selectedCardType = drop.scope().addNewCard(dragid);
                        }

                        if(isNaN(dropid)) {
                        // Dropped onto the background
                            selectedCardType.setCardParent();
                        }

                        var dropPosition = drop.offset();
                        selectedCardType.ui.position.x = Math.round((ui.offset.left - dropPosition.left)/20)*20;
                        selectedCardType.ui.position.y = Math.round((ui.offset.top - dropPosition.top)/20)*20;

                        drop.scope().$apply();
                    }
                }
            }
            element.data('dropId', scope.$eval(attrs.gbDroppable));

            element.droppable(options);
        }
    };
});
angular.module('tabitha').compileProvider.directive('gbDraggableClick', function($parse) {
    return {
        // A = attribute, E = Element, C = Class and M = HTML Comment
        link: function(scope, element, attrs) {
            element.on('click', {scope: scope, attr: attrs.gbDraggableClick}, function (event) {
                if (!$(this).is('.ui-draggable-dragging')) {
                    event.data.scope.$eval(event.data.attr);
                }
            });
        }
    }
});
angular.module('tabitha').compileProvider.directive('gbJsplumb', ['$timeout','jsPlumbService', function($timeout,jsPlumbService) {
    return {
        // A = attribute, E = Element, C = Class and M = HTML Comment
        link: function(scope, element, attrs) {
            var elemId = 'jsPlumbElement-'+scope.$eval(attrs.gbJsplumb);
            element.attr('id', elemId);

            // Redraw jsPlumb when the parents change. Timeout so that it updates the angular stuff first.
            $timeout(function() {
                jsPlumbService.activate(elemId, 'cardType');
            });
            
        }
    }
}]);