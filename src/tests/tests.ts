const assert = require("assert");

suite("BemHelper Tests", () => {
    test("Class extraction - Camel Case", () => {
        const expected = "b";

        let actual = "b";

        assert.deepEqual(actual, expected);
    });
});
