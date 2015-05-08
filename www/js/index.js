user="nouser";
selectedTicket={};
selectedUser='';

var People="[]";
var d = new Date();

var myProfile="[]";
todos={};
selectedChat={};
var module = ons.bootstrap('my-app', ['onsen'],function($httpProvider) {
  // Use x-www-form-urlencoded Content-Type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

  /**
   * The workhorse; converts an object to x-www-form-urlencoded serialization.
   * @param {Object} obj
   * @return {String}
   */ 
  var param = function(obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

    for(name in obj) {
      value = obj[name];

      if(value instanceof Array) {
        for(i=0; i<value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }

    return query.length ? query.substr(0, query.length - 1) : query;
  };

  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
});
module.controller('AppController', function($scope,$http) {
	
    $scope.miPerfil=function(){
    	$http.get('http://empowerlabs.com/proyectos/helpDesk/getUserData.php?user='+user).
  success(function(data, status, headers, config) {
  	//$scope.ons.notification.alert({message: ""+data.firstname,title: "intellibanks"});
    $myDataProfile=data;
    myProfile=data;
    $scope.mydata = $myDataProfile;
    //ons.notification.alert({message: ''+user, title:"Intellibanks"});
  }).
  error(function(data, status, headers, config) {
  	
  });
    };
});

module.controller('PageController', function($scope) {
	
	ons.ready(function() {
		// Init code here
  	
	});
	
	
	$scope.miPerfil();
}); 

module.controller('MensajeController', function($scope,$timeout,$http) {
	
  	if(user=="nouser"){
  		 menu.setMainPage('login2.html');
  	}
	$scope.timeInMs = 0;
	$scope.res={};
	$scope.mensajeBox={};
  	$scope.size=0;
    $scope.previa=selectedChat;
    $scope.getMensajes=function(){
     $http.get('http://alexrojas.cloudapp.net/web/chat/getChat.php?chat='+selectedChat.who)
                       .success(function (data) {
						if($scope.size==data.detail.length){
							
						}
						else{
							$scope.res= data.detail.reverse();
                          $scope.size=$scope.res.length;
						}
                          
                       });
    };
    $scope.getMensajes();
    var countUp = function() {
        $scope.timeInMs+= 500;
        $scope.getMensajes();
        $timeout(countUp, 500);
    };
    $timeout(countUp, 500);
	$scope.enviarMensaje=function(){
		//$scope.ons.notification.alert({title:'EmpowerLabsIntra', message:'Enviando ...'});
		$http.get('http://alexrojas.cloudapp.net/web/chat/send.php?from='+user+
		'&to='+selectedChat.who2+
		'&message='+$scope.mensajeBox.message+
		'&who='+selectedChat.who+
		'&date='+d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate()+
		'&time='+d.getHours()+'-'+d.getMinutes()+'-'+d.getSeconds())
                       .success(function (data) {
    $scope.getMensajes();
	$scope.mensajeBox={};

                       });
	};
}).config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.timeout = 5000;
}]); 


module.controller('ChatsController', function($scope,$timeout,$http) {
	  
  	if(user=="nouser"){
  		 menu.setMainPage('login2.html');
  	}
	$scope.res={};
	$scope.mensajeBox={};
  	$scope.size2=0;
    
    $scope.getChats=function(){
     $http.get('http://alexrojas.cloudapp.net/web/chat/myChats.php?me='+user)
                       .success(function (data) {
						if($scope.size==data.detail.length){
							
						}
						else{
							for(i=0;i<data.detail.length;i++){
								data.detail[i].who2=data.detail[i].who.replace("-", " ").replace(user," ");
							}
							$scope.res= data.detail.reverse();
                          $scope.size=$scope.res.length;
						}
                          
                       });
    };
    $scope.getChats();
    var countUp2 = function() {
        $scope.getChats();
        $timeout(countUp2, 500);
    };
    $timeout(countUp2, 500);
	$scope.nuevoMensaje=function(){
		$scope.ons.navigator.pushPage('nuevoMensaje.html',{animation:'lift'});
	};
	$scope.showChat=function(r){
		selectedChat=r;
		$scope.ons.navigator.pushPage('mensajes.html');
	};
}).config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.timeout = 5000;
}]); 



module.controller('newMessageController', function($scope, $dataPeople, $http) {
	$http.get('http://empowerlabs.com/proyectos/helpDesk/getUsers.php').
  success(function(data, status, headers, config) {
  	//$scope.ons.notification.alert({message: ""+data.firstname,title: "intellibanks"});
    $dataPeople=data;
    People=data;
    $scope.data = $dataPeople;
    $scope.newMessage=function(i){
    	selectedUser=i;
    	arr=[user,selectedUser];
    	arr.sort();
    	arr.reverse();
    	$http.get('http://alexrojas.cloudapp.net/web/chat/newChat.php?from='+user+
    	'&to='+selectedUser+
    	'&who='+arr[0]+'-'+arr[1]+'&message='+user+' ha iniciado chat'+
		'&date='+d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate()+
		'&time='+d.getHours()+'-'+d.getMinutes()+'-'+d.getSeconds()).
	success(function(data, status, headers, config){
		
    	$scope.ons.navigator.popPage('chats.html', {title : i});
	});
    	};
  }).
  error(function(data, status, headers, config) {
  	
  });
  });
   module.factory('$dataPeople', function() {
      var dataPeople;
      		dataPeople=People;
      
      return dataPeople;
  });

module.controller('TicketsController', function($scope,$dataTickets,$http) {
  	$scope.items=todos;
	$http.get('http://empowerlabs.com/proyectos/trackersAPI/EmpowerLabsIntra/tickettracker/todos.php').
	success(function(data, status, headers, config){
		
  	data.reverse();
    $dataTickets.items=data;
    todos=data;
    $scope.items = $dataTickets.items; 
	});
	$scope.showTicket=function(item){
		$dataTickets.selectedItem=item;
		$scope.ons.navigator.pushPage('ticket.html');
	};
}); 

  module.factory('$dataTickets', function() {
      var dataTickets = {};
      		dataTickets.items=todos;
      
      return dataTickets;
  });

module.controller('NewTicketController', function($scope) {
});


module.controller('TicketIndividualController', function($scope,$dataTickets) {
	$scope.item=$dataTickets.selectedItem;
}); 

  
  module.controller('LoginController',function($scope,$http){
  	$scope.formLogin={};
  		$scope.login=function(){
  			$http.get('http://empowerlabs.com/landing-pages/Martin/Usuarios/ingreso.php?nombre='+$scope.formLogin.nombre+'&pass='+$scope.formLogin.pass).
  			success(function(data,status,headers,config){
  				if(data.code=="OK"){
  					user=data.user;
  					//ons.notification.alert({message: ''+data.respuesta, title:"Intellibanks"});
  					$scope.miPerfil();
  					menu.setMainPage('chats.html');
  				}
  				else{
  					ons.notification.alert({message: ''+data.respuesta, title:"Intellibanks"});
  				}
  			});
  		};
  		
  });
   module.factory('$myDataProfile', function() {
      var myDataProfile;
      		myDataProfile=myProfile;
      
      return myDataProfile;
  });
