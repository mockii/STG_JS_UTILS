describe('common.filters: CountdownTimerFilter', function () {
    beforeEach(module('common.filters.CountdownTimerFilter'));

    it('filter is injectable and exists', inject(function(CountdownTimerFilterFilter) {
        expect(CountdownTimerFilterFilter).not.toBeNull();

    }));

    it('Timer should read ""', inject(function(CountdownTimerFilterFilter) {
        expect(CountdownTimerFilterFilter()).toBe("");
    }));

    it('Timer should read 0:00', inject(function(CountdownTimerFilterFilter) {
        expect(CountdownTimerFilterFilter(999)).toBe("0:00");
    }));

    it('Timer should read 0:30', inject(function(CountdownTimerFilterFilter) {
        expect(CountdownTimerFilterFilter(30000)).toBe("0:30");
    }));

    it('Timer should read 1:30', inject(function(CountdownTimerFilterFilter) {
        expect(CountdownTimerFilterFilter(90000)).toBe("1:30");
    }));

    it('Timer should read 59:59', inject(function(CountdownTimerFilterFilter) {
        expect(CountdownTimerFilterFilter(3599000)).toBe("59:59");
    }));

    it('Timer should read 1:59:59', inject(function(CountdownTimerFilterFilter) {
        expect(CountdownTimerFilterFilter(7199000)).toBe("1:59:59");
    }));

});
