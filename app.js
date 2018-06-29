(function() {
'use strict';

angular.module('NarrowItDownApp',[])
       .controller('NarrowItDownController', NarrowItDownController)
       .service('MenuSearchService', MenuSearchService)
       .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com/menu_items.json")
       .directive('foundItems', FoundItems);

function FoundItems() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope:{
      items: '<',
      onRemove: '&',
    },
    controller: FoundItemDirectiveCtrl,
    controllerAs: 'narrow',
    bindToController: true
  };
  return ddo;
}

function FoundItemDirectiveCtrl() {
  var narrow = this;
}

NarrowItDownController.$inject=['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var narrow = this;
  narrow.searchTerm = "";
  narrow.found = function(searchTerm) {
    var promise = MenuSearchService.getMatchedMenuItems();
    promise.then(function(response) {
      narrow.fullList = response.data["menu_items"];
      narrow.items = [];
      narrow.fullList.forEach(element => {
        if(element["description"].includes(searchTerm)) {
          narrow.items.push(element);
        }
      });
      console.log(narrow.items);
    })
    .catch(function(error) {
      console.log(error);
    });

    narrow.removeItem = function (itemIndex) {
      narrow.items.splice(itemIndex, 1);
    };

  };
};


MenuSearchService.$inject=['$http','ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
    var service = this;
    service.getMatchedMenuItems = function() {
      return $http({
        method: "GET",
        url: ApiBasePath
      })
    };


  };
})();
