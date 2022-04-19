'use strict';
var app = angular.module('app', ['ngResource','ui.bootstrap','ngRoute','ngCookies','ngSanitize','ngTouch', 'angularUtils.directives.dirPagination','ngFileUpload','chart.js', 'ngAnimate', 'ngMessages','vcRecaptcha','datatables', 'datatables.light-columnfilter', 'ui.mask', 'ngPrint', 'textAngular', 'angular-fullcalendar']);
app.directive('toggle', function(){
  return {
    restrict: 'A',
    link: function(scope, element, attrs){
      if (attrs.toggle=="tooltip"){
        $(element).tooltip();
      }
      if (attrs.toggle=="popover"){
        $(element).popover();
      }
    }
  };
});

app.factory('spinnerService', function () {  
  // create an object to store spinner APIs.
  var spinners = {};
  return {
    // private method for spinner registration.
    _register: function (data) {
      if (!data.hasOwnProperty('name')) {
        throw new Error("Spinner must specify a name when registering with the spinner service.");
      }
      if (spinners.hasOwnProperty(data.name) == spinners.hasOwnProperty(data.name)) {
		  spinners[data.name] = data;
      }
      spinners[data.name] = data;
    },
    // unused private method for unregistering a directive,
    // for convenience just in case.
    _unregister: function (name) {
      if (spinners.hasOwnProperty(name)) {
        delete spinners[name];
      }
    },
    _unregisterGroup: function (group) {
      for (var name in spinners) {
        if (spinners[name].group === group) {
          delete spinners[name];
        }
      }
    },
    _unregisterAll: function () {
      for (var name in spinners) {
        delete spinners[name];
      }
    },
    show: function (name) {
      var spinner = spinners[name];
      if (!spinner) {
        throw new Error("No spinner named '" + name + "' is registered.");
      }
      spinner.show();
    },
    hide: function (name) {
      var spinner = spinners[name];
      if (!spinner) {
        throw new Error("No spinner named '" + name + "' is registered.");
      }
      spinner.hide();
    },
    showGroup: function (group) {
      var groupExists = false;
      for (var name in spinners) {
        var spinner = spinners[name];
        if (spinner.group === group) {
          spinner.show();
          groupExists = true;
        }
      }
      if (!groupExists) {
        throw new Error("No spinners found with group '" + group + "'.")
      }
    },
    hideGroup: function (group) {
      var groupExists = false;
      for (var name in spinners) {
        var spinner = spinners[name];
        if (spinner.group === group) {
          spinner.hide();
          groupExists = true;
        }
      }
      if (!groupExists) {
        throw new Error("No spinners found with group '" + group + "'.")
      }
    },
    showAll: function () {
      for (var name in spinners) {
        spinners[name].show();
      }
    },
    hideAll: function () {
      for (var name in spinners) {
        spinners[name].hide();
      }
    }
  };
});


app.directive('spinner', function () {
    return {
      restrict: 'EA',
      replace: true,
      transclude: true,
      scope: {
        name: '@?',
        group: '@?',
        show: '=?',
        imgSrc: '@?',
        register: '@?',
        onLoaded: '&?',
        onShow: '&?',
        onHide: '&?'
      },
      template: [
        '<span ng-show="show">',
        '  <img ng-show="imgSrc" ng-src="{{imgSrc}}" />',
        '  <span ng-transclude></span>',
        '</span>'
      ].join(''),
      controller: function ($scope, spinnerService) {

        // register should be true by default if not specified.
        if (!$scope.hasOwnProperty('register')) {
          $scope.register = true;
        } else {
          $scope.register = !!$scope.register;
        }

        // Declare a mini-API to hand off to our service so the 
        // service doesn't have a direct reference to this
        // directive's scope.
        var api = {
          name: $scope.name,
          group: $scope.group,
          show: function () {
            $scope.show = true;
          },
          hide: function () {
            $scope.show = false;
          },
          toggle: function () {
            $scope.show = !$scope.show;
          }
        };

        // Register this spinner with the spinner service.
        if ($scope.register === true) {
          spinnerService._register(api);
        }

        // If an onShow or onHide expression was provided,
        // register a watcher that will fire the relevant
        // expression when show's value changes.
        if ($scope.onShow || $scope.onHide) {
          $scope.$watch('show', function (show) {
            if (show && $scope.onShow) {
              $scope.onShow({
                spinnerService: spinnerService,
                spinnerApi: api
              });
            } else if (!show && $scope.onHide) {
              $scope.onHide({
                spinnerService: spinnerService,
                spinnerApi: api
              });
            }
          });
        }

        // This spinner is good to go.
        // Fire the onLoaded expression if provided.
        if ($scope.onLoaded) {
          $scope.onLoaded({
            spinnerService: spinnerService,
            spinnerApi: api
          });
        }
      }
    };
});

app.directive('numbersOnly', function () {
    return function(scope, element, attrs) {
	element.bind("keydown", function(event) {
		if (event.keyCode === 46 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 27 ||			
			
			// Allow: home, end, left, right
			(event.keyCode >= 35 && event.keyCode <= 39)) {
			// let it happen, but check for excessive periods
			if ((event.keyCode === 190 || event.keyCode === 110) && element.val().indexOf('.') !== -1) {
				event.preventDefault();
			}
			return;
		} else {
			// Ensure that it is a number and stop the keypress
			if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
				event.preventDefault();
			}
		}	
    });
  };
});

app.directive('numberFloat', function() {
  return function(scope, element, attrs) {
    $(element).on("keypress", function (evt) {
        var $txtBox = $(this);
        var charCode = (evt.which) ? evt.which : evt.keyCode
        if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46)
            return false;
        else {
            var len = $txtBox.val().length;
            var index = $txtBox.val().indexOf('.');
            if (index > 0 && charCode == 46) {
              return false;
            }
            if (index > 0) {
                var charAfterdot = (len + 1) - index;
                if (charAfterdot > 3) {
                    return false;
                }
            }
        }
        return $txtBox; //for chaining
    });
  };
});

app.directive("searchdatepickers", function () {
  return {
    restrict: "A",
    require: "ngModel",
    link: function (scope, elem, attrs, ngModelCtrl) {
      var updateModel = function (dateText) {
        scope.$apply(function () {
          ngModelCtrl.$setViewValue(dateText);
        });
      };
      var options = {
        dateFormat: "yy-mm-dd",
		changeMonth: true,
		changeYear: true,
        onSelect: function (dateText) {
          updateModel(dateText);
        }
      };
      $(elem).datepicker(options);
    }
  }
});

app.directive("searchdatepickers2", function () {
  return {
    restrict: "A",
    require: "ngModel",
    link: function (scope, elem, attrs, ngModelCtrl) {
      var updateModel = function (dateText) {
        scope.$apply(function () {
          ngModelCtrl.$setViewValue(dateText);
        });
      };
      var options = {
        dateFormat: "yy-mm-dd",
		changeMonth: true,
		changeYear: true,
		showButtonPanel: true,
		closeText: 'Clear',
        onSelect: function (dateText) {
          updateModel(dateText);
        },
		onClose: function (dateText, inst) {			
			if($(window.event.srcElement).hasClass('ui-datepicker-close')) {
				dateText = "";
				document.getElementById(this.id).value = dateText;
				updateModel("");
			}
		}
      };
      $(elem).datepicker(options);
    }
  }
});

app.directive("datepickers", function () {
  return {
    restrict: "A",
    require: "ngModel",
    link: function (scope, elem, attrs, ngModelCtrl) {
      var updateModel = function (dateText) {
        scope.$apply(function () {			
			ngModelCtrl.$setViewValue(dateText);
        });
      };
      var options = {
        dateFormat: "yy-mm-dd",
		changeMonth: true,
		changeYear: true,        
		yearRange: "-100:+0",
		showButtonPanel: true,
        closeText: 'Clear',
        onSelect: function (dateText) {	
			updateModel(dateText);
        },
		onClose: function (dateText, inst) {			
			if($(window.event.srcElement).hasClass('ui-datepicker-close')) {
				dateText = "";
				document.getElementById(this.id).value = dateText;
				updateModel(" ");
			}
		}
      };
      $(elem).datepicker(options);
    }
  }
});

app.directive("datepickersemployee1", function () {
  return {
    restrict: "A",
    require: "ngModel",
    link: function (scope, elem, attrs, ngModelCtrl) {
      var updateModel = function (dateText) {
        scope.$apply(function () {			
			ngModelCtrl.$setViewValue(dateText);
        });
      };
      var options = {
        dateFormat: "yy-mm-dd",
		changeMonth: true,
		changeYear: true,        
		yearRange: "-100:+0",
		showButtonPanel: true,
        closeText: 'Clear',
        onSelect: function (dateText) {	
			updateModel(dateText);
			scope.add.age = moment().diff(scope.add.bdate, 'years');
			scope.$apply();
        },
		onClose: function (dateText, inst) {			
			if($(window.event.srcElement).hasClass('ui-datepicker-close')) {
				dateText = "";
				document.getElementById(this.id).value = dateText;
				updateModel(" ");
			}
		}
      };
      $(elem).datepicker(options);
    }
  }
})

app.directive("datepickersemployee3", function () {
  return {
    restrict: "A",
    require: "ngModel",
    link: function (scope, elem, attrs, ngModelCtrl) {
      var updateModel = function (dateText) {
        scope.$apply(function () {			
			ngModelCtrl.$setViewValue(dateText);
        });
      };
      var options = {
        dateFormat: "yy-mm-dd",
		changeMonth: true,
		changeYear: true,        
		yearRange: "-100:+0",
		showButtonPanel: true,
        closeText: 'Clear',
        onSelect: function (dateText) {	
			updateModel(dateText);
			scope.edit.age = moment().diff(scope.edit.bdate, 'years');
			scope.$apply();
        },
		onClose: function (dateText, inst) {			
			if($(window.event.srcElement).hasClass('ui-datepicker-close')) {
				dateText = "";
				document.getElementById(this.id).value = dateText;
				updateModel(" ");
			}
		}
      };
      $(elem).datepicker(options);
    }
  }
})

app.directive("datepickersemployee2", function () {
  return {
    restrict: "A",
    require: "ngModel",
    link: function (scope, elem, attrs, ngModelCtrl) {
      var updateModel = function (dateText) {
        scope.$apply(function () {			
			ngModelCtrl.$setViewValue(dateText);
        });
      };
      var options = {
        dateFormat: "yy-mm-dd",
		changeMonth: true,
		changeYear: true,        
		yearRange: "-100:+0",
		showButtonPanel: true,
        closeText: 'Clear',
        onSelect: function (dateText) {	
			updateModel(dateText);
			var ele = $(elem).attr("name");
			var arr = ele.split("_");
			var key = arr[1];
			scope.edit.dependents[key].age = moment().diff(scope.edit.dependents[key].birthday, 'years');
			scope.$apply();
        },
		onClose: function (dateText, inst) {			
			if($(window.event.srcElement).hasClass('ui-datepicker-close')) {
				dateText = "";
				document.getElementById(this.id).value = dateText;
				updateModel(" ");
			}
		}
      };
      $(elem).datepicker(options);
    }
  }
})

app.directive("datepickersot1", function () {
  return {
    restrict: "A",
    require: "ngModel",
    link: function (scope, elem, attrs, ngModelCtrl) {
      var updateModel = function (dateText) {
        scope.$apply(function () {			
			ngModelCtrl.$setViewValue(dateText);
        });
      };
      var options = {
        dateFormat: "yy-mm-dd",		
		showButtonPanel: true,
        closeText: 'Clear',
        onSelect: function (dateText) {			
		
			var dt2 = $('#ot_dstart');
			var startDate = $(this).datepicker('getDate');
			var minDate = $(this).datepicker('getDate');
		   
			startDate.setDate(startDate.getDate() + 0);
			//sets dt2 maxDate to the last day of 30 days window
			 
			dt2.datepicker('option', 'maxDate', startDate);
			dt2.datepicker('option', 'minDate', minDate);		
			updateModel(dateText);
			
        },
		onClose: function (dateText, inst) {			
			if($(window.event.srcElement).hasClass('ui-datepicker-close')) {
				dateText = "";
				document.getElementById(this.id).value = dateText;
				updateModel(" ");
			}
		}
      };
      $(elem).datepicker(options);
    }
  }
});

app.directive("datepickersot2", function () {
  return {
    restrict: "A",
    require: "ngModel",
    link: function (scope, elem, attrs, ngModelCtrl) {
      var updateModel = function (dateText) {
        scope.$apply(function () {			
			ngModelCtrl.$setViewValue(dateText);
        });
      };
      var options = {
        dateFormat: "yy-mm-dd",		
		showButtonPanel: true,
        closeText: 'Clear',
        onSelect: function (dateText) {			
		
			var dt2 = $('#ot_dend');
			var startDate = $(this).datepicker('getDate');
			var minDate = $(this).datepicker('getDate');
		   
			startDate.setDate(startDate.getDate() + 1);
			//sets dt2 maxDate to the last day of 30 days window
			 
			dt2.datepicker('option', 'maxDate', startDate);
			dt2.datepicker('option', 'minDate', minDate);
			//dt2.datepicker('setDate', minDate);	
			updateModel(dateText);
			
        },
		onClose: function (dateText, inst) {			
			if($(window.event.srcElement).hasClass('ui-datepicker-close')) {
				dateText = "";
				document.getElementById(this.id).value = dateText;
				updateModel(" ");
			}
		}
      };
      $(elem).datepicker(options);
    }
  }
});

app.directive("datepickersot3", function () {
  return {
    restrict: "A",
    require: "ngModel",
    link: function (scope, elem, attrs, ngModelCtrl) {
      var updateModel = function (dateText) {
        scope.$apply(function () {			
			ngModelCtrl.$setViewValue(dateText);
        });
      };
      var options = {
        dateFormat: "yy-mm-dd",		
		minDate: 2,
		showButtonPanel: true,
        closeText: 'Clear',
        onSelect: function (dateText) {			
		
			updateModel(dateText);
			
        },
		onClose: function (dateText, inst) {			
			if($(window.event.srcElement).hasClass('ui-datepicker-close')) {
				dateText = "";
				document.getElementById(this.id).value = dateText;
				updateModel(" ");
			}
		}
      };
      $(elem).datepicker(options);
    }
  }
});

app.directive("timepick", function () {
  return {
    restrict: "A",
    require: "ngModel",
    link: function (scope, elem, attrs, ngModelCtrl) {
      var updateModel = function (dateText) {
        scope.$apply(function () {			
			ngModelCtrl.$setViewValue(dateText);
        });
      };
      var options = {
        date: false,
		format: 'HH:mm', 
		shortTime : true,
		clearButton: true
      };
      $(elem).bootstrapMaterialDatePicker(options).on('close',function(e,date){
		updateModel(date);
	  });
    }
  }
});

app.filter('range', function() {
  return function(input, min, max) {
    min = parseInt(min);
    max = parseInt(max);
    for (var i=min; i<=max; i++)
      input.push(i);
    return input;
  };
});

app.directive('jtree', function() {
  return function(scope, element, attrs) {
      $(element).jstree({
        'core' : {
          'data' : {
            "url" : "/dbic/assets/php/admin/org/structure/data.php",
            'data' : function(node) {
              if( node.id == "#" ){
				return {
					'id'        : node.id
				};
			  }else{
				return {
					'id'        : node.original.id,
					'unittype'	: node.original.unittype,
					'alias'		: node.original.alias
				};  
			  }
            },
            "dataType" : "json" 
          }
        }
      }).bind("select_node.jstree",function(event, data){
          $(element).jstree({
            'core' : {
              'data' : {
                "url" : "/dbic/assets/php/admin/org/structure/data.php",
                'data' : function(node) {
                              return {
                                  'id'        : node.id
                              };
                          },
                "dataType" : "json" 
              }
            },
            'open_node': data.node
          });
      });
  };
});

app.directive('jtree2', function() {
	return function(scope, element, attrs) {
		
		$(element).orgchart({
			'data' :'/dbic/assets/php/admin/org/structure/data2.php?conn=' + scope.dashboard.values.globranch,
			'conn': ''+scope.dashboard.values.globranch,
			'nodeContent': 'title',
			'pan': true,
			'zoom': true,
			'direction': 'l2r',
			'initCompleted': function($chart) {
				$(element).animate({ scrollTop: 750 }, "slow");
			}
		});
	};
});

app.directive('highrow', function () {
    return function(scope, element, attrs) {
		element.click(function() {
			$(this).addClass('bg-success').siblings().removeClass('bg-success');
		});
	};
});

app.directive("editdiv", function () {
	return {
		restrict: "A",
		require: "ngModel",
		link: function (scope, element, attrs, ngModelCtrl) {
			var updateModel = function (dateText) {
				scope.$apply(function () {
				  ngModelCtrl.$setViewValue(dateText);
				});
			};		  
			element.bind("keydown", function(event) {
				var cntMaxLength = parseInt($(this).attr('maxlength'));	
				if($(this).text().length === cntMaxLength && event.keyCode != 8) {
					event.preventDefault();
				}
			});
			element.bind("keyup", function(event) {
				updateModel( $(this).text() );
			});
		}
	}
});

/*
app.directive("daterangepickers", function () {
  return {
    restrict: "A",
    require: "ngModel",
    link: function (scope, elem, attrs, ngModelCtrl) {
      var updateModel = function (dateText) {
        scope.$apply(function () {
          ngModelCtrl.$setViewValue(dateText);
        });
      };
     
		$(elem).daterangepicker({
			locale: {
			  cancelLabel: 'Clear'
			}
		});
		$(elem).on('apply.daterangepicker', function(ev, picker) {
			var dateText = picker.startDate.format('YYYY-MM-DD') + ' to ' + picker.endDate.format('YYYY-MM-DD');
			updateModel(dateText);
		});
		$(elem).on('cancel.daterangepicker', function(ev, picker) {
			var dateText = '';
			updateModel(dateText);
			$(elem).val(dateText);	
		});
	  
    }
  }
});
*/

app.directive("select2", function () {
	return {
		restrict: "A",
		require: "ngModel",
		link: function (scope, elem, attrs, ngModelCtrl) {
			var updateModel = function (dateText) {
				scope.$apply(function () {
					ngModelCtrl.$setViewValue(dateText);
				});
			};
			$(elem).select2();
			$(elem).on('select2:select', function (e) {
				var data = e.params.data.id;
				updateModel(data)
			});
		}
	}
});

app.filter('titlecase', function() {
    return function(input) {
      if (!input || typeof input !== 'string') {
        return '';
      }

      return input.toLowerCase().split(' ').map(value => {
        return value.charAt(0).toUpperCase() + value.substring(1);
      }).join(' ');
    }
});

app.directive('numberForm', function() {
  return function(scope, element, attrs) {
    $(element).on("keypress", function (evt) {
		var $txtBox = $(this);
        var charCode = (evt.which) ? evt.which : evt.keyCode
        if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46)
            return false;
        else {
            var len = $txtBox.val().length;
            var index = $txtBox.val().indexOf('.');
            if (index > 0 && charCode == 46) {
              return false;
            }
            if (index > 0) {
                var charAfterdot = (len + 1) - index;
                if (charAfterdot > 3) {
                    //return false;
                }
            }
        }
        return $txtBox; //for chaining
    });
	
	$(element).on("keyup", function (evt) {
		$(this).val(function(index, value) {
			var a = value.split(".");
			var aa= a[0].replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			if( a.length == 2 ){
				if( a[1].length > 2 ){
					return aa + "." + a[1].substring(0, 2);
				}
				return aa + "." + a[1];
			}else{
				return aa;
			}
		});
    });
  };
});

app.directive("addAttachment", function($compile){
	return function(scope, element, attrs){
		element.bind("click", function(){
			var ctr = scope.add.docs.length;
			var supCtr = document.getElementsByClassName("tr_rows").length;
			if( supCtr < 11 ){
				var v = ctr+1;
				scope.add.docs[ctr] 		= "";
				scope.add.picFile[ ctr+1 ]	= "";
				scope.$apply();
			}
		});
	}
});

app.directive("deleteAttachment", function($compile){
	return function(scope, element, attrs){
		element.bind("click", function(){
			var id = $(this).attr("id");
			var str= id.split("_");
			var data 	= [];
			var data_pic= [];
			$.each(scope.add.docs,function (key , val){ 
				if( scope.add.docs.hasOwnProperty(key) ){
					if( str[1]!=key ){
						data[key] = val;
					}
				}
			});
			var picKey = parseInt( str[1] ) + 1;
			$.each(scope.add.picFile,function (key , val){ 
				if( scope.add.picFile.hasOwnProperty(key) ){
					if( picKey!=key ){
						data_pic[key] = val;
					}
				}
			});
			scope.add.docs 		= data;
			scope.add.picFile 	= data_pic;
			scope.$apply();
		});
	}
});

app.directive("editAttachment", function($compile){
	return function(scope, element, attrs){
		element.bind("click", function(){
			var ctr = scope.edit.docs.length;
			var supCtr = document.getElementsByClassName("tr_rows2").length;
			if( supCtr < 11 ){
				var v = ctr+1;
				scope.edit.docs[ctr] 		= "";
				scope.edit.epicFile[ ctr+1 ]	= "";
				scope.$apply();
			}
		});
	}
});

app.directive("deleteAttachment2", function($compile){
	return function(scope, element, attrs){
		element.bind("click", function(){
			var id = $(this).attr("id");
			var str= id.split("_");
			var data 	= [];
			var data_pic= [];
			$.each(scope.edit.docs,function (key , val){ 
				if( scope.edit.docs.hasOwnProperty(key) ){
					if( str[1]!=key ){
						data[key] = val;
					}
				}
			});
			var picKey = parseInt( str[1] ) + 1;
			$.each(scope.edit.epicFile,function (key , val){ 
				if( scope.edit.epicFile.hasOwnProperty(key) ){
					if( picKey!=key ){
						data_pic[key] = val;
					}
				}
			});
			scope.edit.docs 	= data;
			scope.edit.epicFile = data_pic;
			scope.$apply();
		});
	}
});

// Dependent 
app.directive("dependent", function($compile){
	return function(scope, element, attrs){
		element.bind("click", function(){
			var modelCtr = document.getElementsByClassName("dependent_request").length;
			if(modelCtr < 10){
				scope.view.new_dependent.new_dependent_name[ modelCtr ] = '';
				scope.view.new_dependent.new_dependent_bdate[ modelCtr ] = '';
				scope.view.new_dependent.new_dependent_age[ modelCtr ] = '';
				scope.$apply();
				var eleDOM = '<div class = "col-xs-12 dependent_request" style = "padding:0;">';
				eleDOM = eleDOM +'<div class = "col-xs-6" style = "padding:0;">';
				eleDOM = eleDOM + '<input class="underline" placeholder = "Name" ng-model = "view.new_dependent.new_dependent_name['+ modelCtr+']" style="width:95%; border: 0; display:table-cell; border-bottom: 1px solid black;">';
				eleDOM = eleDOM + '</div>';

				eleDOM = eleDOM +'<div class = "col-xs-4" style = "padding:0;">';
				eleDOM = eleDOM + '<input name="mydate_'+ modelCtr +'" class="underline" datepickersemployee2dan placeholder = "Birthdate" readonly autocomplete="off" ng-model = "view.new_dependent.new_dependent_bdate['+ modelCtr+']" style="width:95%; border: 0; display:table-cell; border-bottom: 1px solid black;">';
				eleDOM = eleDOM + '</div>';

				eleDOM = eleDOM +'<div class = "col-xs-2" style = "padding:0;">';
				eleDOM = eleDOM + '<input class="underline" placeholder = "Age" ng-model = "view.new_dependent.new_dependent_age['+ modelCtr+']" style="width:95%; border: 0; display:table-cell; border-bottom: 1px solid black;">';
				eleDOM = eleDOM + '</div>';

				eleDOM = eleDOM + '</div>';

				angular.element(document.getElementById('btn-dependent')).before($compile(eleDOM)(scope));
			}
		});
	}
});

//Auto calculate age on Date select, put on module.js
app.directive("datepickersemployee2dan", function () {
  return {
    restrict: "A",
    require: "ngModel",
    link: function (scope, elem, attrs, ngModelCtrl) {
      var updateModel = function (dateText) {
        scope.$apply(function () {			
			ngModelCtrl.$setViewValue(dateText);
        });
      };
      var options = {
        dateFormat: "yy-mm-dd",
		changeMonth: true,
		changeYear: true,        
		yearRange: "-100:+0",
		showButtonPanel: true,
        closeText: 'Clear',
        onSelect: function (dateText) {	
			updateModel(dateText);
			var ele = $(elem).attr("name");
			var arr = ele.split("_");
			var key = arr[1];
			scope.view.new_dependent.new_dependent_age[key] = moment().diff(scope.view.new_dependent.new_dependent_bdate[key], 'years');
			scope.$apply();
        },
		onClose: function (dateText, inst) {			
			if($(window.event.srcElement).hasClass('ui-datepicker-close')) {
				dateText = "";
				document.getElementById(this.id).value = dateText;
				updateModel(" ");
			}
		}
      };
      $(elem).datepicker(options);
    }
  }
})

app.directive("addAccountLeave", function($compile){
	return function(scope, element, attrs){
		element.bind("click", function(){
			var ctr = scope.edit.leaves.length;
			var supCtr = document.getElementsByClassName("lvrow").length;
			if( supCtr < 13 ){
				var v = ctr+1;
				scope.edit.leaves[ctr] = {
					id				: "",
					name			: "",
					hours			: "",
					idtype			: "",
					isconvertible	: "",
					type			: "",
					idacct			: scope.edit.idacct,
					idacctleave 	: "",
					balance			: "0",
					used			: "0",
					entitle			: "0",
					key				: ctr
				};
				scope.$apply();
			}
		});
	}
});

app.directive("addAccountAllowance", function($compile){
	return function(scope, element, attrs){
		element.bind("click", function(){
			var ctr = scope.edit.acctallowance.length;
			var supCtr = document.getElementsByClassName("allrow").length;
			if( supCtr < 11 ){
				var v = ctr+1;
				scope.edit.acctallowance[ctr] = {
					id			: "",
					idacct		: scope.edit.idacct,
					idallowance	: "",
					idmethod	: "1",
					amt			: "0.00",
					iddef		: "",
					key			: ctr
				};
				scope.$apply();
			}
		});
	}
});

app.filter('unique', function() {
    return function(collection, primaryKey) { 
      var output = [], 
          keys = [];
          var splitKeys = primaryKey.split('.'); 


      angular.forEach(collection, function(item) {
            var key = {};
            angular.copy(item, key);
            for(var i=0; i<splitKeys.length; i++){
                key = key[splitKeys[i]];  
            }

            if(keys.indexOf(key) === -1) {
              keys.push(key);
              output.push(item);
            }
      });

      return output;
    };
});

app.directive('ctrqry', function() {
  return function(scope, element, attrs) {
  };
});

