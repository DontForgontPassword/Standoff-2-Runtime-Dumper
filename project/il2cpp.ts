/*

    With kindness from experienceinmymind <3

    С добром от experienceinmymind <3


*/


export const Il2cppFunctionManager =
{
    get_method_from_class: new NativeFunction(ptr(0), 'pointer', ['pointer', 'pointer', 'int']),
    get_class_by_name: new NativeFunction(ptr(0), 'pointer', ['pointer', 'pointer', 'pointer']),
    get_methods_from_class: new NativeFunction(ptr(0), 'pointer', ['pointer', 'pointer']),
    get_assembly: new NativeFunction(ptr(0), 'pointer', ['pointer']),
    get_array_length: new NativeFunction(ptr(0), 'pointer', ['pointer']),
    get_return_type: new NativeFunction(ptr(0), 'pointer', ['pointer']),
    get_class_from_type: new NativeFunction(ptr(0), 'pointer', ['pointer']),
    get_class_name: new NativeFunction(ptr(0), 'pointer', ['pointer']),
    get_param: new NativeFunction(ptr(0), 'pointer', ['pointer', 'int']),
    get_param_name: new NativeFunction(ptr(0), 'pointer', ['pointer', 'int']),
    get_fields_from_class: new NativeFunction(ptr(0), 'pointer', ['pointer', 'pointer']),
    get_assembly_type_handle: new NativeFunction(ptr(0), 'pointer', ['pointer', 'int']),
    get_type_from_handle: new NativeFunction(ptr(0), 'pointer', ['pointer']),
    get_class_interfaces: new NativeFunction(ptr(0), 'pointer', ['pointer', 'pointer']),
    get_field_static_values: new NativeFunction(ptr(0), 'pointer', ['pointer', 'pointer']),
    get_class_properties: new NativeFunction(ptr(0), 'pointer', ['pointer', 'pointer']),
}

export interface IScriptAnnotation {
    ScriptMethod: any[];
}


export function il2cpp_load_symbols() {
    const il2cpp = Module.getBaseAddress("libil2cpp.so");

    if (il2cpp == null) {
        return;
    }

    console.log("Functions loaded")

    Il2cppFunctionManager.get_class_by_name = new NativeFunction(il2cpp.add(0x1F3B59C), 'pointer', ['pointer', 'pointer', 'pointer']);
    Il2cppFunctionManager.get_methods_from_class = new NativeFunction(il2cpp.add(0x1F12668), 'pointer', ['pointer', 'pointer']);
    Il2cppFunctionManager.get_assembly = new NativeFunction(il2cpp.add(0x1EE8FB8), 'pointer', ['pointer']);
    Il2cppFunctionManager.get_array_length = new NativeFunction(il2cpp.add(0x1EA918C), 'pointer', ['pointer']);
    Il2cppFunctionManager.get_method_from_class = new NativeFunction(il2cpp.add(0x1F1274C), 'pointer', ['pointer', 'pointer', 'int']);
    Il2cppFunctionManager.get_return_type = new NativeFunction(il2cpp.add(0x1F3BA3C), 'pointer', ['pointer']);
    Il2cppFunctionManager.get_class_from_type = new NativeFunction(il2cpp.add(0x1F3B6A0), 'pointer', ['pointer']);
    Il2cppFunctionManager.get_class_name = new NativeFunction(il2cpp.add(0x1F3B628), 'pointer', ['pointer']);
    Il2cppFunctionManager.get_param = new NativeFunction(il2cpp.add(0x1F409F4), 'pointer', ['pointer', 'int']);
    Il2cppFunctionManager.get_param_name = new NativeFunction(il2cpp.add(0x1F40A14), 'pointer', ['pointer', 'int']);
    Il2cppFunctionManager.get_fields_from_class = new NativeFunction(il2cpp.add(0x1F12420), 'pointer', ['pointer', 'pointer']);
    Il2cppFunctionManager.get_assembly_type_handle = new NativeFunction(il2cpp.add(0x1F15644), 'pointer', ['pointer', 'int']); // _ZN6il2cpp2vm13MetadataCache21GetAssemblyTypeHandleEPK11Il2CppImagei
    Il2cppFunctionManager.get_type_from_handle = new NativeFunction(il2cpp.add(0x1F3F664), 'pointer', ['pointer']);     // Il2CppClass_0 *__fastcall il2cpp::vm::MetadataCache::GetTypeInfoFromHandle(Il2CppMetadataTypeHandle handle)
    Il2cppFunctionManager.get_class_interfaces = new NativeFunction(il2cpp.add(0x1F125A0), 'pointer', ['pointer', 'pointer']);
    Il2cppFunctionManager.get_field_static_values = new NativeFunction(il2cpp.add(0x1F04D48), 'pointer', ['pointer', 'pointer']);
    Il2cppFunctionManager.get_class_properties = new NativeFunction(il2cpp.add(0x1F12958), 'pointer', ['pointer', 'pointer']);
}

export function image_get_class(Image: NativePointer, Index: number) {
    let AssemblyTypeHandle = Il2cppFunctionManager.get_assembly_type_handle(Image, Index);

    return Il2cppFunctionManager.get_type_from_handle(AssemblyTypeHandle);
}

export function dump_type(ScriptAnnotation: IScriptAnnotation, Il2cpp: NativePointer, Il2CppKlass: NativePointer) {
    //console.log(Il2CppKlass)
    let KlassAnnotation = "";
    KlassAnnotation += "\n// Namespace: " + Il2CppKlass.add(0x18).readPointer().readCString() + "\n";

    let Flags = Il2CppKlass.add(0x118).readInt()
    if (Flags & 0x00002000) {
        KlassAnnotation += "[Serializable]\n";
    }

    const IsValueType = Il2CppKlass.add(0x28).readInt() >> 31;
    const IsEnum = (Il2CppKlass.add(0x135).readInt() >> 2) & 1
    const Visibility = Flags & 0x00000007;

    //console.log(Visibility)

    switch (Visibility) {
        case 0x00000001:
        case 0x00000002:
            KlassAnnotation += "public ";
            break;
        case 0x00000000:
        case 0x00000006:
        case 0x00000005:
            KlassAnnotation += "internal ";
            break;
        case 0x00000003:
            KlassAnnotation += "private ";
            break;
        case 0x00000004:
            KlassAnnotation += "protected ";
            break;
        case 0x00000007:
            KlassAnnotation += "protected internal ";
            break;
        default:
            KlassAnnotation += "unknown ";
            break;
    }

    if (Flags & 0x00000080 && Flags & 0x00000100) {
        KlassAnnotation += "static ";
    } else if (!(Flags & 0x00000020) && Flags & 0x00000080) {
        KlassAnnotation += "abstract ";
    } else if (!IsValueType && !IsEnum && Flags & 0x00000100) {
        KlassAnnotation += "sealed ";
    }
    if (Flags & 0x00000020) {
        KlassAnnotation += "interface ";
    } else if (IsEnum) {
        KlassAnnotation += "enum ";
    } else if (IsValueType) {
        KlassAnnotation += "struct ";
    } else {
        KlassAnnotation += "class ";
    }

    KlassAnnotation += Il2cppFunctionManager.get_class_name(Il2CppKlass).readCString();

    let Extends: string[] = [];

    const Parent = Il2CppKlass.add(0x58).readPointer();

    if (!IsValueType && !IsEnum && Parent) {
        if (Parent != null && Parent.toInt32() != 0x0) {
            const parent_type = Parent.add(0x20).readPointer().add(0x8).readInt();
            if (parent_type != 0x1c) {
                Extends.push(Il2cppFunctionManager.get_class_name(Parent).readCString() as string);
            }
        }
    }

    let Iterator = Memory.alloc(Process.pointerSize);
    let Interface = null;
    while (Interface = Il2cppFunctionManager.get_class_interfaces(Il2CppKlass, Iterator)) {
        if (Interface == null && Parent.toInt32() == 0x0) break;
        Extends.push(Il2cppFunctionManager.get_class_name(Interface).readCString() as string);
    }
    if (Extends.length != 0) {
        KlassAnnotation += " : ".concat(Extends[0]);
        for (let index = 1; index < Extends.length; ++index) {
            KlassAnnotation += ", ".concat(Extends[index]);
        }
    }


    KlassAnnotation += "\n{\n"

    KlassAnnotation += dump_fields(Il2CppKlass)

    KlassAnnotation += dump_property(Il2CppKlass)

    KlassAnnotation += dump_method(ScriptAnnotation, Il2cpp, Il2CppKlass)

    KlassAnnotation += "}\n"

    return KlassAnnotation
}

export function dump_fields(Il2CppKlass: NativePointer) {
    let Il2cppFieldsIterator = Memory.alloc(Process.pointerSize);

    let Field = NULL;

    const IsEnum = (Il2CppKlass.add(0x135).readInt() >> 2) & 1

    let FieldAnnotation = ""

    let FieldCount = Il2CppKlass.add(0x124).readU16()

    if (FieldCount > 0)
        FieldAnnotation += "\n\t// Fields\n"

    while (Field = Il2cppFunctionManager.get_fields_from_class(Il2CppKlass, Il2cppFieldsIterator)) {
        if (Field == null || Field.isNull()) break;

        FieldAnnotation += "\t"

        let Flags = Field.add(8).readPointer().add(8).readU16()
        const access = Flags & 0x0007;

        switch (access) {
            case 0x0001:
                FieldAnnotation += "private ";
                break;
            case 0x0006:
                FieldAnnotation += "public ";
                break;
            case 0x0004:
                FieldAnnotation += "protected ";
                break;
            case 0x0003:
            case 0x0002:
                FieldAnnotation += "internal ";
                break;
            case 0x0005:
                FieldAnnotation += "protected internal ";
                break;
        }
        if (Flags & 0x0040) {
            FieldAnnotation += "const ";
        } else {
            if (Flags & 0x0010) {
                FieldAnnotation += "static ";
            }
            if (Flags & 0x0020) {
                FieldAnnotation += "readonly ";
            }
        }

        const type = Field.add(8).readPointer()

        const Klass = Il2cppFunctionManager.get_class_from_type(type)

        FieldAnnotation += convert_c_type(Il2cppFunctionManager.get_class_name(Klass).readCString() as string) + " " + Field.readPointer().readCString()

        if (Flags & 0x0040 && IsEnum) {
            let Value = Memory.alloc(Process.pointerSize);
            Il2cppFunctionManager.get_field_static_values(Field, Value)
            if (Value != null && Value.toInt32() != 0x0) {
                FieldAnnotation += " = " + Value.readInt().toString() + ";"
            }
        }

        if (!IsEnum)
            FieldAnnotation += "; // 0x" + Field.add(0x18).readInt().toString(16) + "\n"
        else
            FieldAnnotation += "\n"
    }

    return FieldAnnotation
}

function get_method_modifier(flags: number) {

    let output = ""

    let access = flags & 0x0007;
    switch (access) {
        case 0x0001:
            output += "private ";
            break;
        case 0x0006:
            output += "public ";
            break;
        case 0x0004:
            output += "protected ";
            break;
        case 0x0003:
        case 0x0002:
            output += "internal ";
            break;
        case 0x0005:
            output += "protected internal ";
            break;
    }
    if (flags & 0x0010) {
        output += "static ";
    }
    if (flags & 0x0400) {
        output += "abstract ";
        if ((flags & 0x0100) == 0x0000) {
            output += "override ";
        }
    } else if (flags & 0x0020) {
        if ((flags & 0x0100) == 0x0000) {
            output += "sealed override ";
        }
    } else if (flags & 0x0040) {
        if ((flags & 0x0100) == 0x0100) {
            output += "virtual ";
        } else {
            output += "override ";
        }
    }
    if (flags & 0x2000) {
        output += "extern ";
    }
    return output;
}

export function dump_property(Il2CppKlass: NativePointer) {
    let Il2cppPropIterator = Memory.alloc(Process.pointerSize);

    let Prop = NULL;

    const IsEnum = (Il2CppKlass.add(0x135).readInt() >> 2) & 1

    let PropertyAnnotation = ""

    let propertyCount = Il2CppKlass.add(0x122).readU16()
    if (propertyCount > 0)
        PropertyAnnotation += "\n\t// Properties\n\t"



    while (Prop = Il2cppFunctionManager.get_class_properties(Il2CppKlass, Il2cppPropIterator)) {
        if (Prop == null || Prop.isNull()) break;
        let get = Prop.add(0x10).readPointer();
        let set = Prop.add(0x18).readPointer();

        let Prop_Class = null

        if (get && get.toInt32() != 0x0) {
            let mask = get.add(0x4C).readInt() & 0x0007
            PropertyAnnotation += get_method_modifier(mask);
            Prop_Class = Il2cppFunctionManager.get_class_from_type(get.add(0x28).readPointer());
        } else if (set) {
            let mask = set.add(0x4C).readInt() & 0x0007
            PropertyAnnotation += get_method_modifier(mask);
            let param = Il2cppFunctionManager.get_param(set, 0);
            Prop_Class = Il2cppFunctionManager.get_class_from_type(param);
        }

        if (Prop_Class) {
            PropertyAnnotation += convert_c_type(Il2cppFunctionManager.get_class_name(Prop).readCString() as string) + " " + Prop.add(8).readPointer().readCString() + " { ";
            if (get) {
                PropertyAnnotation += "get; ";
            }
            if (set) {
                PropertyAnnotation += "set; "
            }
            PropertyAnnotation += "}\n"
        } else {
            PropertyAnnotation += "// Unknown property";
        }

        PropertyAnnotation += "\t";
    }

    return PropertyAnnotation;

}

function convert_c_type(TypeName: string): string {
    const TypeMappings: { [key: string]: string } = {
        "Void": "void",
        "Int32": "int",
        "Boolean": "bool",
        "Single": "float",
        "Double": "double",
        "String": "string"

    };
    return TypeMappings[TypeName] || TypeName;
}


export function dump_method(ScriptAnnotation: IScriptAnnotation, Il2cpp: NativePointer, Il2CppKlass: NativePointer) {
    let Il2cppMethodIterator = Memory.alloc(Process.pointerSize);
    let Method = NULL;
    const IsEnum = (Il2CppKlass.add(0x135).readInt() >> 2) & 1;
    let MethodCount = Il2CppKlass.add(0x120).readU16()
    let MethodAnnotation = ""
    if (MethodCount)
        MethodAnnotation += "\n\t// Methods\n";

    while (Method = Il2cppFunctionManager.get_methods_from_class(Il2CppKlass, Il2cppMethodIterator)) {
        if (Method == null || Method.isNull()) break;

        if (Method.readPointer()) {
            MethodAnnotation += "\t// RVA: 0x" + (Method.readPointer().toUInt32() - Il2cpp.toUInt32()).toString(16).toUpperCase() + " Offset: 0x" + (Method.readPointer().toUInt32() - Il2cpp.toUInt32() - 0x1000).toString(16).toUpperCase() + " VA: 0x" + Method.readPointer().toUInt32().toString(16).toUpperCase();
        } else {
            MethodAnnotation += "\t// RVA: 0x VA: 0x0";
        }

        MethodAnnotation += "\n\t";
        let mask = Method.add(0x4C).readInt() & 0x0007;
        MethodAnnotation += get_method_modifier(mask);

        let returntype = Method.add(0x28).readPointer();
        let returnclass = Il2cppFunctionManager.get_class_from_type(returntype);
        let returntypeName = Il2cppFunctionManager.get_class_name(returnclass).readCString();
        MethodAnnotation += convert_c_type(returntypeName as string) + " " + Method.add(0x18).readPointer().readCString() + "(";

        let MethodScriptAnnotation =
        {
            Address: 0x0,
            Name: "",
        }

        MethodScriptAnnotation.Address = (Method.readPointer().toUInt32() - Il2cpp.toUInt32())
        MethodScriptAnnotation.Name = `${Il2CppKlass.add(0x10).readPointer().readCString()}_${Method.add(0x18).readPointer().readCString()}`

        ScriptAnnotation.ScriptMethod.push(MethodScriptAnnotation)

        let paramcount = Method.add(0x52).readU8();

        for (let i = 0; i < paramcount; i++) {
            let param = Il2cppFunctionManager.get_param(Method, i);
            let attrs = param.add(0x4).readInt();
            if ((param.add(0xB).readInt() >> 5) & 1) {
                if (attrs & 0x0002 && !(attrs & 0x0001)) {
                    MethodAnnotation += "out ";
                } else if (attrs & 0x0001 && !(attrs & 0x0002)) {
                    MethodAnnotation += "in ";
                } else {
                    MethodAnnotation += "ref ";
                }
            } else {
                if (attrs & 0x0001) {

                }
                if (attrs & 0x0002) {
                    MethodAnnotation += "[Out] ";
                }
            }
            let param_class = Il2cppFunctionManager.get_class_from_type(param);
            let ParamName = Il2cppFunctionManager.get_class_name(param_class).readCString();
            MethodAnnotation += convert_c_type(ParamName as string) + " " + Il2cppFunctionManager.get_param_name(Method, i).readCString();
            if (paramcount > 1 && i < paramcount - 1) {
                MethodAnnotation += ", ";
            }
        }
        MethodAnnotation += ") {}\n\n";
    }

    return MethodAnnotation;
}
