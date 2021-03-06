describe('Navbar directive', function() {

  var element = null;
  var $scope = null;

  beforeEach(module('partials/navbar.html'));
  beforeEach(module('library.services'));
  beforeEach(module('library.directives'));
  beforeEach(module('library.filters'));

  beforeEach(inject(function($rootScope) {
    element = angular.element('<div data-navbar></div>');
    $scope = $rootScope;
  }));

  it('should create navbar not logged in', inject(function($compile, authService) {

    spyOn(authService, 'isLoggedIn').andReturn(false);

    $compile(element)($scope);
    $scope.$digest();

    expect(element.find('span.logged-in').css('display')).toBe('none');
    expect(element.find('span.not-logged-in').css('display')).not.toBe('none');

  }));

  it('should create navbar logged in', inject(function($compile, authService) {

    spyOn(authService, 'isLoggedIn').andReturn(true);
    spyOn(authService, 'getFullName').andReturn('Zaphod');
    spyOn(authService, 'isAdmin').andReturn(false);

    $compile(element)($scope);
    $scope.$digest();

    expect(element.find('span.logged-in').css('display')).not.toBe('none');
    expect(element.find('span.not-logged-in').css('display')).toBe('none');
    expect(element.find('span.logged-in a.login').html()).toBe('Zaphod');
    expect(element.find('span.logged-in .createBook').css('display')).toBe('none');

  }));

  it('should create navbar logged in as admin', inject(function($compile, authService) {

    spyOn(authService, 'isLoggedIn').andReturn(true);
    spyOn(authService, 'getFullName').andReturn('Zaphod');
    spyOn(authService, 'isAdmin').andReturn(true);

    $compile(element)($scope);
    $scope.$digest();

    expect(element.find('span.logged-in .createBook').css('display')).not.toBe('none');

  }));

  it('should logout', inject(function($q, $compile, $location, $route, authService) {
    
    spyOn(authService, 'isLoggedIn').andReturn(true);
    spyOn(authService, 'getFullName').andReturn('Thomas Moorcroft');
    spyOn(authService, 'isAdmin').andReturn(false);
    
    var deferred = $q.defer();
    deferred.resolve();
    
    spyOn(authService, 'logout').andReturn(deferred.promise);
    
    spyOn($location, 'path');
    spyOn($route, 'reload');

    $compile(element)($scope);
    $scope.$digest();
    
    expect($scope.logout).toBeDefined();

    $scope.logout();

    expect(authService.logout).toHaveBeenCalled();

    // promises are resolved/dispatched only on next $digest cycle
    $scope.$apply();

    expect($location.path).toHaveBeenCalledWith('/books');
    expect($route.reload).toHaveBeenCalled();

  }));

});

