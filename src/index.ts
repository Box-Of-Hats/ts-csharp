interface tsProperty {
    property: string;
    type: string;
}

String.prototype.toPascalCase = function(this: string) {
    return this.length >= 2
        ? `${this[0].toUpperCase()}${this.slice(1)}`
        : this.toUpperCase();
};

export class TypescriptConverter {
    private interfaceNameRegex = /interface ([a-zA-Z0-9]+) /g;
    private interfaceBodyRegex = /(interface [a-zA-Z0-9]+\s{[\sa-zA-Z:;\[\]]+})/g;
    private propertyRegex = /([a-zA-Z0-9]+\s*:\s*[a-zA-Z\[\]]+)/g;

    private typeMappings = {
        string: "string",
        number: "int",
        boolean: "bool",
        any: "object",
        void: "void"
    };

    convertInterfacesToCSharp = (tsInterfaces: string): string => {
        const matches = tsInterfaces.match(this.interfaceBodyRegex);
        if (!matches) {
            return "";
        }
        console.log("matches:", matches.length);

        return matches
            .map(iface => {
                return this.convertInterfaceToCSharp(iface);
            })
            .join("");
    };

    csClass = (className: string, classProperties: string) => {
        return `
            public class ${className} {
                ${classProperties}
            }
        `;
    };

    csProperty = (propertyName: string, propertyType: string) => {
        const isList = propertyType.includes("[");
        propertyType = propertyType.replace(/\[\]/g, "");

        let csType: string;
        if (Object.keys(this.typeMappings).includes(propertyType)) {
            csType = this.typeMappings[propertyType];
        } else {
            csType = propertyType.toPascalCase();
        }

        // Convert list to IEnumerable if necessary
        if (isList) {
            csType = `IEnumerable<${csType}>`;
        }

        const csPropertyName = propertyName.toPascalCase();

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
