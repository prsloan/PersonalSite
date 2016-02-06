
    angular.module('website', ['ngAnimate'])
        .controller('MainCtrl', function ($scope) {
            $scope.slides = [
                {image: 'img/test/test-1.jpg', description: 'Image 00'},
                {image: 'img/test/test-2.jpg', description: 'Image 01'},
                {image: 'img/test/test-3.jpg', description: 'Image 02'},
                {image: 'img/test/test-4.jpg', description: 'Image 03'},
                {image: 'img/test/test-5.jpg', description: 'Image 04'},
                {image: 'img/test/test-6.jpg', description: 'Image 04'},
            ];
        });
