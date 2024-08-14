import "frida-il2cpp-bridge";
import "fs"
import { dump_type, il2cpp_load_symbols, Il2cppFunctionManager, image_get_class, IScriptAnnotation } from "./il2cpp.js";
import { appendFile, appendFileSync, writeFile, writeFileSync } from "fs";

const ScriptAnnotation: IScriptAnnotation =
{
    ScriptMethod: []
}

Il2Cpp.perform(() => {
    const il2cpp = Module.getBaseAddress("libil2cpp.so");

    if (il2cpp == null) {
        console.log("Failed to get il2cpp base address");
        return;
    }

    
    il2cpp_load_symbols()

    let result = ""

    const GetAssemblies = new NativeFunction(il2cpp.add(0x1EE8F54), 'pointer', []);
    const Size = GetAssemblies().add(0x4).readInt()

    for (let assemblyIndex = 0; assemblyIndex <= Size; assemblyIndex++) {
        const assembly = GetAssemblies().readPointer().add(assemblyIndex * 0x8).readPointer(); // image
        result += `// Image ${assemblyIndex}: ${assembly.readPointer().readPointer().readCString()}\n`

    }

    const AssemblyCSharp = Il2cppFunctionManager.get_assembly(Memory.allocUtf8String("Assembly-CSharp.dll")); // image

    for (let index = 0; index < 10; index++) { // 20729
        let Klass = image_get_class(AssemblyCSharp.readPointer(), index);

        result += dump_type(ScriptAnnotation, il2cpp, Klass)
        
        console.log(index)
    }

    writeFileSync("/data/data/com.axlebolt.standoff2/files/script.json", JSON.stringify(ScriptAnnotation))
    writeFileSync("/data/data/com.axlebolt.standoff2/files/dump.cs", result);

});
