import "frida-il2cpp-bridge"

Il2Cpp.perform(() => {
    const base = Module.findBaseAddress("libil2cpp.so");
    if (!base) {
        return;
    }

})