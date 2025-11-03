# Mejora del Chatbot para Responder a Todas las Consultas Considerando Productos

## Información Recopilada
- **Chatbot Actual**: Usa react-chatbot-kit en frontend con acciones básicas (saludo, recomendaciones basadas en mascotas) y OpenAI para mensajes generales.
- **Backend**: ChatbotController.cs llama a OpenAI con prompt que incluye mascotas del usuario, pero no productos.
- **Productos**: Disponibles vía ProductosController.cs, con categorías, nombres, descripciones, precios, stock, etc.
- **Necesidad**: El chatbot debe responder a todas las consultas del cliente considerando los productos disponibles en la página, incluyendo descripciones para recomendaciones, explicaciones, sexo de la mascota, y preguntar por cuál mascota si hay múltiples.

## Plan de Mejora
- Modificar ChatbotController.cs para incluir información de productos activos (nombres, descripciones, precios, categorías) en el prompt del sistema.
- Incluir categorías de productos para mejor contexto.
- Instruir al AI en el prompt para basar respuestas en productos reales, explicar recomendaciones basadas en descripciones, considerar sexo y otras características de la mascota, y preguntar por cuál mascota si hay múltiples.
- Esto permitirá al chatbot responder preguntas como "¿Qué snacks tienes para perros?", "Recomienda algo para gatos", "¿Cuál es el precio de X producto?", explicar por qué recomienda algo, y personalizar por mascota específica.

## Pasos a Realizar
- [x] Modificar ChatbotController.cs para obtener productos activos y categorías.
- [x] Actualizar el systemContent en ChatbotController.cs para incluir lista detallada de productos (nombre, descripción, precio, categoría).
- [x] Ajustar el prompt para que el AI responda basado en productos reales, explique recomendaciones detalladamente, responda a preguntas sobre por qué recomienda ciertos productos, y entienda variaciones informales, errores de tipeo y mayúsculas/minúsculas.
- [x] Probar la funcionalidad del chatbot con consultas sobre productos.

## Archivos a Editar
- Backend/Controllers/ChatbotController.cs

## Pasos de Seguimiento
- [ ] Verificar que el chatbot responda correctamente a consultas sobre productos.
- [ ] Probar con diferentes tipos de preguntas (precios, recomendaciones, disponibilidad).
- [ ] Asegurar que las respuestas sean personalizadas con las mascotas del usuario y productos disponibles, explicando recomendaciones.
