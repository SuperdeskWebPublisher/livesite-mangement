containerControls.$inject = ['api'];
function containerControls(api) {
    return {
        restrict: 'C',
        transclude: true,
        scope: {},
        templateUrl: 'app/components/containerControls/containerControls.html',
        link: function (scope, elem, attr, ctrl) {
            scope.modalActive = false;
            scope.containerID = elem[0].id.replace(/^\D+/g, '');
            scope.route = 'main';
            // used for creting/editing widget
            scope.subroute = false;

            api.get('templates/containers', scope.containerID).then(function (container) {
                scope.container = container;
                scope.container.widgets = container.widgets;
            });

            scope.getAvailableWidgets = function(){
                api.query('templates/widgets').then(function (availableWidgets) {
                    scope.availableWidgets = availableWidgets;
                });
            };



            scope.getContainerWidgets = function(){
                api.get('templates/containers', scope.containerID).then(function (container) {
                    scope.container.widgets = container.widgets;
                });
            };

            scope.setRoute = function(route, subroute){
                if(route=='linkWidget')
                    scope.getAvailableWidgets();
                scope.route = route;
                scope.subroute = false;
                if(subroute)
                    scope.subroute = subroute;
            };

            scope.toggleModal = function () {
                scope.route = 'main';
                scope.subroute = false;
                scope.modalActive = !scope.modalActive;
            };

            scope.createWidget = function (subroute) {
                scope.setRoute('createWidget', subroute);
            };

            scope.linkWidget = function (widget) {
                var header = '</api/v1/templates/widgets/' + widget.id + '; rel="widget">';
                api.link('templates/containers', scope.container.id, header).then(function (response) {
                    console.log('linking widget', response);
                    scope.getContainerWidgets();
                });
            };

            scope.unlinkWidget = function (widget) {
                var header = '</api/v1/templates/widgets/' + widget.widget.id + '; rel="widget">';
                api.unlink('templates/containers', scope.container.id, header).then(function (response) {
                    console.log('unlinking widget', response);
                    scope.getContainerWidgets();
                });
            };

            scope.save = function () {
                // todo: save data
                scope.toggleModal();
            };

            scope.cancel = function () {
                //  todo: clear form or whatever is there to clear
                scope.setRoute('main');
                scope.toggleModal();
            };

        }
    };
}

containerControlsModal.$inject = [];
function containerControlsModal() {
    return {
        templateUrl: 'app/components/containerControls/containerControlsModal.html'
    };
}

widgetsList.$inject = [];
function widgetsList() {
    return {
        templateUrl: 'app/components/containerControls/views/widgetsList.html'
    };
}

linkWidget.$inject = [];
function linkWidget() {
    return {
        templateUrl: 'app/components/containerControls/views/linkWidget.html'
    };
}



listElementWidget.$inject = [];
function listElementWidget() {
    return {
        templateUrl: 'app/components/containerControls/listElement-widget.html'
    };
}

angular.module('livesite-management.components.containerControls', [])
        .directive('swpContainerControlsModal', containerControlsModal)
        .directive('swpContainer', containerControls)
        .directive('swpContainerWidgetsList', widgetsList)
        .directive('swpContainerLinkWidget', linkWidget)
        .directive('swpListElementWidget', listElementWidget);
