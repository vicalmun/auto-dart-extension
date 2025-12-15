# Dart Auto Extension

This Visual Studio Code extension automatically adds the `.dart` extension to files you create without an extension in Flutter/Dart projects.
`my_file` -> `my_file.dart`

## What does it do?
Automatically detects Dart/Flutter projects (by other `.dart` files or when a `pubspec.yaml` exists)
When a file is created, it adds the `.dart` extension, making it easy to create Dart classes.
Additionally:
- No additional configuration required
- Works transparently in the background

## How does it work?

When you create a file without an extension in a Dart/Flutter project (for example: `my_class`), the extension automatically renames it to `my_class.dart` before the file is created.

## Requirements

- Visual Studio Code 1.74.0 or higher
- A workspace containing a `pubspec.yaml` file or Dart files

## Configuration

The extension works automatically, but you can disable it if needed:

```json
{
  "dartAutoExtension.enabled": false
}
```

## Use Cases
### When extension is automatically added

- Create file: `controller` → `controller.dart`
- Create file: `models/user` → `models/user.dart`
- Create file: `utils/helper` → `utils/helper.dart`

### When it is **not** modified

- File with extension: `main.dart` → `main.dart` (no changes)
- File with other extension: `config.json` → `config.json` (no changes)
- Workspaces without Dart/Flutter (not activated)

## Contributing

Contributions are welcome. Please:

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
MIT

## Author
vicalmun

## Support
If you encounter any issues or have suggestions, please open an issue on the GitHub repository.

---

# Dart Auto Extension

Esta extensión para Visual Studio Code agrega automáticamente la extensión `.dart` a los archivos que crees sin extensión en proyectos Flutter/Dart.
`mi_archivo` -> `mi_archivo.dart`

## ¿Qué hace?
Detecta automáticamente proyectos Dart/Flutter (por otros archivos `.dart` o cuando existe un `pubspec.yaml`)
Cuando se crea un archivo agrega la extensión `.dart`, es una forma fácil de crear clases de dart.
Además:
- No requiere configuración adicional
- Funciona de forma transparente en el background

## ¿Cómo funciona?

Cuando creas un archivo sin extensión en un proyecto Dart/Flutter (por ejemplo: `mi_clase`), la extensión automáticamente lo renombra a `mi_clase.dart` antes de que se cree el archivo.

## Requisitos

- Visual Studio Code 1.74.0 o superior
- Un workspace que contenga un archivo `pubspec.yaml` o archivos Dart

## Configuración

La extensión funciona automáticamente, pero puedes deshabilitarla si lo necesitas:

```json
{
  "dartAutoExtension.enabled": false
}
```

## Casos de uso
### Cuándo se agrega extensión automáticamente

- Crear archivo: `controller` → `controller.dart`
- Crear archivo: `models/user` → `models/user.dart`
- Crear archivo: `utils/helper` → `utils/helper.dart`

### Cuándo **no** se modifica

- Archivo con extensión: `main.dart` → `main.dart` (sin cambios)
- Archivo con otra extensión: `config.json` → `config.json` (sin cambios)
- Workspaces sin Dart/Flutter (no se activa)

## Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia
MIT

## Autor
vicalmun

## Soporte
Si encuentras algún problema o tienes sugerencias, por favor abre un issue en el repositorio de GitHub.