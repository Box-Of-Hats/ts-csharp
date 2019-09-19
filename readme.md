# ts-csharp

Convert typescript interfaces to csharp classes

## Example usage

```javascript
const tscharp = require("ts-csharp");

import { convertInterfacesToCSharp } from "ts-csharp";

const myTypescriptClassString = `
interface MyTypescriptClass {
    propOne : string;
    propTwo : string;
    propThree : number;
    propFour : boolean;
}`;

const myCsharpClass = convertInterfacesToCSharp(myTypescriptClassString);

console.log(myCsharpClass);
/*
public class MyTypescriptClass {
    [JsonProperty("propOne")]
    public string PropOne;

    [JsonProperty("propTwo")]
    public string PropTwo;

    [JsonProperty("propThree")]
    public int PropThree;

    [JsonProperty("propFour")]
    public bool PropFour;
}
*/
```
