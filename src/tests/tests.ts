let assert = require("assert");
import { TypescriptConverter } from "../index";

suite("Interface conversion tests", () => {
    let tsConverter = new TypescriptConverter();

    test("empty interface", () => {
        let input = `
        interface Beans {
        }
        `.replace(/\s+/g, " ");

        let expected = `
        public class Beans {
        }
        `
            .replace(/\s+/g, " ")
            .trim();

        let actual = tsConverter
            .convertInterfaceToCsharp(input)
            .replace(/\s+/g, " ")
            .trim();

        assert.deepEqual(actual, expected);
    });

    test("extract name", () => {
        let input = `
        interface Beans {
        }
        `.replace(/\s+/g, " ");

        let expected = "Beans";

        let actual = tsConverter.extractInterfaceName(input);

        assert.deepEqual(actual, expected);
    });
});
