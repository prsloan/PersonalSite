angular.module('website', ['ngAnimate'])
    .controller('MainCtrl', function ($scope) { });


    angular.module('website', ['ngAnimate'])
        .controller('MainCtrl', function ($scope) {
            $scope.slides = [
                {image: 'img/test/test-1.jpg', description: 'Image 00'},
                {image: 'img/test/test-1.jpg', description: 'Image 01'},
                {image: 'img/test/test-1.jpg', description: 'Image 02'},
                {image: 'img/test/test-1.jpg', description: 'Image 03'},
                {image: 'img/test/test-1.jpg', description: 'Image 04'}
            ];
        });
