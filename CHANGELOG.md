# Change Log

All notable changes to this project will be documented in this file.

## [1.0.0] - December 14, 2025

### Implementation
- Automatic renaming of files without extension to `.dart` in Flutter/Dart projects
- Automatic project detection using `pubspec.yaml`
- File creation monitoring with `FileSystemWatcher`
- File creation interception with `onWillCreateFiles`
- Manual command `Dart: Convert to .dart file` for existing files
- Configuration `dartAutoExtension.enabled` to enable/disable functionality
- Support for multiple workspace folders
- Conflict verification before renaming files

### 🔧 Technical
- Implementation in TypeScript
- Activation when detecting Dart/Flutter projects
- Three event capture methods for maximum compatibility
- Robust error handling and edge cases

### 📚 Documentation
- Complete README with usage examples
- Installation guide for development
- Publishing instructions


## [1.0.1] - December 15, 2025

- Improved comments, more descriptive
- Translation of comments, error messages and documentation to English

- For better performance, only searches for new files within the `/lib` folder

## [1.0.2] - December 16, 2025

- Fixed a bug that was renaming folders with `.dart`


---

# Historial de Cambios

Todos los cambios notables de este proyecto serán documentados en este archivo.

## [1.0.0] - 14 de diciembre de 2025

### Implementación
- Renombrado automático de archivos sin extensión a `.dart` en proyectos Flutter/Dart
- Detección automática de proyectos mediante `pubspec.yaml`
- Monitoreo de archivos creados con `FileSystemWatcher`
- Interceptación de creación de archivos con `onWillCreateFiles`
- Comando manual `Dart: Convertir a archivo .dart` para archivos existentes
- Configuración `dartAutoExtension.enabled` para habilitar/deshabilitar la funcionalidad
- Soporte para múltiples carpetas de workspace
- Verificación de conflictos antes de renombrar archivos

### 🔧 Técnico
- Implementación en TypeScript
- Activación al detectar proyectos Dart/Flutter
- Tres métodos de captura de eventos para máxima compatibilidad
- Manejo robusto de errores y casos edge

### 📚 Documentación
- README completo con ejemplos de uso
- Guía de instalación para desarrollo
- Instrucciones de publicación


## [1.0.1] - 15 de diciembre de 2025

- Mejora de comentarios, más descriptivos
- Traducción de comentarios, mensajes de error y documentación al inglés.

- Por mayor rendimiento solo busca nuevos archivos dentro de la carpeta `/lib` 

## [1.0.2] - 16 de diciembre de 2025

- Arregla un error que renombraba las carpetas con `.dart`
