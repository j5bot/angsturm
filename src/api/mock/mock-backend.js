'use strict';

// We will be using backend-less development
// $http uses $httpBackend to make its calls to the server
// $resource uses $http, so it uses $httpBackend too
// We will mock $httpBackend, capturing routes and returning data
angular.module('interfaceDesignerApp').run([

    '$httpBackend',
    'ApplicationResourceConfig',
    'MockServices',

    function(

        $httpBackend,
        ARC,
        MockServices

    ) {

        var serviceRE =
            new RegExp(['', ARC.type, ARC.version, ARC.application, '(.+)'].join('\/'), 'mi');

        function getMatches(url) {
            return serviceRE.exec(url);
        }

        function standardRequest (info, method, url, data) {

            var m = getMatches(url),
                segments,
                service,
                path,
                parameters;

            if (!m || m.length === 1) {
                return [404, {}, {}];
            }

            url = m[1];
            segments = url.split('?');

            parameters = segments.length > 1 ? segments[segments.length - 1] : '';
            segments = segments[0].split('/'); 

            service = segments[0];
            path = segments.length > 1 ? segments.slice(1).join('/') : '';

            service = MockServices[service] || undefined;

            if ( angular.isUndefined(service) ) {
                return [ 404, {}, {} ];
            }

            return service[method.toLowerCase()](path, parameters, data);
        }

        // included in ng 1.3
        // $httpBackend.whenHEAD(serviceRE).respond(function(method, url, data) {

        //     return standardRequest('head', method, url, data);

        // });
        
        $httpBackend.when('HEAD', serviceRE).respond(function (method, url, data) {
            return standardRequest(method.toLowerCase(), method, url, data);
        });
 
        $httpBackend.whenGET(serviceRE).respond(function(method, url, data) {
            return standardRequest(method.toLowerCase(), method, url, data);
        });

        // this is the creation of a new resource
        $httpBackend.whenPOST(serviceRE).respond(function(method, url, data) {
            return standardRequest('post', method, url, data);
        });
        $httpBackend.whenDELETE(serviceRE).respond(function(method, url, data) {
            // // parse the matching URL to pull out the id (/games/:id)
            // var gameid = url.split('/')[2];
            
            // MockDataModel.deleteOne(gameid);
            
            // return [204, {}, {}];
        });    
        
        // $httpBackend.whenHEAD(/.*/).passThrough(); // 1.3 includes this
        $httpBackend.when('HEAD', /.*/).passThrough();
        $httpBackend.whenGET(/.*/).passThrough();
        $httpBackend.whenPOST(/.*/).passThrough();
        $httpBackend.whenDELETE(/.*/).passThrough();
        $httpBackend.whenPUT(/.*/).passThrough();
    
    }

]);