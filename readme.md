# ts-csharp

Convert typescript interfaces or classes to csharp classes.

## Example usage

```javascript
import { convertInterfacesToCSharp } from "ts-csharp";

const myTypescriptClassString = `
interface MyTypescriptClass {
    propOne : any;
    propTwo : string;
    propThree : number[];
    propFour : boolean;
}

interface AnotherTypescriptClass {
    nestedObjectsInAList : MyTypescriptClass[];
    recursiveObject : AnotherTypescriptClass;
    isReallyCool : boolean;
}
`;

const myCsharpClass = convertInterfacesToCSharp(myTypescriptClassString);

console.log(myCsharpClass);
```

Generates the following code:

```c#

public class MyTypescriptClass {

    [JsonProperty("propOne")]
    public object PropOne;

    [JsonProperty("propTwo")]
    public string PropTwo;

    [JsonProperty("propThree")]
    public IEnumerable<int> PropThree;

    [JsonProperty("propFour")]
    public bool PropFour;

}

public class AnotherTypescriptClass {

    [JsonProperty("nestedObjectsInAList")]
    public IEnumerable<MyTypescriptClass> NestedObjectsInAList;

    [JsonProperty("recursiveObject")]
    public AnotherTypescriptClass RecursiveObject;

    [JsonProperty("isReallyCool")]
    public bool IsReallyCool;

}
```
