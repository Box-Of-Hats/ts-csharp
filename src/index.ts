export class TypescriptConverter {
    private interfaceNameRegex = /interface ([a-zA-Z0-9]+) /g;

    csharpClass = (className: string, classProperties: string) => {
        return `
            public class ${className} {
                ${classProperties}
            }
        `;
    };

    convertInterfaceToCsharp = (tsInterface: string): string => {
        const interfaceName = this.extractInterfaceName(tsInterface);

        return this.csharpClass(interfaceName, "");
    };

    extractInterfaceName = (tsInterface: string): string => {
        this.interfaceNameRegex.lastIndex = 0;
        let matches = this.interfaceNameRegex.exec(tsInterface);
        if (!matches || matches.length === 0) {
            return null;
        }
        return matches[matches.length - 1];
    };
}
