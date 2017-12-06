angular.module('pdfierApp', [ 'ngRoute', 'ngAnimate', 'ngSanitize', 'ui.bootstrap'])

.constant('appConfig', {
	appPdfServicePath: 'https://pdfier-pdf-ua.appspot.com/pdf/saveaspdfua',
	sameAppPdfServicePath: 'http://pdfier.com/pdfier-api/pdf/saveaspdfua',
	localAppPdfServicePath: 'http://localhost:8080/pdf/saveaspdfua',
	mailServiceUrl: 'https://pdfier-mail.appspot.com/mail/send'
})

.config(function($routeProvider, $locationProvider, $httpProvider, $compileProvider) {
    $routeProvider.when('/', {
        templateUrl : 'home.html',
        controller : 'navController'
     }).when('/services', {
        templateUrl : 'services.html',
        controller : 'navController'
     }).when('/contact', {
	      templateUrl : 'contact.html',
	      controller : 'navController'
     }).when('/pricing', {
         templateUrl : 'pricing.html',
         controller : 'navController'
      }).when('/faq', {
          templateUrl : 'faq.html',
          controller : 'navController'
      }).when('/save-as-pdf-ua', {
          templateUrl : 'save-as-pdf-ua.html',
          controller : 'navController'
      }).when('/html-to-pdf-ua-api', {
          templateUrl : 'html-to-pdf-ua-api.html',
          controller : 'navController'
      }).when('/html-to-pdf-ua-api-examples', {
          templateUrl : 'html-to-pdf-ua-api-examples.html',
          controller : 'navController'
	  }).when('/search', {
          templateUrl : 'search.html',
          controller : 'navController'
    }).when('/amp', {
          templateUrl : 'amp/index.html',
          controller : 'navController'
      })
      .otherwise('/');
    // activate HTML5 Mode
    $locationProvider.html5Mode(true); 
    // security header
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
  })
  

.controller('navController', function($scope, $location){
	$scope.isHome = ($location.path() == '/');
})

.controller('pdfController', ['$http', '$scope', '$sce', '$uibModal', '$location', 'appConfig', function($http, $scope, $sce, $uibModal, $location, appConfig){
  var $ctrl = this;
  $ctrl.animationsEnabled = true;
  var showProcessingBar = false;
  var url = appConfig.appPdfServicePath;
  var d = $location.search().d; 
  if(d == 'pdfier'){
	  url = appConfig.sameAppPdfServicePath;
  }else if (d == 'l'){
	  url = appConfig.localAppPdfServicePath;
  }
  var modalInstance = null;
  $ctrl.open = function (size) {
	    modalInstance = $uibModal.open({
	      animation: $ctrl.animationsEnabled,
	      ariaLabelledBy: 'modal-title',
	      ariaDescribedBy: 'modal-body',
	      templateUrl: 'myModalContent.html',
	      controller: 'ModalInstanceCtrl',
	      controllerAs: '$ctrl',
	      size: size
	    });
  };
      
  $scope.url = "https://en.wikipedia.org/wiki/Main_Page"
  $scope.viewPdf = function () {
      var data = $.param({
	     // html: document.documentElement.outerHTML
    	  url : $scope.url
      });	
      var config = {
              headers : {
                  'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
              },
          	responseType :'arraybuffer'
         }
	  $http.post(url, data, config)
	  .success(function (response) {
	       var file = new Blob([response], {type: 'application/pdf'});
	       var fileURL = URL.createObjectURL(file);
	       $scope.PostDataResponse = fileURL;
	       $scope.content = $sce.trustAsResourceUrl(fileURL);
	       modalInstance.close();
	});
  };
  $scope.downloadPdf = function () {
      var data = $.param({
     	  url : $scope.url
       });	
       var config = {
               headers : {
                   'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
               },
           	responseType :'arraybuffer'
          }
 	  $http.post(url, data, config)
 	  .success(function (response, status, headers, config) {
		   var contentLenght = headers('Content-Length');
		   var file = new Blob([response], {type: 'application/pdf'});
	       var contentDispositionHeader = headers('Content-Disposition');
	       var fileName = contentDispositionHeader || 'PDFier-saveas.pdf';
	       // fileName = contentDispositionHeader.split(';')[1].trim().split('=')[1];
	       fileName = fileName.replace(/"/g, '');
	       console.log('fileName:' + fileName);
	       saveAs(file, fileName);
	       modalInstance.close();
	}).error(function(response) {
		  modalInstance.close();
		  var errorModalInstance = $uibModal.open({
			  animation: $ctrl.animationsEnabled,
		      ariaLabelledBy: 'modal-title',
		      ariaDescribedBy: 'modal-body',
		      templateUrl: 'errorModalContent.html',
		      controller: 'ModalInstanceCtrl',
		      controllerAs: '$ctrl'	    
		  });
	})
  };
}])

.controller('mailController', ['$http', '$scope', '$sce', '$uibModal', '$location', 'appConfig', function($http, $scope, $sce, $uibModal, $location, appConfig){
  var $ctrl = this;
  $ctrl.animationsEnabled = true;
  var showProcessingBar = false;
  var mailServiceUrl = appConfig.mailServiceUrl;

  var modalInstance = null;
  $ctrl.open = function (size) {
	    modalInstance = $uibModal.open({
	      animation: $ctrl.animationsEnabled,
	      ariaLabelledBy: 'modal-title',
	      ariaDescribedBy: 'modal-body',
	      templateUrl: 'myModalContent.html',
	      controller: 'ModalInstanceCtrl',
	      controllerAs: '$ctrl',
	      size: size
	    });
  };
      
  $scope.sendMail = function () {
      var data = $.param({
    	  name : $scope.fullname,
	      subject : $scope.subject,
	      text : $scope.text,
	      from : $scope.from
      });	
      var config = {
              headers : {
                  'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
              },
          	responseType :'application/json'
         }
	  $http.post(mailServiceUrl, data, config)
	  .success(function (response) {
	       modalInstance.close();
	});
  };
}])
  
	// Please note that $uibModalInstance represents a modal window (instance)
	// dependency.
// It is not the same as the $uibModal service used above.
.controller('ModalInstanceCtrl', function ($uibModalInstance) {
  var $ctrl = this;
  $ctrl.ok = function () {
    $uibModalInstance.close();
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  
});
  


