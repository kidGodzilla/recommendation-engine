(function () {
    /**
     * Generate a (globally) Unique ID
     */
    recommendations.registerGlobal('generateUID', function (separator) {
        var delimiter = separator || "-";

        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }

        return (s4() + s4() + delimiter + s4() + delimiter + s4() + delimiter + s4() + delimiter + s4() + s4() + s4());
    });
})();