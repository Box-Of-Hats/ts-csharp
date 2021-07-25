const interfaceNameRegex = /(interface|class) ([a-zA-Z0-9?]+) /g;
const interfaceBodyRegex = /((interface|class) [a-zA-Z0-9?]+\s*{[\sa-zA-Z:?;\[\]]+})/g;
const interfaceBodyExportsOnlyRegex = /(export (interface|class) [a-zA-Z0-9?]+\s*{[\sa-zA-Z:?;\[\]]+})/g;
const propertyRegex = /([a-zA-Z0-9?]+\s*:\s*[a-zA-Z\[\]]+)/g;

export interface TsProperty {
    property: string;
    type: string;
}

const convertToPascalCase = (str: string) => {
    return str.length >= 2
        ? `${str[0].toUpperCase()}${str.slice(1)}`
        : str.toUpperCase();
};

const typeMappings = {
    string: "string",
    number: "int",
    boolean: "bool",
    any: "object",
    void: "void",
};

function convertInterfacesToCSharp(sInterfaces: string);
function convertInterfacesToCSharp(sInterfaces: string, exportsOnly: boolean);
function convertInterfacesToCSharp(
    sInterfaces: string,
    exportsOnly: boolean,
    classPrefix: string
);
function convertInterfacesToCSharp(
    sInterfaces: string,
    exportsOnly: boolean,
    classPrefix: string,
    classSuffix: string
);

function convertInterfacesToCSharp(
    tsInterfaces: string,
    exportsOnly?: boolean,
    classPrefix?: string,
    classSuffix?: string
): string {
    const matches = exportsOnly
        ? tsInterfaces.match(interfaceBodyExportsOnlyRegex)
        : tsInterfaces.match(interfaceBodyRegex);
    if (!matches) {
        return "";
    }

    return matches
        .map((iface) => {
            return convertInterfaceToCSharp(
                iface,
                classPrefix ? classPrefix : "",
                classSuffix ? classSuffix : ""
            );
        })
        .join("");
}

const csClass = (className: string, classProperties: string) => {
    return `
public class ${className} {
    ${classProperties}
}
    `;
};

const csProperty = (propertyName: string, propertyType: string) => {
    const isList = propertyType.includes("[");
    propertyType = propertyType.replace(/\[\]/g, "");

    let csType: string;
    if (Object.keys(typeMappings).includes(propertyType)) {
        csType = typeMappings[propertyType];
    } else {
        csType = convertToPascalCase(propertyType);
    }

    // Convert list to IEnumerable if necessary
    if (isList) {
        csType = `IEnumerable<${csType}>`;
    }

    const csPropertyName = convertToPascalCase(propertyName);

    return `
    [JsonProperty("${propertyName}")]
    public ${csType} ${csPropertyName};
    `;
};

const convertInterfaceToCSharp = (
    tsInterface: string,
    classPrefix: string,
    classSuffix: string
): string => {
    const interfaceName = `${classPrefix}${extractInterfaceName(
        tsInterface
    )}${classSuffix}`;

    const props = extractProperties(tsInterface);

    const csProps = props
        .map((property) => {
            return csProperty(property.property, property.type);
        })
        .join("");

    return csClass(interfaceName, csProps);
};

export const extractInterfaceName = (tsInterface: string): string => {
    interfaceNameRegex.lastIndex = 0;
    let matches = interfaceNameRegex.exec(tsInterface);
    if (!matches || matches.length === 0) {
        return "";
    }
    return matches[matches.length - 1];
};

export const extractProperties = (tsInterface: string): TsProperty[] => {
    propertyRegex.lastIndex = 0;

    let matches = tsInterface.match(propertyRegex);
    if (!matches) {
        return [];
    }

    let tsProperties: TsProperty[] = matches.map((match) => {
        const components = match.split(":");
        return {
            property: components[0].trim().replace("?", ""),
            type: components[1].trim(),
        };
    });
    return tsProperties;
};

export { convertInterfacesToCSharp };
