let assert = require("assert");
import { TypescriptConverter } from "../index";

suite("Interface conversion tests", () => {
    let tsConverter = new TypescriptConverter();

    test("generate classes - multiple interfaces", () => {
        let input = `
        interface Beans {
            propOne : string;
            propTwo : string;
            propThree : number;
            propFour : boolean;
        }

        interface SecondaryClass {
            propertyNumberOne : number[];
            isProperty : boolean;
        }
        `
            .replace(/\s+/g, " ")
            .trim();

        let expected = `
        public class Beans {
            [JsonProperty("propOne")]
            public string PropOne;

            [JsonProperty("propTwo")]
            public string PropTwo;

            [JsonProperty("propThree")]
            public int PropThree;

            [JsonProperty("propFour")]
            public bool PropFour;
        }

        public class SecondaryClass {
            [JsonProperty("propertyNumberOne")]
            public IEnumerable<int> PropertyNumberOne;

            [JsonProperty("isProperty")]
            public bool IsProperty;
        }
        `
            .replace(/\s+/g, " ")
            .trim();

        let actual = tsConverter
            .convertInterfacesToCSharp(input)
            .replace(/\s+/g, " ")
            .trim();

        assert.deepEqual(actual, expected);
    });

    test("generate class - primative types", () => {
        let input = `
        interface Beans {
            propOne : string;
            propTwo : string;
            propThree : number;
            propFour : boolean;
        }
        `.replace(/\s+/g, " ");

        let expected = `
        public class Beans {
            [JsonProperty("propOne")]
            public string PropOne;

            [JsonProperty("propTwo")]
            public string PropTwo;

            [JsonProperty("propThree")]
            public int PropThree;

            [JsonProperty("propFour")]
            public bool PropFour;
        }
        `
            .replace(/\s+/g, " ")
            .trim();

        let actual = tsConverter
            .convertInterfaceToCSharp(input)
            .replace(/\s+/g, " ")
            .trim();

        assert.deepEqual(actual, expected);
    });

    test("generate class - primative lists", () => {
        let input = `
        interface Beans {
            propOne : string[];
            propTwo : boolean[];
            propThree : number[];
            propFour : any[];
        }
        `.replace(/\s+/g, " ");

        let expected = `
        public class Beans {
            [JsonProperty("propOne")]
            public IEnumerable<string> PropOne;

            [JsonProperty("propTwo")]
            public IEnumerable<bool> PropTwo;

            [JsonProperty("propThree")]
            public IEnumerable<int> PropThree;

            [JsonProperty("propFour")]
            public IEnumerable<object> PropFour;
        }
        `
            .replace(/\s+/g, " ")
            .trim();

        let actual = tsConverter
            .convertInterfaceToCSharp(input)
            .replace(/\s+/g, " ")
            .trim();

        assert.deepEqual(actual, expected);
    });

    test("generate class - custom object", () => {
        let input = `
        interface Beans {
            propOne : CustomClass;
        }
        `.replace(/\s+/g, " ");

        let expected = `
        public class Beans {
            [JsonProperty("propOne")]
            public CustomClass PropOne;
        }
        `
            .replace(/\s+/g, " ")
            .trim();

        let actual = tsConverter
            .convertInterfaceToCSharp(input)
            .replace(/\s+/g, " ")
            .trim();

        assert.deepEqual(actual, expected);
    });

    test("generate class - custom object list", () => {
        let input = `
        interface Beans {
            propOne : CustomClass[];
        }
        `.replace(/\s+/g, " ");

        let expected = `
        public class Beans {
            [JsonProperty("propOne")]
            public IEnumerable<CustomClass> PropOne;
        }
        `
            .replace(/\s+/g, " ")
            .trim();

        let actual = tsConverter
            .convertInterfaceToCSharp(input)
            .replace(/\s+/g, " ")
            .trim();

        assert.deepEqual(actual, expected);
    });

    test("generate class - empty interface", () => {
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
            .convertInterfaceToCSharp(input)
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

    test("extract property - primative", () => {
        let input = `
        interface Beans {
            propertyOne : string;
        }
        `.replace(/\s+/g, " ");

        let expected = [{ property: "propertyOne", type: "string" }];

        let actual = tsConverter.extractProperties(input);

        assert.deepEqual(actual, expected);
    });

    test("extract property - list", () => {
        let input = `
        interface Beans {
            propertyOne : string[];
        }
        `.replace(/\s+/g, " ");

        let expected = [{ property: "propertyOne", type: "string[]" }];

        let actual = tsConverter.extractProperties(input);

        assert.deepEqual(actual, expected);
    });
});
