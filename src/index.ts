interface tsProperty {
    property: string;
    type: string;
}

export class TypescriptConverter {
    private interfaceNameRegex = /interface ([a-zA-Z0-9]+) /g;
    private propertyRegex = /([a-zA-Z0-9]+\s*:\s*[a-zA-Z]+)/g;

    private typeMappings = {
        string: "string",
        number: "int",
        boolean: "bool",
        any: "object",
        void: "void"
    };

    csClass = (className: string, classProperties: string) => {
        return `
            public class ${className} {
                ${classProperties}
            }
        `;
    };

    csProperty = (propertyName: string, propertyType: string) => {
        const csType = this.typeMappings[propertyType];

        const csPropertyName = `${propertyName[0].toUpperCase()}${propertyName.slice(
            1
        )}`;

        return `
        [JsonProperty("${propertyName}")]
        public ${csType} ${csPropertyName};
        `;
    };

    convertInterfaceToCSharp = (tsInterface: string): string => {
        const interfaceName = this.extractInterfaceName(tsInterface);

        const props = this.extractProperties(tsInterface);

        const csProps = props
            .map(property => {
                return this.csProperty(property.property, property.type);
            })
            .join("");

        return this.csClass(interfaceName, csProps);
    };

    extractInterfaceName = (tsInterface: string): string => {
        this.interfaceNameRegex.lastIndex = 0;
        let matches = this.interfaceNameRegex.exec(tsInterface);
        if (!matches || matches.length === 0) {
            return null;
        }
        return matches[matches.length - 1];
    };

    extractProperties = (tsInterface: string): tsProperty[] => {
        this.propertyRegex.lastIndex = 0;

        let matches = tsInterface.match(this.propertyRegex);
        if (!matches) {
            return [];
        }

        let tsProperties: tsProperty[] = matches.map(match => {
            const components = match.split(":");
            return {
                property: components[0].trim(),
                type: components[1].trim()
            };
        });
        return tsProperties;
    };
}
