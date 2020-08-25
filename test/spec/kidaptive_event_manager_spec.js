define([
    'kidaptive_event_manager',
    'kidaptive_constants',
    'kidaptive_error',
    'kidaptive_utils'
], function(
    KidaptiveEventManager,
    KidaptiveConstants,
    KidaptiveError
) {
    'use strict';

    describe('KidaptiveEventManager unit tests', function() {
        var clearLocalStorage = function() {
            Object.keys(localStorage).forEach(function (k) {
                delete localStorage[k];
            });
        };

        var eventManager;
        var sdk = {
            httpClient: {
                ajax: sinon.stub(),
                getCacheKey: function(){
                    return MOCK_CACHE_KEY;
                }
            },
            userManager: {
                currentUser: 'MOCK_USER'
            }
        };
        var MOCK_CACHE_KEY = 'MOCK_CACHE_KEY';

        before(function() {
            sinon.stub(Date,'now').returns(1234567890);
        });

        after(function() {
            Date.now.restore();
        });

        beforeEach(function() {
            clearLocalStorage();
            eventManager = new KidaptiveEventManager(sdk);
            sdk.httpClient.ajax.reset();
            sdk.httpClient.ajax.resolves();
        });

        it('new init', function() {
            eventManager.eventQueue.should.deepEqual([]);
            eventManager.batchesPending.should.deepEqual({});
        });

        it('event stored', function() {
            eventManager.queueEvent('mock_event');
            eventManager.eventQueue.should.deepEqual(['mock_event']);
            JSON.parse(localStorage[MOCK_CACHE_KEY]).should.deepEqual(['mock_event']);
        });

        it('events sent', function() {
            var badRequestError = new KidaptiveError(KidaptiveError.KidaptiveErrorCode.INVALID_PARAMETER, "400 error");

            ['mock_event1', 'mock_event2', 'mock_event3'].forEach(function(e) {
                eventManager.queueEvent(e);
            });
            sdk.httpClient.ajax.onFirstCall().rejects(badRequestError);
            var promiseTest =  eventManager.flushEvents().then(function(value) {
                value.should.deepEqual([
                    {event: 'mock_event1', resolved:true, value: 'no-op event forwarding'},
                    {event: 'mock_event2', resolved:true, value: 'no-op event forwarding'},
                    {event: 'mock_event3', resolved:true, value: 'no-op event forwarding'}
                ]);

                eventManager.eventQueue.should.deepEqual([]);
                should.not.exist(localStorage[MOCK_CACHE_KEY]);
                eventManager.batchesPending.should.deepEqual({});
                JSON.parse(localStorage[MOCK_CACHE_KEY + '.pending']).should.deepEqual({});

                // verify no ajax calls.
                var calls = sdk.httpClient.ajax.getCalls();
                calls.length.should.equal(0);
            });

            eventManager.eventQueue.should.deepEqual([]);
            should(localStorage[MOCK_CACHE_KEY]).undefined();
            eventManager.batchesPending.should.deepEqual({1234567890:['mock_event1', 'mock_event2', 'mock_event3']});
            JSON.parse(localStorage[MOCK_CACHE_KEY + '.pending']).should.deepEqual({1234567890:['mock_event1', 'mock_event2', 'mock_event3']});

            return promiseTest;
        });

        it('init with stored events', function() {
            localStorage[MOCK_CACHE_KEY] = JSON.stringify(['event1','event2']);
            localStorage[MOCK_CACHE_KEY + ".pending"] = JSON.stringify({'foo': ['event3', 'event4'], 'bar': ['event5']});
            eventManager = new KidaptiveEventManager(sdk);
            eventManager.eventQueue.length.should.equal(5);
            ['event1','event2','event3','event4','event5'].forEach(function(e) {
                eventManager.eventQueue.indexOf(e).should.not.equal(-1);
            });

            localStorage[MOCK_CACHE_KEY].should.equal(JSON.stringify(eventManager.eventQueue));
            eventManager.batchesPending.should.deepEqual({});
            should(localStorage[MOCK_CACHE_KEY + ".pending"]).undefined();
        })
    });
});