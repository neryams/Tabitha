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
            // Dragging off of workspace
            else 
                element.draggable({
                    revert: true,
                    revertDuration: 100
                });
            element.data('dragId', toolId);
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
                        } else {
                        // Existing card type being dragged
                            var selectedCardType = drag.scope().currentGame.cardTypes[+dragid];
                        }

                        if(isNaN(dropid)) {
                        // Dropped onto the background
                            selectedCardType.setCardParent();
                        } else {
                            selectedCardType.setCardParent(+dropid);
                        }

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