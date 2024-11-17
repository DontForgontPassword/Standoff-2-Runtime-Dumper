import "frida-il2cpp-bridge";
import {
  dump_type,
  il2cpp_load_symbols,
  il2cpp_functions,
  image_get_class,
  IScriptAnnotation,
} from "./il2cpp.js";
import { writeFileSync } from "fs";

const ScriptAnnotation: IScriptAnnotation = {
  ScriptMethod: [],
};

Il2Cpp.perform(() => {
  const il2cpp = Module.getBaseAddress("libil2cpp.so");

  if (il2cpp == null) {
    console.log("Failed to get il2cpp base address");
    return;
  }

  il2cpp_load_symbols();

  let dump_result = "";

  const get_assembly = new NativeFunction(il2cpp.add(0x1ee8f54), "pointer", []);
  const assemblies_size = get_assembly().add(0x4).readInt();

  for (
    let assemblyIndex = 0;
    assemblyIndex <= assemblies_size;
    assemblyIndex++
  ) {
    const assembly = get_assembly()
      .readPointer()
      .add(assemblyIndex * 0x8)
      .readPointer(); // Il2cppImage
    dump_result += `// Image ${assemblyIndex}: ${assembly
      .readPointer()
      .readPointer()
      .readCString()}\n`;
  }

  const AssemblyCSharp = il2cpp_functions.get_assembly(
    Memory.allocUtf8String("Assembly-CSharp.dll")
  ); // Il2cppImage

  const KlassCount = 0; // Provide how much classes you need to dump

  for (let index = 0; index < KlassCount; index++) {
    let Klass = image_get_class(AssemblyCSharp.readPointer(), index);

    dump_result += dump_type(ScriptAnnotation, il2cpp, Klass);
  }

  writeFileSync(
    "/data/data/com.axlebolt.standoff2/files/script.json",
    JSON.stringify(ScriptAnnotation)
  );
  writeFileSync("/data/data/com.axlebolt.standoff2/files/dump.cs", dump_result);
});
