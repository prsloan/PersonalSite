
(function(){
  var app = angular.module('store',[]);

  app.controller('StoreController', function(){
    this.product = gem;
  });

  var gems = [
    {
      name : 'Dodecahedron',
      price : 2.95,
      description : 'Twelve Sides',
      canPurchase : true ,
    },

    {
      name : "Pentagonal Gem",
      price : 5.95,
      description : "It's gotta have 5 sides baby."
      canPurchase : false ,
    }





})();
